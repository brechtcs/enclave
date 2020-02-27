var client = require('client-ip')
var ip = require('ip')

module.exports.filter = function (req, res, next) {
  if (req.method === 'GET' || ip.isLoopback(client(req))) {
    return next()
  }
  res.writeHead(403)
  res.end('forbidden')
}
