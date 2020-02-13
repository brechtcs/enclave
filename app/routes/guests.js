var { createProxyServer } = require('http-proxy')
var Guest = require('../models/guest')
var Host = require('../models/host')
var client = require('client-ip')

var proxy = createProxyServer()

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

module.exports.tunnel.coherence = function (req, res, next) {
  var referer = new URL(req.headers.referer)
  var url = new URL(req.url, 'http://localhost')
  url.pathname = rewrite(referer.pathname, () => '/coherence' + url.pathname)

  if (url.pathname === '/' || url.pathname.startsWith('/coherence')) {
    return next()
  }
  req.url = url.pathname + url.search
  tunnel(req, res, next)
}

module.exports.tunnel.partial = function (req, res, next) {
  var url = new URL(req.headers.referer)
  url.pathname = rewrite(url.pathname, last => '/partial' + last)

  if (url.pathname === '/' || url.pathname.startsWith('/partial')) {
    return next()
  }
  req.url = url.pathname + url.search
  tunnel(req, res, next)
}

function rewrite (path, last) {
  var parts = path.split(/guests\/(\w+)/)
  parts.push(last(parts.pop()))
  return parts.map(p => p === '/' ? '/guests/' : p).join('')
}

function tunnel (req, res, next) {
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
