var UAParser = require('ua-parser-js')

module.exports = function logger (req, res, next) {
  var ua = UAParser(req.get('User-Agent'))
  var client = req.guest.isError
    ? `(${ua.browser.name || ua.ua})`
    : `(${req.guest})`

  console.log(req.method.padEnd(4), req.url, client)
  next()
}
