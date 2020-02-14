var Mold = require('mold-template')
var fs = require('fs')
var path = require('path')
var util = require('util')

module.exports = ExpressMold

/**
 * Extend Mold with Express engine support
 */
function ExpressMold (env) {
  Mold.call(this, env)
}

util.inherits(ExpressMold, Mold)

ExpressMold.prototype.engine = function (app, ext) {
  var mold = new DynamicMold(app, ext, this.env)
  for (var name in this.defs) mold.defs[name] = this.defs[name]

  return function (file, opts, cb) {
    fs.readFile(file, mold.enc, function (err, content) {
      if (err) return cb(err)
      var template = mold.bake(content)
      var view = template(opts)
      cb(null, view)
    })
  }
}

/**
 * Extend Mold to load partials from disk
 */
function DynamicMold (app, ext, env) {
  Mold.call(this, env)
  this.enc = app.get('view encoding') || 'utf8'
  this.ext = ext[0] !== '.' ? '.' + ext : ext
  this.root = app.get('views')
}

util.inherits(DynamicMold, Mold)

DynamicMold.prototype.dispatch = function (name, arg) {
  if (name in this.defs) {
    return this.defs[name](arg)
  }
  try {
    var file = path.join(this.root, name + this.ext)
    var content = fs.readFileSync(file, this.enc)
    var template = this.bake(content)
    return template(arg)
  } catch (err) {
    throw new Error("Invalid template command: '" + name + "'.")
  }
}
