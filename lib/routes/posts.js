var Post = require('../models/post')

module.exports = function (req, res, next) {
  if (req.auth) {
    Post.create(req.body.content)
    next()
  } else {
    next(new Error('forbidden'))
  }
}
