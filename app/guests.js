var { createProxyServer } = require('http-proxy')
var Guest = require('../models/guest')
var Host = require('../models/host')
var client = require('client-ip')
var ip = require('ip')

var proxy = createProxyServer()

module.exports.display = display
module.exports.identify = identify
module.exports.receive = receive
module.exports.tunnel = tunnel

function display (req, res) {
  var title = 'Guests'
  var guests = Guest.list()
  res.render('guests', { title, guests })
}

function identify (req, res, next) {
  req.guest = Guest.get(req.get('Enclave-Origin'))
  req.local = ip.isLoopback(client(req))
  next()
}

function receive (req, res) {
  var guest = req.body
  guest.address = client(req)

  Guest.add(guest)
  res.writeHead(204)
  res.end()
}

function tunnel (req, res, next) {
  if (req.url === '/') {
    return next()
  }

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
    return next(new Error('guest not found: ' + key))
  }

  req.url = parts.slice(2).join('/')
  req.headers['Enclave-Origin'] = req.get('Enclave-Origin') || String(Host.get().publicKey)
  if (req.headers.referer) {
    req.headers.referer = cut(req.headers.referer)
  }

  proxy.web(req, res, { target: guest.url }, function (err) {
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
