var { createProxyServer } = require('http-proxy')
var Guest = require('../../models/guest')
var gateway = require('./gateway')

var proxy = createProxyServer()

module.exports.display = display
module.exports.gateway = gateway
module.exports.leave = leave
module.exports.redirect = redirect
module.exports.tunnel = tunnel

function display (req, res) {
  var title = 'Guests'
  var guests = Guest.list().filter(g => !g.isHost)
  res.render('guests', { title, guests })
}

function leave (service) {
  Guest.get(service.name).delete()
}

function redirect (req, res, next) {
  var guest = Guest.get(req.params.key)

  if (guest.isHost) {
    res.redirect(req.url)
  } else if (guest.isValid) {
    res.redirect('/guests/' + req.params.key + req.url)
  } else {
    next()
  }
}

function tunnel (req, res, next) {
  var key, guest
  key = req.params.key
  guest = Guest.get(key)

  if (guest.isError) {
    res.writeHead(404)
    res.end('guest not found: ' + key)
    return
  } else if (guest.isHost) {
    return res.redirect(req.url)
  }

  proxy.web(req, res, { target: guest.url }, function (err) {
    if (err) next(err)
  })
}
