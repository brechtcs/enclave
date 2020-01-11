var { number } = require('stdopt')
var host = require('../lib/host')
var run = require('stdrun')

function enclave (opts = {}) {
  var port = number(opts.port).or(opts.p).value()
  host({ port })
}

run(enclave)
