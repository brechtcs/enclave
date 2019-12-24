var local = require('is-localhost-ip')
var client = require('client-ip')

module.exports = function () {
  return function (req, res, next) {
    if (local(client(req))) {
      return next()
    }
    res.statusCode = 403
    res.end('forbidden')
  }
}
