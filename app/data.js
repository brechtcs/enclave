var Host = require('../models/host')
var Guest = require('../models/guest')
var env = require('env-paths')
var fs = require('fs').promises
var getPort = require('get-port')
var mkdirp = require('mkdirp')
var path = require('path')

async function create (name, port) {
  var paths = getEnv(name)

  await mkdirp(paths.config)
  var confPath = path.join(paths.config, 'config.json')
  var keyPath = path.join(paths.config, 'private.pem')
  var host = Host.create({ name, port })

  return Promise.all([
    fs.writeFile(confPath, JSON.stringify(host)),
    fs.writeFile(keyPath, host.privateKey.pem)
  ])
}

async function open (name, port) {
  var paths = getEnv(name)
  var confPath = path.join(paths.config, 'config.json')
  var keyPath = path.join(paths.config, 'private.pem')

  Host.on('change', async function (host) {
    await fs.writeFile(confPath, JSON.stringify(host))
  })

  var config = await fs.readFile(confPath, 'utf8')
  var key = await fs.readFile(keyPath, 'utf8')
  var host = Host.init(JSON.parse(config), key)
  host.port = await getPort({
    port: port ? [port, host.port] : host.port
  })

  Guest.join({
    name: host.name,
    port: host.port,
    address: '::ffff:127.0.0.1',
    key: host.publicKey.pem
  })
}

function getEnv (name) {
  return env(path.join('Enclave', name), {
    suffix: ''
  })
}

module.exports.create = create
module.exports.open = open
