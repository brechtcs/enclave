var { getter } = require('stdprop')
var { hash, number, string } = require('stdopt')
var Address = require('./address')
var Base = require('stdopt/base')
var Key = require('./key')
var model = require('stdmodel')

var cache = []
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

Guest.add = function (g) {
  var guest = Guest(g).use()
  cache.push(guest)
  return guest
}

Guest.get = function (key) {
  return Guest(cache.find(g => String(g.key) === key))
}

Guest.list = function () {
  return cache.slice()
}

Guest.prototype.delete = function () {
  var idx = cache.indexOf(this.value())
  cache.splice(idx, 1)
  return this
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

module.exports = Guest
