var Base = require('stdopt/base')

function Timestamp (t) {
  if (this instanceof Timestamp) Base.call(this, t)
  else return new Timestamp(t)
}

Timestamp.parse = function (t) {
  if (t instanceof Date) {
    return t
  }
}

module.exports = Timestamp
