var Host = require('../models/host')
var UAParser = require('ua-parser-js')
var body = require('body-parser')
var express = require('express')
var guests = require('./guests')
var number = require('stdopt/number')
var posts = require('./posts')
var ui = require('./ui')

module.exports = function host (opts = {}) {
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

  var h = Host.get()
  var port = number(opts.port).or(h.port).value()
  return server.listen(port)
}

function home (req, res) {
  res.redirect('posts')
}

function favicon (req, res) {
  res.end('')
}

function logger (req, res, next) {
  var ua = UAParser(req.get('User-Agent'))
  var client = req.guest.isError
    ? `(${ua.browser.name || ua.ua})`
    : `(${req.guest})`

  console.log(req.method.padEnd(4), req.url, client)
  next()
}

function redirect (req, res, next) {
  if (req.get('Enclave-Origin')) {
    return next()
  }
  var host = Host.get()
  res.redirect(`/guests/${host.publicKey}${req.url}`)
}
