var { hash, nothing, number, string } = require('stdopt')
var { getter, setter, prop } = require('stdprop')
var Base = require('stdopt/base')
var PrivateKey = require('./crypto/private-key')
var PublicKey = require('./crypto/public-key')
var model = require('stdmodel')

var instance = null
var struct = {
  key: PrivateKey,
  name: string,
  port: [nothing, number]
}

var Host = model(function Host (h) {
  Base.call(this, h)
})

Host.parse = function (h) {
  return hash(h, struct).use(function (err, host) {
    if (err) return new Error(err)
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

Host.init = function (config, key) {
  if (instance) {
    throw new Error('Host already initialized')
  }
  prop(config, 'key', PrivateKey(key))
  var host = Host(config)

  return host.use(function (err) {
    if (err) throw err
    instance = this
    return this
  })
}

Host.get = function () {
  return instance
}

Host.prototype.change = function (prop, val) {
  return this.use(function (err, h) {
    if (err) throw err
    h[prop] = val
    return this.use()
  })
}

Host.prototype.toJSON = function () {
  var name = this.name
  var key = this.publicKey.pem
  var port = this.port
  return { name, key, port }
}

getter(Host.prototype, 'name', function () {
  return this.use(function (err, h) {
    if (err) throw err
    return h.name
  })
})

getter(Host.prototype, 'port', function () {
  return this.use(function (err, h) {
    if (err) throw err
    return h.port
  })
})

getter(Host.prototype, 'privateKey', function () {
  return this.use(function (err, h) {
    if (err) throw err
    return PrivateKey(h.key)
  })
})

getter(Host.prototype, 'publicKey', function () {
  return this.use(function (err, h) {
    if (err) throw err
    return PublicKey(h.key)
  })
})

setter(Host.prototype, 'port', function (p) {
  this.change('port', number(p).value())
})

module.exports = Host
