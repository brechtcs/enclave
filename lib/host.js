var Host = require('./models/host')
var body = require('body-parser')
var express = require('express')
var guests = require('./routes/guests')
var local = require('./local')
var posts = require('./routes/posts')
var ui = require('./ui')

module.exports = function host ({ port }) {
  var server = express()
  server.use(guests.identify)
  server.use(logger)
  server.get('/', home)
  server.get('/favicon.ico', favicon)
  server.use('/guests', guests.tunnel)
  server.use('/coherence', guests.tunnel.coherence)
  server.use('/partial', guests.tunnel.partial)
  server.use(body.json())
  server.use(body.urlencoded({ extended: false }))
  server.post('/guests', guests.receive)
  server.post('/posts', posts)
  server.get('/guests', redirect)
  server.get('/posts', redirect)
  server.use(ui)

  server.listen(port, function () {
    console.log('Listening at ' + port)
    local.announce(port)
  })
}

function home (req, res) {
  res.redirect('posts')
}

function favicon (req, res) {
  res.end('')
}

function logger (req, res, next) {
  console.log(req.method.padEnd(4), req.url, '(' + req.guest + ')')
  next()
}

function redirect (req, res, next) {
  if (req.get('Enclave-Origin')) {
    return next()
  }
  var host = Host.get()
  res.redirect(`/guests/${host.publicKey}${req.url}`)
}
