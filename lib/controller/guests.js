var dotlocal = require('dotlocal')()
var guests = require('../guests')
var request = require('request')
var pump = require('pump')
var url = require('url')

module.exports = function (req, res, next) {
  var parts, idx, name, service
  parts = req.url.split('/')
  idx = destination(parts)
  name = parts[idx]
  service = guests.find(name)

  if (service) {
    res.setHeader('referer', req.headers.referer)
    return res.redirect('/guests/' + parts.slice(idx).join('/'))
  }
  name = parts[1]
  service = guests.find(name)

  if (!service) {
    throw new Error('service not found: ' + name)
  }

  lookup(service.host, function (err, ip) {
    if (err) return next(err)

    var guest = url.format({
      protocol: 'http:',
      hostname: ip,
      port: service.port,
      pathname: parts.slice(2).join('/')
    })

    var referer = cut(req.headers.referer)
    var source = request(guest, {
      headers: { referer },
      method: req.method
    })

    pump([source, res], function (err) {
      if (err) next(err)
    })
  })
}

function destination (parts) {
  var i = parts.length - 1

  while (i) {
    if (parts[i] === 'guests' && parts[i + 1]) {
      return i + 1
    }
    i--
  }
}

function lookup (host, cb) {
  if (host === 'localhost') {
    return cb(null, host)
  }
  dotlocal.lookup(host, cb)
}

function cut (referer) {
  var urlp = url.parse(referer)
  var parts = urlp.pathname.split('/')
  urlp.pathname = '/' + parts.slice(2).join('/')
  return url.format(urlp)
}
