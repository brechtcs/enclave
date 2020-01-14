var { getter } = require('stdprop')
var Base = require('stdopt/base')
var PublicKey = Base.implement('enclave public key')
var crypto = require('crypto')

PublicKey.isValid = function (k) {
  return typeof k === 'object' &&
    k.asymmetricKeyType === 'ed25519' &&
    k.type === 'public'
}

PublicKey.fromBuffer = function (buf) {
  var k = crypto.createPublicKey({
    key: buf,
    format: 'der',
    type: 'spki'
  })

  return PublicKey(k).check()
}

getter(PublicKey.prototype, 'buffer', function () {
  return this.value().export({ format: 'der', type: 'spki' })
})

getter(PublicKey.prototype, 'href', function () {
  return this.buffer.slice(-32).toString('hex')
})

module.exports = PublicKey
