var Guest = require('../models/guest')

module.exports = function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  var guests = Guest.list().map(function (s) {
    return ['li',
      ['a', { href: `guests/${s.name}/` }, s.name]
    ]
  })

  return ['main', attrs, guests]
}
