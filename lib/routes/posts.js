var Post = require('../models/post')

module.exports = function (req, res, next) {
  Post.create(req.guest, req.body.content)
  next()
}
