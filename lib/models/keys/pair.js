var Base = require('stdopt/base')
var KeyPair = Base.implement('enclave keypair')
var PrivateKey = require('./private')
var PublicKey = require('./public')
var crypto = require('crypto')

KeyPair.isValid = function (p) {
  return typeof p === 'object'
    && p.privateKey.isValid()
    && p.publicKey.isValid()
}

KeyPair.generate = function () {
  var p = crypto.generateKeyPairSync('ed25519')
  var pair = {}

  Object.defineProperty(pair, 'publicKey', {
    enumerable: true,
    writable: false,
    value: PublicKey(p.publicKey)
  })

  Object.defineProperty(pair, 'privateKey', {
    enumerable: false,
    writable: false,
    value: PrivateKey(p.privateKey)
  })

  return KeyPair(pair).value()
}

module.exports = KeyPair
