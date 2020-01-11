var Coherence = require('coherence-framework')
var Guest = require('./models/guest')
var Post = require('./models/post')

var ui = Coherence(require('./layout'))
ui.use('guests', require('./views/guests'))
ui.use('posts', require('./views/posts'))
ui.use('settings', require('./views/settings'))

Guest.on('change', function () {
  ui.invalidate('guests', Date.now())
})

Post.on('change', function () {
  ui.invalidate('posts', Date.now())
})

module.exports = ui

