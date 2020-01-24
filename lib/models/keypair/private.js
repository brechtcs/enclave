var { getter } = require('stdprop')
var Base = require('stdopt/base')
var PrivateKey = Base.implement('enclave private key')

PrivateKey.parse = function (k) {
  var isValid = typeof k === 'object' &&
    k.asymmetricKeyType === 'ed25519' &&
    k.type === 'private'

  if (isValid) {
    return k
  }
}

getter(PrivateKey.prototype, 'pem', function () {
  return this.value().export({ format: 'pem', type: 'pkcs8' })
})

module.exports = PrivateKey
