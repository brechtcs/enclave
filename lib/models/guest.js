var Base = require('stdopt/base')
var Emitter = require('events')
var Guest = Base.implement('enclave guest')
var Identity = require('./identity')
var bonjour = require('bonjour')()
var bus = new Emitter()
var network = null

Guest.announce = function (port) {
  var id = Identity.init()
  var type = 'enclave'

  bonjour.publish({ type, port, name: id.getKey('hex') })

  network = bonjour.find({ type })
  network.on('up', change)
  network.on('down', change)

  function change () {
    bus.emit('change')
  }
}

Guest.get = function (name) {
  return network.services.find(s => s.name === name)
}

Guest.list = function () {
  var id = Identity.get()
  return network.services.filter(s => s.name !== id.getKey('hex'))
}

Guest.on = bus.on.bind(bus)

module.exports = Guest
