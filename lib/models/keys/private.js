var Base = require('stdopt/base')
var PrivateKey = Base.implement('enclave private key')

PrivateKey.isValid = function (k) {
  return typeof k === 'object'
    && k.asymmetricKeyType === 'ed25519'
    && k.type === 'private'
}

module.exports = PrivateKey
