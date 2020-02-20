var { hash, string } = require('stdopt')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var Guest = require('../guest')
var Lede = require('./lede')
var Main = require('./main')
var ts = require('monotonic-timestamp')

var cache = new Map()
var struct = {
  id: string,
  author: Guest,
  lede: Lede,
  main: Main
}

function Story (s) {
  if (this instanceof Story) Base.call(this, s)
  else return new Story(s)
}

Story.parse = function (s) {
  return hash(s, struct).use(function (err, story) {
    if (err) return new Error(err)
    return story
  })
}

Story.create = function (s) {
  var id = ts().toString(36).padStart(10, '0')
  var story = Story({ id, ...s }).use()
  cache.set(id, story)
  return story
}

module.exports = Story
