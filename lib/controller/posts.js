var Post = require('../models/post')

module.exports = function (req, res, next) {
  Post.create(req.body.content)
  next()
}

