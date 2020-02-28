var Host = require('../models/host')
var bonjour = require('bonjour')()
var exit = require('async-exit-hook')
var guests = require('./guests')
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
