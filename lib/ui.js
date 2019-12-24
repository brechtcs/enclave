var Coherence = require('coherence-framework')
var guests = require('./guests')

var ui = Coherence(require('./layout'))
ui.use('events', require('./partials/events'))
ui.use('updates', require('./partials/updates'))
ui.use('guests', require('./partials/guests'))
ui.use('settings', require('/partials/settings'))
ui.setDefault('events')

guests.on('change', function () {
  ui.invalidate('guests', Date.now())
})

module.exports = ui

