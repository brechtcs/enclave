var { hash, nothing, number, string } = require('stdopt')
var { getter, setter, prop } = require('stdprop')
var Base = require('stdopt/base')
var Key = require('./key')
var crypto = require('crypto')
var model = require('stdmodel')

var instance = null
var struct = {
  key: PrivateKey,
  name: string,
  port: Port
}

var Host = model(function Host (h) {
  Base.call(this, h)
})

Host.parse = function (h) {
  return hash(h, struct)
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
  return this.value()
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
    return Key(h.key)
  })
})

setter(Host.prototype, 'port', function (p) {
  this.change('port', number(p).value())
})

module.exports = Host

/**
 * Port definition
 */
function Port (p) {
  if (this instanceof Port) Base.call(this, p)
  else return new Port(p)
}

Port.parse = function (p) {
  return number(p).or(nothing)
}

/**
 * PrivateKey definition
 */
function PrivateKey (k) {
  if (this instanceof PrivateKey) Base.call(this, k)
  else return new PrivateKey(k)
}

PrivateKey.generate = function () {
  var pair = crypto.generateKeyPairSync('ed25519')
  return pair.privateKey
}

PrivateKey.parse = function (k) {
  if (!k) return
  if (k.asymmetricKeyType === 'ed25519' && k.type === 'private') {
    return k
  }

  try {
    return crypto.createPrivateKey({
      key: k,
      format: Buffer.isBuffer(k) ? 'der' : 'pem',
      type: 'pkcs8'
    })
  } catch (err) {
    return err
  }
}

getter(PrivateKey.prototype, 'pem', function () {
  return this.use(function (err, k) {
    if (err) throw err
    return k.export({ format: 'pem', type: 'pkcs8' })
  })
})
