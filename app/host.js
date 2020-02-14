var { join } = require('path')
var Host = require('../models/host')
var Mold = require('./mold')
var body = require('body-parser')
var express = require('express')
var guests = require('./guests')
var logger = require('./logger')
var number = require('stdopt/number')
var posts = require('./posts')

module.exports = function host (opts = {}) {
  var host = Host.get()
  var mold = new Mold({ host })
  var server = express()

  server.set('views', join(__dirname, '../views'))
  server.set('view engine', 'html')
  server.engine('html', mold.engine(server, 'html'))

  server.use(guests.identify)
  server.use(logger)
  server.get('/', home)
  server.get('/favicon.ico', favicon)
  server.get('/guests', guests.display)
  server.get('/posts', posts.display)
  server.use('/guests', guests.tunnel)

  server.use(body.json())
  server.use(body.urlencoded({ extended: false }))
  server.post('/guests', guests.receive)
  server.post('/posts', posts.receive)

  var port = number(opts.port).or(host.port).value()
  return server.listen(port)
}

function home (req, res) {
  res.redirect('posts')
}

function favicon (req, res) {
  res.end('')
}
