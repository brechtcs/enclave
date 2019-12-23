var Coherence = require('coherence-framework')
var guests = require('./guests')
var layout = require('./layout')

var app = Coherence(layout)
var id = Math.random()

app.use('book', function () {
  var title = ['span', id +': ']
  var href = ['a', { href: 'guests' }, 'guests']
  return ['main', [title, href]]
})

app.use('guests', function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  return ['main', attrs, guests.display()]
})

guests.on('change', function () {
  app.invalidate('guests', Date.now())
})

module.exports = app

