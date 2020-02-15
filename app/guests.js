var { createProxyServer } = require('http-proxy')
var Guest = require('../models/guest')
var Host = require('../models/host')
var client = require('client-ip')

var proxy = createProxyServer()

module.exports.display = function (req, res) {
  if (req.get('Enclave-Origin')) {
    var title = 'Guests'
    var guests = Guest.list()
    res.render('guests', { title, guests })
  } else {
    var host = Host.get()
    res.redirect(`/guests/${host.publicKey}${req.url}`)
  }
}

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
