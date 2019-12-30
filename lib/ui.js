var Coherence = require('coherence-framework')
var Post = require('./models/post')
var guests = require('./guests')

var ui = Coherence(require('./layout'))
ui.use('events', require('./partials/events'))
ui.use('posts', require('./partials/posts'))
ui.use('guests', require('./partials/guests'))
ui.use('settings', require('./partials/settings'))

Post.on('change', function () {
  console.log('ping')
  ui.invalidate('posts', Date.now())
})

guests.on('change', function () {
  ui.invalidate('guests', Date.now())
})

module.exports = ui

