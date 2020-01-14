var Identity = require('./models/identity')
var bonjour = require('bonjour')()
var dotlocal = require('dotlocal')()
var request = require('request')
var url = require('url')
var type = 'enclave'

module.exports.join = join
module.exports.lookup = lookup

function join (port) {
  var id, name, network
  id = Identity.get()
  name = id.publicKey.href

  bonjour.publish({ type, port, name })
  network = bonjour.find({ type })
  network.on('up', post(id, port))
}

function lookup (host, cb) {
  if (host === 'localhost') {
    return cb(null, host)
  }
  dotlocal.lookup(host, cb)
}

function post (id, port) {
  return function (service) {
    if (service.name === id.publicKey.href) return
    var name = id.name
    var key = id.publicKey.buffer.toString('base64')
    var data = JSON.stringify({ key, port, name })

    lookup(service.host, function (err, ip) {
      if (err) return console.error(err)

      var guest = url.format({
        protocol: 'http:',
        hostname: ip,
        port: service.port,
        pathname: '/guests'
      })

      var headers = {
        'Content-Type': 'application/json'
      }

      var req = request.post(guest, { headers })
      req.write(data)
      req.end()
    })
  }
}
