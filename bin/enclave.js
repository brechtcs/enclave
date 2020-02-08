var { boolean, number, string } = require('stdopt')
var db = require('../lib/data')
var host = require('../lib/host')
var run = require('stdrun')

async function enclave (opts = {}, name) {
  var create = boolean(opts.create).or(false).value()
  var port = number(opts.port).or(opts.p).value()
  name = string(name).value()

  if (create) {
    await db.create(name)
  }

  await db.open(name, port)
  host({ port })
}

run(enclave)
