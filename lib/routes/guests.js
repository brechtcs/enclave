var Guest = require('../models/guest')
var Host = require('../models/host')
var client = require('client-ip')
var request = require('request')
var pump = require('pump')

module.exports.identify = function (req, res, next) {
  req.guest = Guest.get(req.get('Enclave-Origin'))
  next()
}

module.exports.receive = function (req, res) {
  var guest = req.body
  guest.address = client(req)

  Guest.add(guest)
  res.writeHead(204)
  res.end()
}

module.exports.tunnel = function (req, res, next) {
  if (req.url === '/') {
    return next()
  }
  tunnel(req, res, next)
}

module.exports.tunnel.partial = function (req, res, next) {
  var { pathname } = new URL(req.headers.referer)
  var parts = pathname.split('/')
  if (parts[parts.length - 2] !== 'partial') {
    parts[parts.length - 1] = 'partial/' + parts[parts.length - 1]
  }
  var rewritten = '/' + parts.slice(2).join('/')

  if (rewritten === '/' || rewritten.startsWith('/partial')) {
    return next()
  }
  req.url = rewritten
  tunnel(req, res, next)
}

function tunnel (req, res, next) {
  console.log('TUN ', req.url)
  var parts, idx, key, guest
  parts = req.url.split('/')
  idx = destination(parts)
  key = parts[idx]
  guest = Guest.get(key)

  if (guest.isValid) {
    res.setHeader('referer', req.headers.referer)
    return res.redirect('/guests/' + parts.slice(idx).join('/'))
  }
  key = parts[1]
  guest = Guest.get(key)

  if (!guest.isValid) {
    throw new Error('guest not found: ' + key)
  }

  var url = new URL(guest.url)
  url.pathname = parts.slice(2).join('/')

  var host = Host.get()
  var headers = {}
  headers['Enclave-Origin'] = req.get('Enclave-Origin') || String(host.publicKey)
  if (req.headers.referer) {
    headers.referer = cut(req.headers.referer)
  }

  var source = request(url.href, {
    followRedirect: false,
    headers: headers,
    method: req.method
  })

  pump([req, source, res], function (err) {
    if (err) next(err)
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

function cut (referer) {
  var url = new URL(referer)
  var parts = url.pathname.split('/')
  url.pathname = '/' + parts.slice(2).join('/')
  return url.href
}
