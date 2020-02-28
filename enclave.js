var { boolean, nothing, number, string } = require('stdopt')
var db = require('./app/data')
var host = require('./app/host')
var local = require('./app/local')
var run = require('stdrun')

async function enclave (opts = {}, name) {
  var create = boolean(opts.create).or(false).value()
  var gateway = boolean(opts.gateway).or(true).value()
  var port = number(opts.port).or(opts.p).or(nothing).value()
  name = string(name).value()

  if (create) {
    await db.create(name, port)
  }
  await db.open(name, port)

  host({ gateway, port }).on('listening', function () {
    var a = this.address()
    var msg = `Enclave is running on port ${a.port}`
    local.announce(a.port)
    console.log(msg)
  })
}

run(enclave)
