var { number, string } = require('stdopt')
var host = require('../lib/host')
var run = require('stdrun')

function enclave (opts = {}) {
  var name = string(opts.name).or(opts.n).or('Incognito').value()
  var port = number(opts.port).or(opts.p).value()

  host({ name, port })
}

run(enclave)
