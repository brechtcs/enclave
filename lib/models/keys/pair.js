var Base = require('stdopt/base')
var KeyPair = Base.implement('enclave keypair')
var PrivateKey = require('./private')
var PublicKey = require('./public')
var crypto = require('crypto')
var prop = require('stdprop')

KeyPair.isValid = function (p) {
  return typeof p === 'object' &&
    p.privateKey.isValid() &&
    p.publicKey.isValid()
}

KeyPair.generate = function () {
  var { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  var pair = {}

  prop(pair, 'publicKey', PublicKey(publicKey), 'e')
  prop(pair, 'privateKey', PrivateKey(privateKey))
  return KeyPair(pair).value()
}

module.exports = KeyPair
