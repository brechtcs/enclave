var Base = require('stdopt/base')
var Key = Base.implement('enclave cryptographic key')

Key.isValid = function (k) {
  return k.asymmetricKeyType === 'ed25519'
}

module.exports = Key
