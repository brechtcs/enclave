var Guest = require('../models/guest')

module.exports = function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  var guests = Guest.list().map(display)

  return ['main', attrs, ['ul', guests]]
}

function display (guest) {
  var href = `guests/${guest.key}/`
  return ['li', ['a', { href }, guest.name]]
}
