var Base = require('stdopt/base')
var ip = require('ip')
var os = require('os')

function Address (a) {
  if (this instanceof Address) Base.call(this, a)
  else return new Address(a)
}

Address.parse = function (a) {
  if (ip.isV6Format(a)) {
    return a
  } else if (ip.isV4Format(a)) {
    return '::ffff:' + a
  } else if (a === os.hostname()) {
    return '::ffff:127.0.0.1'
  }
}

module.exports = Address
