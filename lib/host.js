var Identity = require('./models/identity')
var body = require('body-parser')
var client = require('client-ip')
var express = require('express')
var guests = require('./routes/guests')
var ip = require('ip')
var local = require('./local')
var posts = require('./routes/posts')
var ui = require('./ui')

module.exports = function host ({ name, port }) {
  Identity.init({ name })

  var server = express()
  server.use(auth)
  server.get('/', home)
  server.get('/favicon.ico', favicon)
  server.use('/guests', guests.tunnel)
  server.use('/partial/guests', guests.tunnel.partial)
  server.use(body.json())
  server.use(body.urlencoded({ extended: false }))
  server.post('/guests', guests.receive)
  server.post('/posts', posts)
  server.use(ui)

  server.listen(port, function () {
    console.log('Listening at ' + port)
    local.announce(port)
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
