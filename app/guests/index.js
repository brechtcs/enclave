var Guest = require('../../models/guest')
var gateway = require('./gateway')
var tunnel = require('./tunnel')

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
