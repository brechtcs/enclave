var { getter } = require('stdprop')
var { hash, number, string } = require('stdopt')
var Address = require('./address')
var Base = require('stdopt/base')
var Emitter = require('events')
var PublicKey = require('./keys/public')
var url = require('url')

var Guest = Base.implement('enclave guest')
var bus = new Emitter()
var cache = []

Guest.parse = function (g) {
  if (!hash(g).isValid) {
    return new Error('Guest must be object')
  }
  var guest = {}
  guest.address = Address(g.address).value()
  guest.key = PublicKey(g.key)
  guest.name = string(g.name).value()
  guest.port = number(g.port).value()
  return guest
}

Guest.add = function (g) {
  cache.push(Guest(g).value())
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
