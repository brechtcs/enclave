var { hash, string } = require('stdopt')
var Base = require('stdopt/base')
var parse = require('rehype-parse')
var sanitize = require('rehype-sanitize')
var schema = require('./sanitize')
var stringify = require('rehype-stringify')
var unified = require('unified')
var textup = require('./textup')

var struct = {
  content: string
}

function Section (html) {
  if (this instanceof Section) Base.call(this, html)
  else return new Section(html)
}

Section.parse = function (html) {
  var content = rehype(html)

  return hash({ content }, struct).use(function (err, s) {
    if (err) throw new Error(err)
    return s
  })
}

module.exports = Section

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
