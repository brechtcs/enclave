var Base = require('stdopt/base')
var PublicKey = Base.implement('enclave public key')
var crypto = require('crypto')

PublicKey.isValid = function (k) {
  return typeof k === 'object'
    && k.asymmetricKeyType === 'ed25519'
    && k.type === 'public'
}

PublicKey.fromBuffer = function (buf) {
  var k = crypto.createPublicKey({
    key: buf,
    format: 'der',
    type: 'spki'
  })

  return PublicKey(k).check()
}

PublicKey.prototype.getBuffer = function () {
  return this.value().export({ format: 'der', type: 'spki' })
}

PublicKey.prototype.getHex = function () {
  return this.getBuffer().slice(-32).toString('hex')
}

module.exports = PublicKey
