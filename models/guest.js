var { getter } = require('stdprop')
var { hash, number, string } = require('stdopt')
var Address = require('./address')
var Base = require('stdopt/base')
var Host = require('./host')
var Key = require('./key')
var model = require('stdmodel')

var cache = new Map()
var struct = {
  name: string,
  key: Key,
  address: Address,
  port: number
}

var Guest = model(function Guest (g) {
  Base.call(this, g)
})

Guest.parse = function (g) {
  return hash(g, struct)
}

Guest.get = function (key) {
  return Guest(cache.get(String(key)))
}

Guest.has = function (key) {
  return cache.has(String(key))
}

Guest.join = function (g) {
  var guest = Guest(g).use()
  var key = String(guest.key)

  if (Guest.has(key)) console.warn('Already joined:', guest.name)
  else cache.set(key, guest)
  return guest
}

Guest.list = function () {
  return Array.from(cache.values())
}

Guest.prototype.delete = function () {
  cache.delete(String(this.key))
  return this
}

Guest.prototype.equals = function (g) {
  return String(this.key) === String(g.key)
}

Guest.prototype.toString = function () {
  return 'guest: ' + (this.isValid ? this.value().name : 'None')
}

getter(Guest.prototype, 'key', function () {
  return this.use(function (err, g) {
    if (err) throw err
    return Key(g.key)
  })
})

getter(Guest.prototype, 'name', function () {
  return this.use(function (err, g) {
    if (err) throw err
    return g.name
  })
})

getter(Guest.prototype, 'url', function () {
  return this.use(function (err, g) {
    if (err) throw err
    return `http://[${g.address}]:${g.port}`
  })
})

getter(Guest.prototype, 'isHost', function () {
  var h = Host.get()
  return String(this.key) === String(h.publicKey)
})

module.exports = Guest
