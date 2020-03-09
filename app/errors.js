var VError = require('verror')

module.exports = function (err, req, res, next) {
  var stack = VError.fullStack(err)
  console.error(stack)
  res.writeHead(500)
  res.end(stack)
}
