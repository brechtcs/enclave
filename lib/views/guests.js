var Guest = require('../models/guest')

module.exports = function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  var guests = Guest.list().map(function (g) {
    var guest = g.value()
    var href = `guests/${guest.key}/`
    return ['li', ['a', { href }, guest.name]]
  })

  return ['main', attrs, guests]
}
