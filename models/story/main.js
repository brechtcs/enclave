var Base = require('stdopt/base')
var parse = require('rehype-parse')
var sanitize = require('rehype-sanitize')
var schema = require('./sanitize')
var stringify = require('rehype-stringify')
var unified = require('unified')
var textup = require('./textup')

function Main (html) {
  if (this instanceof Main) Base.call(this, html)
  else return new Main(html)
}

Main.parse = function (html) {
  return rehype(html)
}

module.exports = Main

/**
 * Rehype parsing logic
 */
var parser = unified()
  .use(parse)
  .use(sanitize, schema)
  .use(textup)
  .use(stringify)
  .freeze()

function rehype (html) {
  var result = parser.processSync(html)
  return result.contents
}
