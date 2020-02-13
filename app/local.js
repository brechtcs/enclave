var Address = require('../models/address')
var Guest = require('../models/guest')
var Host = require('../models/host')
var bonjour = require('bonjour')()
var exit = require('async-exit-hook')
var request = require('request')
var type = 'enclave'

module.exports.announce = function (port) {
  var host, name, service, local
  host = Host.get()
  name = String(host.publicKey)

  service = bonjour.publish({ type, port, name })
  local = bonjour.find({ type })
  local.on('up', join.bind(null, host, port))
  local.on('down', leave)
  exit(service.stop)
}

function join (host, port, service) {
  if (service.name === String(host.publicKey)) {
    return
  }
  var ip = Address(service.addresses[0]).or(service.host).value()
  var url = `http://[${ip}]:${service.port}/guests`
  var headers = { 'Content-Type': 'application/json' }
  var name = host.name
  var key = host.publicKey.pem
  var data = JSON.stringify({ key, port, name })

  var req = request.post(url, { headers })
  req.write(data)
  req.end()
}

function leave (service) {
  Guest.get(service.name).delete()
}
