var { hash, nothing, number, string } = require('stdopt')
var { getter, setter, prop } = require('stdprop')
var Base = require('stdopt/base')
var Events = require('events')
var PrivateKey = require('./crypto/private-key')
var PublicKey = require('./crypto/public-key')
var VError = require('verror')

var events = new Events()
var instance = null
var struct = {
  key: PrivateKey,
  name: string,
  port: [nothing, number]
}

function Host (h) {
  if (this instanceof Host) Base.call(this, h)
  else return new Host(h)
}

Host.parse = function (h) {
  return hash(h, struct).use(function (err, host) {
    if (err) return new VError(err, 'Invalid Host')
    return host
  })
}

Host.create = function ({ name, port }) {
  var host = {}
  prop(host, 'key', PrivateKey.generate())
  prop(host, 'name', name, 'e')
  prop(host, 'port', port, 'ew')
  return Host(host)
}

Host.get = function () {
  return instance
}

Host.init = function (config, key) {
  if (instance) {
    throw new Error('Host already initialized')
  }
  prop(config, 'key', PrivateKey(key))
  var host = Host(config)

  return host.use(function (err) {
    if (err) throw new VError(err, 'Cannot init Host')
    instance = this
    events.emit('init', this)
    return this
  })
}

Host.on = function (event, handler) {
  events.on(event, handler)
}

Host.prototype.toJSON = function () {
  var name = this.name
  var key = this.publicKey.pem
  var port = this.port
  return { name, key, port }
}

getter(Host.prototype, 'name', function name () {
  return this.use(function (err, h) {
    if (err) throw new VError(err, 'Cannot get name')
    return h.name
  })
})

getter(Host.prototype, 'port', function port () {
  return this.use(function (err, h) {
    if (err) throw new VError(err, 'Cannot get port')
    return h.port
  })
})

getter(Host.prototype, 'privateKey', function privateKey () {
  return this.use(function (err, h) {
    if (err) throw new VError(err, 'Cannot get private key')
    return PrivateKey(h.key)
  })
})

getter(Host.prototype, 'publicKey', function publicKey () {
  return this.use(function (err, h) {
    if (err) throw new VError(err, 'Cannot get public key')
    return PublicKey(h.key)
  })
})

setter(Host.prototype, 'port', function port (p) {
  this.use(function (err, h) {
    if (err) {
      throw new VError(err, 'Cannot set Host.port')
    } else if (h.port === p) {
      return
    }

    h.port = number(p)
      .or(new Error('Invalid port: ' + p))
      .value()

    events.emit('change', this.use())
  })
})

module.exports = Host
