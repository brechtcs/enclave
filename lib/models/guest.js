var { getter } = require('stdprop')
var { hash, number, string } = require('stdopt')
var Address = require('./address')
var Base = require('stdopt/base')
var PublicKey = require('./keypair/public')
var model = require('stdmodel')
var url = require('url')

var cache = []

var Guest = model(function Guest (g) {
  Base.call(this, g)
})

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
  return Guest(g).use(function (err, guest) {
    if (err) console.warn(err)
    cache.push(guest)
    return this
  })
}

Guest.get = function (key) {
  return Guest(cache.find(g => String(g.key) === key))
}

Guest.list = function () {
  return cache.map(g => Guest(g))
}

Guest.prototype.delete = function () {
  var idx = cache.indexOf(this.value())
  cache.splice(idx, 1)
  return this
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
