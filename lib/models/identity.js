var Base = require('stdopt/base')
var Identity = Base.implement('enclave identity')
var KeyPair = require('./keys/pair')
var id = null

Identity.isValid = function (i) {
  return typeof i === 'object'
    && typeof id.name === 'string'
    && KeyPair.isValid(i.keypair)
}

Identity.init = function () {
  if (id === null) id = {}
  else throw new Error('Identity already initialized')

  id.name = 'Incognito'
  id.keypair = KeyPair.generate()
  return Identity(id).check()
}

Identity.get = function () {
  return Identity(id).check()
}

Identity.prototype.getName = function () {
  return this.value().name
}

Identity.prototype.getKey = function (enc) {
  return this.value().keypair.publicKey
}

Identity.prototype.getPrivate = function () {
  return this.value().keypair.privateKey
}

module.exports = Identity
