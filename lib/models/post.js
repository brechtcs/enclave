var { hash, number, string } = require('stdopt')
var Base = require('stdopt/base')
var Emitter = require('events')
var Timestamp = require('./timestamp')

var Post = Base.implement('enclave post')
var bus = new Emitter()
var store = []

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
  p.id = store.length
  p.created = new Date()
  p.modified = new Date()

  var post = Post(p)
  store.push(post.value())
  bus.emit('change', { type: 'create', data: post })
  return post
}

Post.get = function (id) {
  return Post(store[id])
}

Post.list = function () {
  return store
    .map(p => Post(p))
    .reverse()
}

Post.on = bus.on.bind(bus)

module.exports = Post
