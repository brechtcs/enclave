var { number, string } = require('stdopt')
var body = require('body-parser')
var express = require('express')
var guests = require('../guests')
var ip = require('client-ip')
var localhost = require('is-localhost-ip')
var posts = require('./posts')
var tunnel = require('./guests')
var url = require('url')
var ui = require('../ui')

module.exports = function serve (opts = {}) {
  var port, key
  port = number(opts.port).or(opts.p).value()
  key = string(opts.key).or(opts.k).value()

  var server = express()
  server.use(auth)
  server.get('/', home)
  server.get('/favicon.ico', favicon)
  server.use('/guests', forward)
  server.use('/partial/guests', partials)
  server.use(body.urlencoded({ extended: false }))
  server.post('/posts', posts)
  server.use(ui)

  server.listen(port, function () {
    console.log('Listening at ' + port)
    guests.announce(key, port)
  })
}

function auth (req, res, next) {
  req.auth = localhost(ip(req))
  next()
}

function home (req, res) {
  res.redirect('/posts')
}

function favicon (req, res) {
  res.end('')
}

function forward (req, res, next) {
  if (req.url === '/') {
    return next()
  }
  tunnel(req, res, next)
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
  tunnel(req, res, next)
}
