var Base = require('stdopt/base')
var Mimes = Base.implement('mime type list')

Mimes.isValid = function (m) {
  return Array.isArray(m) && m.every(i => typeof i === 'string')
}

module.exports = Mimes
