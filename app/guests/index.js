var { createProxyServer } = require('http-proxy')
var Guest = require('../../models/guest')
var Host = require('../../models/host')

var proxy = createProxyServer()

module.exports.display = display
module.exports.gateway = require('./gateway')
module.exports.leave = leave
module.exports.redirect = redirect
module.exports.tunnel = tunnel

function display (req, res) {
  var host = Host.get()
  var title = 'Guests'
  var guests = Guest.list().filter(function (guest) {
    return String(guest.key) !== String(host.publicKey)
  })

  res.render('guests', { title, guests })
}

function leave (service) {
  Guest.get(service.name).delete()
}

function redirect (req, res) {
  var host = Host.get()

  if (String(host.publicKey) === req.params.key) {
    res.redirect(req.url)
  } else {
    res.redirect('/guests/' + req.params.key + req.url)
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

  req.headers['Enclave-Origin'] = req.get('Enclave-Origin') || String(Host.get().publicKey)

  proxy.web(req, res, { target: guest.url }, function (err) {
    if (err) next(err)
  })
}
