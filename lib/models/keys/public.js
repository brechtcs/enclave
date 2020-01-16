var { base32 } = require('rfc4648')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var PublicKey = Base.implement('enclave public key')
var crypto = require('crypto')

PublicKey.isValid = function (k) {
  return typeof k === 'object' &&
    k.asymmetricKeyType === 'ed25519' &&
    k.type === 'public'
}

PublicKey.from = function (pem) {
  var k = crypto.createPublicKey({
    key: pem,
    format: 'pem',
    type: 'spki'
  })

  return PublicKey(k).check()
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
