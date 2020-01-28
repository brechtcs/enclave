var { hash, number, string } = require('stdopt')
var Base = require('stdopt/base')
var Timestamp = require('./timestamp')
var model = require('stdmodel')

var cache = []

var Post = model(function Post (p) {
  Base.call(this, p)
})

Post.parse = function (p) {
  if (!hash(p).isValid) {
    return new Error('Post must be object')
  }
  if (!p.guest.isValid) {
    return new Error('Post requires valid Guest')
  }
  var post = {}
  post.guest = p.guest
  post.id = number(p.id).value()
  post.created = Timestamp(p.created).value()
  post.modified = Timestamp(p.modified).value()
  post.mime = string(p.mime).or('text/plain').value()
  post.content = Buffer.from(p.content)
  return post
}

Post.create = function (guest, content, mime) {
  var p = { guest, content, mime }
  p.id = cache.length
  p.created = new Date()
  p.modified = new Date()

  var post = Post(p)
  cache.push(post.value())
  return post
}

Post.get = function (id) {
  return Post(cache[id])
}

Post.list = function () {
  return cache
    .map(p => Post(p))
    .reverse()
}

module.exports = Post
