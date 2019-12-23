var { number, string } = require('stdopt')
var app = require('./app')
var express = require('express')
var guests = require('./guests')
var url = require('url')

module.exports = function serve (opts = {}) {
  var port, key
  port = number(opts.port).or(opts.p).value()
  key = string(opts.key).or(opts.k).value()

  var server = express()
  server.get('/', home)
  server.get('/favicon.ico', favicon)
  server.use('/guests', forward)
  server.use('/partial/guests', partials)
  server.use(app)

  server.listen(port, function () {
    console.log('Listening at ' + port)
    guests.announce(key, port)
  })
}

function home (req, res) {
  res.redirect('book')
}

function favicon (req, res) {
  res.end('')
}

function forward (req, res, next) {
  if (req.url === '/') {
    return next()
  }
  guests.proxy(req, res, next)
}

function partials (req, res, next) {
  var { path } = url.parse(req.headers.referer)
  var parts = path.split('/')
  if (parts[parts.length - 2] !== 'partial') {
    parts[parts.length - 1] = 'partial/' + parts[parts.length - 1]
  }
  var rewritten = '/' + parts.slice(2).join('/')

  if (rewritten  === '/partial/guests') {
    return next()
  }
  req.url = rewritten
  guests.proxy(req, res, next)
}
