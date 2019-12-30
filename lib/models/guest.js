var Base = require('stdopt/base')
var Emitter = require('events')
var Guest = Base.implement('enclave guest')
var bonjour = require('bonjour')()
var bus = new Emitter()
var network = null

Guest.announce = function (name, port) {
  var type = 'enclave'
  bonjour.publish({ type, name, port })

  network = bonjour.find({ type })
  network.on('up', change)
  network.on('down', change)

  function change () {
    bus.emit('change')
  }
}

Guest.find = function (name) {
  return network.services.find(s => s.name === name)
}

Guest.list = function () {
  return network.services
}

Guest.on = bus.on.bind(bus)

module.exports = Guest
