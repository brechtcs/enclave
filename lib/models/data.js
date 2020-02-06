var { hash, string } = require('stdopt')
var Base = require('stdopt/base')

var struct = {
  bytes: Bytes,
  mime: string
}

function Data (d) {
  if (this instanceof Data) Base.call(this, d)
  else return new Data(d)
}

Data.fromText = function (txt) {
  return new Data({
    bytes: Buffer.from(txt),
    mime: 'text/plain'
  })
}

Data.parse = function (d) {
  return hash(d, struct)
}

Data.prototype.toString = function () {
  return this.use(function (err, d) {
    if (err) throw err
    if (d.mime !== 'text/plain') {
      throw new Error('Mime type not yet implemented: ' + d.mime)
    }
    return String(d.bytes)
  })
}

module.exports = Data

/**
 * Bytes definition
 */
function Bytes (b) {
  if (this instanceof Bytes) Base.call(this, b)
  else return new Bytes(b)
}

Bytes.parse = function (b) {
  if (Buffer.isBuffer(b)) {
    return b
  }
}
