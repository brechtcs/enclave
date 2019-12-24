var guests = require('../guests')

module.exports = function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  return ['main', attrs, guests.display()]
}
