var { getter } = require('stdprop')
var { hash, string } = require('stdopt')
var Base = require('stdopt/base')
var Host = require('./host')
var Method = require('./method')
var PublicKey = require('./crypto/public-key')
var VError = require('verror')

var cache = new Map()
var struct = {
  name: string,
  key: PublicKey,
  send: Method
}

function Guest (g) {
  if (this instanceof Guest) Base.call(this, g)
  else return new Guest(g)
}

Guest.parse = function (g) {
  return hash(g, struct).use(function (err, guest) {
    if (err) return new VError(err, 'Invalid Guest')
    return guest
  })
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
  if (this.isError) return false
  return cache.delete(String(this.key))
}

Guest.prototype.equals = function (g) {
  return String(this.key) === String(g.key)
}

Guest.prototype.send = function (data) {
  return this.use(function (err, g) {
    if (err) throw new VError(err, 'Cannot send to Guest')
    return g.send(data)
  })
}

getter(Guest.prototype, 'key', function key () {
  return this.use(function (err, g) {
    if (err) throw new VError(err, 'Cannot get key')
    return PublicKey(g.key)
  })
})

getter(Guest.prototype, 'name', function name () {
  return this.use(function (err, g) {
    if (err) throw new VError(err, 'Cannot get key')
    return g.name
  })
})

getter(Guest.prototype, 'isHost', function isHost () {
  return this.use(function (err, g) {
    if (err) return false
    var h = Host.get()
    return String(this.key) === String(h.publicKey)
  })
})

module.exports = Guest
