var { boolean, nothing, number, string } = require('stdopt')
var db = require('../lib/data')
var host = require('../lib/host')
var local = require('../lib/local')
var run = require('stdrun')

async function enclave (opts = {}, name) {
  var create = boolean(opts.create).or(false).value()
  var port = number(opts.port).or(opts.p).or(nothing).value()
  name = string(name).value()

  if (create) {
    await db.create(name, port)
  }
  await db.open(name, port)

  host({ port }).on('listening', function () {
    var a = this.address()
    var msg = `Enclave is running on port ${a.port}`
    local.announce(a.port)
    console.log(msg)
  })
}

run(enclave)
