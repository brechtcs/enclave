var Bonjour = require('bonjour')
var DotLocal = require('dotlocal')
var request = require('request')
var pump = require('pump')
var url = require('url')

var bonjour = Bonjour()
var dotlocal = DotLocal()

var type = 'hostbook'
var network = bonjour.find({ type })

module.exports.announce = function (name, port) {
  bonjour.publish({ type, name, port })
}

module.exports.display = function () {
  var guests = network.services.map(function (s) {
    return ['li',
      ['a', { href: `guests/${s.name}/` }, s.name]
    ]
  })

  return ['ul', guests]
}

module.exports.on = function (evt, cb) {
  if (evt === 'change') {
    network.on('up', cb)
    network.on('down', cb)
  }
}

module.exports.proxy = function (req, res, next) {
  var parts, idx, name, service
  parts = req.url.split('/')
  idx = destination(parts)
  name = parts[idx]
  service = network.services.find(s => s.name === name)

  if (service) {
    res.setHeader('referer', req.headers.referer)
    return res.redirect('/guests/' + parts.slice(idx).join('/'))
  }
  name = parts[1]
  service = network.services.find(s => s.name === name)

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
