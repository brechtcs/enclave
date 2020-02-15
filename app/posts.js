var Host = require('../models/host')
var Post = require('../models/post')

module.exports.display = display
module.exports.receive = receive

function display (req, res) {
  if (req.get('Enclave-Origin')) {
    var title = 'Posts'
    var posts = Post.list()
    res.render('posts', { title, posts })
  } else {
    var host = Host.get()
    res.redirect(`/guests/${host.publicKey}${req.url}`)
  }
}

function receive (req, res) {
  Post.create(req.guest, req.body.content)
  display(req, res)
}
