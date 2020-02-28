var Address = require('../../models/address')
var Guest = require('../../models/guest')
var Host = require('../../models/host')
var WebSocket = require('ws')
var client = require('client-ip')

var INTRODUCE = 'introduce'
var WELCOME = 'welcome'

module.exports.join = join
module.exports.listen = listen

function join (service) {
  if (Guest.has(service.name)) return

  var host = Host.get()
  var ip = Address(service.host).or(service.addresses[0]).value()
  var url = `ws://[${ip}]:${service.port}/`
  var ws = new WebSocket(url)

  ws.on('message', function (msg) {
    var { type, data } = JSON.parse(msg)

    switch (type) {
      case WELCOME:
        console.log('client receive', JSON.parse(data).name)
        return receive(data, ip)
      default:
        console.warn('Unknown message type:', type)
    }
  })

  ws.on('open', function () {
    var type = INTRODUCE
    var data = JSON.stringify(host)
    ws.send(JSON.stringify({ type, data }))
  })
}

function listen (ws, req) {
  var ip = client(req)

  ws.on('message', function (msg) {
    var { type, data } = JSON.parse(msg)

    switch (type) {
      case INTRODUCE:
        console.log('server receive', JSON.parse(data).name)
        return reciprocate(data, ip, ws)
      default:
        console.warn('Unknown message type:', type)
    }
  })
}

function reciprocate (data, ip, ws) {
  receive(data, ip)

  var type = WELCOME
  data = JSON.stringify(Host.get())
  ws.send(JSON.stringify({ type, data }))
}

function receive (data, ip) {
  var guest = JSON.parse(data)
  guest.address = ip
  Guest.join(guest)
}
