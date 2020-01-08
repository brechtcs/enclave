var Base = require('stdopt/base')
var Identity = Base.implement('enclave identity')
var Key = require('./key')
var crypto = require('crypto')
var id = null

Identity.isValid = function (i) {
  return typeof i === 'object'
    && Key.isValid(i.publicKey)
    && Key.isValid(i.privateKey)
}

Identity.init = function () {
  if (id === null) id = {}
  else throw new Error('Identity already initialized')

  var pair = crypto.generateKeyPairSync('ed25519')

  Object.defineProperty(id, 'publicKey', {
    enumerable: true,
    writable: false,
    value: Key(pair.publicKey).value()
  })

  Object.defineProperty(id, 'privateKey', {
    enumerable: false,
    writable: false,
    value: Key(pair.privateKey).value()
  })

  return Identity(id).check()
}

Identity.get = function () {
  return Identity(id).check()
}

Identity.prototype.getKey = function (encoding) {
  var val = Base.value(this)
  var key = val.publicKey.export({ type: 'spki', format: 'der' }).slice(-32)

  switch (encoding) {
    case 'hex': return key.toString(encoding)
    default: return val.publicKey
  }
}

Identity.prototype.getPrivate = function () {
  return Base.value(this).privateKey
}

module.exports = Identity
