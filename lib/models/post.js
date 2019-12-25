var Base = require('stdopt/base')
var Mimes = require('./mimes')
var Post = Base.implement('enclave post')
var store = []

Post.isValid = function (p) {
  return typeof p === 'object'
    && typeof p.id === 'number'
    && p.created instanceof Date
    && p.modified instanceof Date
    && Buffer.isBuffer(p.content)
    && Mimes.isValid(p.mimes)
}

Post.create = function (content, mimes) {
  var p = { content }

  if (typeof p.content === 'string') {
    p.content = Buffer.from(p.content)
  }
  p.mimes = Mimes(mimes).or(['text/plain']).value()
  p.created = new Date()
  p.modified = new Date()
  p.id = store.length

  var post = Post(p)
  store.push(post.value())
  return post
}

Post.get = function (id) {
  return store[id]
}

Post.list = function () {
  return store
    .map(p => Post(p))
    .reverse()
}

Post.prototype.unwrap = function () {
  return Base.unwrap(this)
}

module.exports = Post
