var Post = require('../models/post')

module.exports = function (opts, apply, req) {
  var attrs = apply.cacheAttrs('/posts', 'posts', Date.now())
  var main = ['main', attrs]
  if (req.auth) main.push(form())
  main.push(list())
  return main
}

function form () {
  return ['form', { method: 'post' },
    ['textarea', {
      placeholder: 'post something...',
      name: 'content'
    }],
    ['button', { type: 'submit' }, 'post']
  ]
}

function list () {
  return Post.list().map(function (p) {
    var post = p.unwrap()
    return ['article', String(post.content)]
  })
}
