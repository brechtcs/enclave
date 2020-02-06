var Post = require('../models/post')

module.exports = function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/posts', 'posts', Date.now())
  var main = ['main', attrs]
  if (req.guest.isValid) main.push(form())
  main.push(list())
  return main
}

function form () {
  return ['form', { method: 'post' },
    ['textarea', {
      placeholder: 'Leave a message...',
      name: 'content'
    }],
    ['button', { type: 'submit' }, 'post']
  ]
}

function list () {
  return Post.list().map(article)
}

function article (post) {
  return ['article',
    ['address', post.guest.name],
    ['pre', String(post.content)]
  ]
}
