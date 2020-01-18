var { getter } = require('stdprop')
var Base = require('stdopt/base')
var Emitter = require('events')
var Guest = Base.implement('enclave guest')
var PublicKey = require('./keys/public')
var ip = require('ip')
var url = require('url')

var bus = new Emitter()
var cache = []

Guest.isValid = function (g) {
  return typeof g === 'object' &&
    typeof g.name === 'string' &&
    typeof g.port === 'number' &&
    ip.isV6Format(g.address) &&
    g.key.isValid
}

Guest.add = function (g) {
  var guest = {
    name: g.name,
    key: PublicKey.from(g.key),
    address: g.address,
    port: g.port
  }

  cache.push(Guest(guest).value())
  bus.emit('change')
}

Guest.get = function (key) {
  return Guest(cache.find(g => String(g.key) === key))
}

Guest.list = function () {
  return cache.map(g => Guest(g))
}

Guest.on = bus.on.bind(bus)

Guest.prototype.delete = function () {
  var idx = cache.indexOf(this.value())
  cache.splice(idx, 1)
  bus.emit('change')
}

Guest.prototype.toString = function () {
  return 'guest: ' + (this.isValid ? this.value().name : 'None')
}

getter(Guest.prototype, 'name', function () {
  return this.value().name
})

getter(Guest.prototype, 'url', function () {
  var guest = this.value()

  return url.format({
    protocol: 'http:',
    hostname: guest.address,
    port: guest.port
  })
})

module.exports = Guest
