var Coherence = require('coherence-framework')
var guests = require('./guests')
var layout = require('./layout')

var app = Coherence(layout)
var id = Math.random()

app.use('posts', function () {
  return ['main', String(id)]
})

app.use('guests', function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  return ['main', attrs, guests.display()]
})

guests.on('change', function () {
  app.invalidate('guests', Date.now())
})

module.exports = app

