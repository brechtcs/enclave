var Base = require('stdopt/base')
var Timestamp = Base.implement('timestamp')

Timestamp.parse = function (t) {
  if (t instanceof Date) {
    return t
  }
}

module.exports = Timestamp
