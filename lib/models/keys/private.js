var { getter } = require('stdprop')
var Base = require('stdopt/base')
var PrivateKey = Base.implement('enclave private key')

PrivateKey.isValid = function (k) {
  return typeof k === 'object' &&
    k.asymmetricKeyType === 'ed25519' &&
    k.type === 'private'
}

getter(PrivateKey.prototype, 'pem', function () {
  return this.value().export({ format: 'pem', type: 'pkcs8' })
})

module.exports = PrivateKey
