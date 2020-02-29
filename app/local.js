var Host = require('../models/host')
var bonjour = require('bonjour')()
var client = require('client-ip')
var exit = require('async-exit-hook')
var guests = require('./guests')
var ip = require('ip')
var type = 'enclave'

module.exports.announce = function (port) {
  var host, name, service, local
  host = Host.get()
  name = String(host.publicKey)

  service = bonjour.publish({ type, port, name })
  local = bonjour.find({ type })
  local.on('up', guests.gateway.join)
  local.on('down', guests.leave)
  exit(service.stop)
}

module.exports.filter = function (req, res, next) {
  if (req.method === 'GET' || isLocal(req)) {
    return next()
  }
  res.writeHead(403)
  res.end('forbidden')
}

function isLocal (req) {
  return ip.isLoopback(client(req))
}
