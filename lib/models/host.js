var { prop, getter } = require('stdprop')
var Base = require('stdopt/base')
var Host = Base.implement('enclave host')
var KeyPair = require('./keys/pair')
var host = null

Host.isValid = function (h) {
  return typeof h === 'object' &&
    typeof h.name === 'string' &&
    KeyPair.isValid(h.keypair)
}

Host.init = function ({ name }) {
  if (host === null) host = {}
  else throw new Error('Host already initialized')

  prop(host, 'name', name, 'ew')
  prop(host, 'keypair', KeyPair.generate(), 'e')
  return Host(host).check()
}

Host.get = function () {
  return Host(host).check()
}

getter(Host.prototype, 'name', function () {
  return this.value().name
})

getter(Host.prototype, 'publicKey', function (enc) {
  return this.value().keypair.publicKey
})

getter(Host.prototype, 'privateKey', function () {
  return this.value().keypair.privateKey
})

module.exports = Host
