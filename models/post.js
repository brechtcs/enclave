var { hash, number } = require('stdopt')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var Data = require('./data')
var Guest = require('./guest')
var Timestamp = require('./timestamp')
var model = require('stdmodel')

var cache = []
var struct = {
  id: number,
  guest: Guest,
  created: Timestamp,
  modified: Timestamp,
  content: Data
}

var Post = model(function Post (p) {
  Base.call(this, p)
})

Post.parse = function (p) {
  return hash(p, struct)
}

Post.create = function (guest, content) {
  var p = {}
  p.id = cache.length
  p.guest = guest.value()
  p.created = new Date()
  p.modified = new Date()
  p.content = Data.fromText(content)

  var post = Post(p)
  cache.push(post)
  return post
}

Post.list = function () {
  return cache.slice().reverse()
}

getter(Post.prototype, 'content', function () {
  return this.use(function (err, p) {
    if (err) throw err
    return Data(p.content)
  })
})

getter(Post.prototype, 'guest', function () {
  return this.use(function (err, p) {
    if (err) throw err
    return Guest(p.guest)
  })
})

module.exports = Post
