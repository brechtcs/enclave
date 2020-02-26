var UAParser = require('ua-parser-js')
var morgan = require('morgan')

morgan.token('guest', function (req, res) {
  var ua = UAParser(req.get('User-Agent'))
  var origin = req.local ? 'local: ' : 'remote: '

  return req.guest.isError
    ? origin + (ua.browser.name || ua.ua)
    : req.guest
})

module.exports = morgan
