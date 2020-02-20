var Base = require('stdopt/base')
var parse = require('rehype-parse')
var sanitize = require('rehype-sanitize')
var schema = require('./sanitize')
var stringify = require('rehype-stringify')
var unified = require('unified')
var textup = require('./textup')

function Lede (html) {
  if (this instanceof Lede) Base.call(this, html)
  else return new Lede(html)
}

Lede.parse = function (html) {
  return rehype(html)
}

module.exports = Lede

/**
 * Rehype parsing logic
 */
var allowed = ['br', 'p', 'strong', 'em']
var strip = schema.tagNames.filter(function (tag) {
  return allowed.includes(tag) === false
})

schema.strip.push.apply(schema.strip, strip)
schema.tagNames = allowed

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