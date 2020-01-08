var { number } = require('stdopt')
var run = require('stdrun')
var serve = require('../lib/servers/app')

function enclave (opts = {}) {
  var port = number(opts.port).or(opts.p).value()
  serve({ port })
}

run(enclave)
