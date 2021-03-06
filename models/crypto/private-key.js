var { getter } = require('stdprop')
var Base = require('stdopt/base')
var VError = require('verror')
var crypto = require('crypto')

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
    return new VError(err, 'Invalid private key')
  }
}

getter(PrivateKey.prototype, 'pem', function pem () {
  return this.use(function (err, k) {
    if (err) throw new VError(err, 'Cannot get pem')
    return k.export({ format: 'pem', type: 'pkcs8' })
  })
})

module.exports = PrivateKey
