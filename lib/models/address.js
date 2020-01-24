var Base = require('stdopt/base')
var ip = require('ip')

var Address = Base.implement('IP address')

Address.parse = function (a) {
  if (ip.isV6Format(a)) {
    return a
  } else if (ip.isV4Format(a)) {
    return '::ffff:' + a
  }
}

module.exports = Address
