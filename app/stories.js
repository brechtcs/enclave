var Host = require('../models/host')
var Guest = require('../models/guest')
var Story = require('../models/story')

module.exports.detail = detail
module.exports.overview = overview
module.exports.publish = publish

function detail (req, res) {
  var story = Story.get(req.params.id)

  if (story.isValid) {
    var title = 'Story'
    res.render('stories/detail', { story, title })
  } else {
    res.writeHead(404)
    res.end('not found')
  }
}

function overview (req, res) {
  var stories = Story.list()
  var title = 'Stories'
  res.render('stories/overview', { stories, title })
}

function publish (req, res) {
  var host = Host.get()
  var from = Guest.get(host.publicKey)
  var to = Guest.get(req.body.to)
  var lede = req.body.lede
  var main = req.body.main
  Story.create({ from, to, lede, main })
  res.redirect('/')
}
