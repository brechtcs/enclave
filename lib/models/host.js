var { hash, string } = require('stdopt')
var { getter, prop } = require('stdprop')
var Base = require('stdopt/base')
var Key = require('./key')
var crypto = require('crypto')

var instance = null
var struct = {
  key: PrivateKey,
  name: string
}

function Host (h) {
  if (this instanceof Host) Base.call(this, h)
  else return new Host(h)
}

Host.parse = function (h) {
  return hash(h, struct)
}

Host.create = function (name) {
  var host = {}
  prop(host, 'key', PrivateKey.generate())
  prop(host, 'name', name, 'e')
  return Host(host)
}

Host.init = function (config, key) {
  if (instance) {
    throw new Error('Host already initialized')
  }
  prop(config, 'key', PrivateKey(key))
  var host = Host(config)

  return host.use(function (err, h) {
    if (err) throw err
    instance = h
    return this
  })
}

Host.get = function () {
  return Host(instance).use()
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

module.exports = Host

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
