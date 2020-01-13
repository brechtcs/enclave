var Base = require('stdopt/base')
var Emitter = require('events')
var Guest = Base.implement('enclave guest')
var PublicKey = require('./keys/public')
var ip = require('ip')
var url = require('url')

var bus = new Emitter()
var cache = []

Guest.isValid = function (g) {
  return typeof g === 'object'
    && typeof g.name === 'string'
    && g.key.isValid()
    && ip.isV6Format(g.address)
    && typeof g.port === 'number'
}

Guest.add = function (g) {
  var guest = {
    name: g.name,
    key: PublicKey.fromBuffer(g.key),
    address: g.address,
    port: g.port
  }

  cache.push(Guest(guest).value())
  bus.emit('change')
}

Guest.get = function (key) {
  return Guest(cache.find(g => g.key.getHex() === key))
}

Guest.list = function () {
  return cache.map(g => Guest(g))
}

Guest.on = bus.on.bind(bus)

Guest.prototype.getUrl = function () {
  var guest = this.value()

  return url.format({
    protocol: 'http:',
    hostname: guest.address,
    port: guest.port
  })
}

module.exports = Guest
