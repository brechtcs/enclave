var Base = require('stdopt/base')
var noop = function () {}

function Method (fn) {
  if (this instanceof Method) Base.call(this, fn)
  else return new Method(fn)
}

Method.parse = function (fn) {
  return typeof fn === 'function' ? fn : noop
}

module.exports = Method
