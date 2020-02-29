var { REQ } = require('./events')
var Guest = require('../../models/guest')
var ts = require('monotonic-timestamp')

var requests = new Map()

module.exports = tunnel
module.exports.resolve = resolve

function resolve (id, data) {
  var { res } = JSON.parse(data)
  var promise = requests.get(id)

  if (!promise) {
    return console.warn('Cannot match response:', data)
  }

  if (res.error) promise.reject(res.error)
  else promise.resolve(res)
}

function tunnel (req, res, next) {
  var key, guest
  key = req.params.key
  guest = Guest.get(key)

  if (guest.isError) {
    res.writeHead(404)
    res.end('guest not found: ' + key)
    return
  } else if (guest.isHost) {
    return res.redirect(req.url)
  }

  request(guest, req).then(function (r) {
    res.writeHead(r.status, r.header)
    res.end(r.text)
  }).catch(next)
}

function request (guest, { url }) {
  var type = REQ
  var data = JSON.stringify({ url })
  var id = ts()

  guest.send(JSON.stringify({ type, data, id }))

  return new Promise(function (resolve, reject) {
    requests.set(id, { resolve, reject })
  })
}
