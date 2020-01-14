var { prop, getter } = require('stdprop')
var Base = require('stdopt/base')
var Identity = Base.implement('enclave identity')
var KeyPair = require('./keys/pair')
var id = null

Identity.isValid = function (i) {
  return typeof i === 'object' &&
    typeof id.name === 'string' &&
    KeyPair.isValid(i.keypair)
}

Identity.init = function () {
  if (id === null) id = {}
  else throw new Error('Identity already initialized')

  prop(id, 'name', 'Incognito', 'we')
  prop(id, 'keypair', KeyPair.generate(), 'e')
  return Identity(id).check()
}

Identity.get = function () {
  return Identity(id).check()
}

getter(Identity.prototype, 'name', function () {
  return this.value().name
})

getter(Identity.prototype, 'publicKey', function (enc) {
  return this.value().keypair.publicKey
})

getter(Identity.prototype, 'privateKey', function () {
  return this.value().keypair.privateKey
})

module.exports = Identity
