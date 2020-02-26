var { join } = require('path')
var Host = require('../models/host')
var Mold = require('./mold')
var drafts = require('./drafts')
var express = require('express')
var guests = require('./guests')
var morgan = require('./morgan')
var number = require('stdopt/number')
var stories = require('./stories')

var assets = join(__dirname, '../public')
var views = join(__dirname, '../views')

module.exports = function host (opts = {}) {
  var host = Host.get()
  var mold = new Mold({ host })
  var server = express()

  server.set('views', views)
  server.set('view engine', 'html')
  server.engine('html', mold.engine(server, 'html'))

  server.use(guests.identify)
  server.use(morgan(':status :method :url (:guest)'))
  server.get('/', stories.overview)
  server.get('/drafts/new', drafts.create)
  server.get('/drafts/:id', drafts.display)
  server.get('/guests', guests.display)
  server.use('/guests/*/guests/:key', guests.redirect)
  server.use('/guests/:key', guests.tunnel)
  server.get('/stories', stories.overview)
  server.get('/stories/:id', stories.detail)
  server.use(express.static(assets))

  server.use(express.json())
  server.use(express.urlencoded({ extended: false }))
  server.post('/guests', guests.receive)
  server.post('/stories', stories.publish)

  var port = number(opts.port).or(host.port).value()
  return server.listen(port)
}
