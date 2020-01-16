var Guest = require('./models/guest')
var Host = require('./models/host')
var bonjour = require('bonjour')()
var dotlocal = require('dotlocal')()
var exit = require('async-exit-hook')
var request = require('request')
var url = require('url')
var type = 'enclave'

module.exports.announce = announce
module.exports.lookup = lookup

function announce (port) {
  var host, name, service, local
  host = Host.get()
  name = String(host.publicKey)

  service = bonjour.publish({ type, port, name })
  local = bonjour.find({ type })
  local.on('up', join(host, port))
  local.on('down', leave)
  exit(service.stop)
}

function lookup (host, cb) {
  if (host === 'localhost') {
    return cb(null, host)
  }
  dotlocal.lookup(host, cb)
}

function join (host, port) {
  return function (service) {
    if (service.name === String(host.publicKey)) return
    var name = host.name
    var key = host.publicKey.pem
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

function leave (service) {
  Guest.get(service.name).delete()
}
