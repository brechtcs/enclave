var { base32 } = require('rfc4648')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var crypto = require('crypto')

function PublicKey (k) {
  if (this instanceof PublicKey) Base.call(this, k)
  else return new PublicKey(k)
}

PublicKey.parse = function (k) {
  if (typeof k === 'string' || Buffer.isBuffer(k)) {
    return parse(k)
  } else if (validate(k)) {
    return k
  }
}

PublicKey.prototype.toString = function () {
  return base32.stringify(this.buffer.slice(-32), { pad: false })
}

getter(PublicKey.prototype, 'buffer', function () {
  return this.value().export({ format: 'der', type: 'spki' })
})

getter(PublicKey.prototype, 'pem', function () {
  return this.value().export({ format: 'pem', type: 'spki' })
})

module.exports = PublicKey

/**
 * Private helpers:
 */
function parse (k) {
  try {
    return crypto.createPublicKey({
      key: k,
      format: Buffer.isBuffer(k) ? 'der' : 'pem',
      type: 'spki'
    })
  } catch (err) {
    return err
  }
}

function validate (k) {
  return typeof k === 'object' &&
    k.asymmetricKeyType === 'ed25519' &&
    k.type === 'public'
}
