var Coherence = require('coherence-framework')
var guests = require('./guests')
var layout = require('./layout')

var ui = Coherence(layout)

ui.use('events', function () {
  return ['main', 'events']
})

ui.use('updates', function () {
  return ['main', 'updates']
})

ui.use('guests', function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/guests', 'guests', Date.now())
  return ['main', attrs, guests.display()]
})

ui.use('settings', function () {
  return ['main', 'settings']
})

ui.setDefault('events')

guests.on('change', function () {
  ui.invalidate('guests', Date.now())
})

module.exports = ui

