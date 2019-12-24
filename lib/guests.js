var bonjour = require('bonjour')()
var type = 'hostbook'
var network = bonjour.find({ type })

module.exports.announce = function (name, port) {
  bonjour.publish({ type, name, port })
}

module.exports.find = function (name) {
  return network.services.find(s => s.name === name)
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
