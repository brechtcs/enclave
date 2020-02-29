var { INTRO, REQ, RES, WELCOME } = require('./events')
var Address = require('../../models/address')
var Guest = require('../../models/guest')
var Host = require('../../models/host')
var WebSocket = require('ws')
var prefix = require('superagent-prefix')
var superagent = require('superagent')
var tunnel = require('./tunnel')

module.exports = gateway
module.exports.join = join

function gateway (ws) {
  ws.on('message', function (msg) {
    var { type, data, id } = JSON.parse(msg)

    switch (type) {
      case INTRO:
        console.log(JSON.parse(data).name, 'connected to this gateway')
        return welcome(data, ws)
      case REQ:
        return respond(id, data, ws)
      case RES:
        return tunnel.resolve(id, data)
      default:
        console.warn('Unknown message type:', type)
    }
  })
}

function join (service) {
  if (Guest.has(service.name)) return

  var ip = Address(service.host).or(service.addresses[0]).value()
  var url = `ws://[${ip}]:${service.port}/`
  var ws = new WebSocket(url)

  ws.on('error', function () {
    console.warn('failed to join', service.name)
  })

  ws.on('message', function (msg) {
    var { type, data, id } = JSON.parse(msg)

    switch (type) {
      case WELCOME:
        console.log('connected to the gateway of', JSON.parse(data).name)
        return receive(data, ws)
      case REQ:
        return respond(id, data, ws)
      case RES:
        return tunnel.resolve(id, data)
      default:
        console.warn('Unknown message type:', type)
    }
  })

  ws.on('open', function () {
    var type = INTRO
    var data = JSON.stringify(Host.get())
    ws.send(JSON.stringify({ type, data }))
  })
}

function receive (data, ws) {
  var g = JSON.parse(data)
  g.send = ws.send.bind(ws)
  Guest.join(g)
}

function respond (id, data, ws) {
  var { port } = Host.get()
  var { url } = JSON.parse(data)

  superagent.get(url)
    .use(prefix('http://127.0.0.1:' + port))
    .end(send)

  function send (error, res) {
    if (error) data = JSON.stringify({ error })
    else data = JSON.stringify({ res })

    var type = RES
    ws.send(JSON.stringify({ type, data, id }))
  }
}

function welcome (data, ws) {
  receive(data, ws)

  var type = WELCOME
  data = JSON.stringify(Host.get())
  ws.send(JSON.stringify({ type, data }))
}
