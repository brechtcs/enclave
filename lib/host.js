var { number, string } = require('stdopt')
var Guest = require('./models/guest')
var body = require('body-parser')
var client = require('client-ip')
var express = require('express')
var guests = require('./routes/guests')
var ip = require('ip')
var localhost = require('is-localhost-ip')
var posts = require('./routes/posts')
var ui = require('./ui')

module.exports = function host (opts = {}) {
  var port = number(opts.port).value()
  var server = express()

  server.use(auth)
  server.get('/', home)
  server.get('/favicon.ico', favicon)
  server.use('/guests', guests.main)
  server.use('/partial/guests', guests.partial)
  server.use(body.urlencoded({ extended: false }))
  server.post('/posts', posts)
  server.use(ui)

  server.listen(port, function () {
    console.log('Listening at ' + port)
    Guest.announce(port)
  })
}

function auth (req, res, next) {
  req.auth = ip.isLoopback(client(req))
  console.log(req.auth ? 'local:\t' : 'remote:\t', req.method, req.url)
  next()
}

function home (req, res) {
  res.redirect('posts')
}

function favicon (req, res) {
  res.end('')
}
