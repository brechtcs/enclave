var { hash, string } = require('stdopt')
var { prop, getter } = require('stdprop')
var Base = require('stdopt/base')
var Guest = require('./guest')
var KeyPair = require('./keypair')

var instance = null

function Host (h) {
  if (this instanceof Host) Base.call(this, h)
  else return new Host(h)
}

Host.parse = function (h) {
  if (!hash(h).isValid) {
    return new Error('Host must be object')
  }
  var host = {}
  prop(host, 'keypair', KeyPair(h.keypair).value(), 'e')
  prop(host, 'name', string(h.name).value(), 'ew')
  return host
}

Host.init = function ({ name, port }) {
  if (instance) {
    throw new Error('Host already initialized')
  }
  var keypair = KeyPair.generate()
  var h = Host({ keypair, name })
  instance = h.value()

  Guest.add({
    name: h.name,
    port: port,
    address: '::ffff:127.0.0.1',
    key: h.publicKey.pem
  })

  return h
}

Host.get = function () {
  return Host(instance).use()
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
