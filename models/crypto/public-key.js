var { base32 } = require('rfc4648')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var VError = require('verror')
var crypto = require('crypto')

function PublicKey (k) {
  if (this instanceof PublicKey) Base.call(this, k)
  else return new PublicKey(k)
}

PublicKey.parse = function (k) {
  if (!k) return
  if (k.asymmetricKeyType === 'ed25519' && k.type === 'public') {
    return k
  }

  try {
    return crypto.createPublicKey({
      key: k,
      format: Buffer.isBuffer(k) ? 'der' : 'pem',
      type: 'spki'
    })
  } catch (err) {
    return new VError(err, 'Invalid public key')
  }
}

PublicKey.prototype.toString = function () {
  return base32.stringify(this.buffer.slice(-32), { pad: false })
}

getter(PublicKey.prototype, 'buffer', function buffer () {
  return this.use(function (err, k) {
    if (err) throw new VError(err, 'Cannot get buffer')
    return k.export({ format: 'der', type: 'spki' })
  })
})

getter(PublicKey.prototype, 'pem', function pem () {
  return this.use(function (err, k) {
    if (err) throw new VError(err, 'Cannot get pem')
    return k.export({ format: 'pem', type: 'spki' })
  })
})

module.exports = PublicKey
