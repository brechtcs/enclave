var { hash, number } = require('stdopt')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var Guest = require('../guest')
var Lede = require('./lede')
var Main = require('./main')
var ts = require('monotonic-timestamp')

var cache = new Map()
var struct = {
  id: number,
  posted: number,
  from: Guest,
  to: Guest,
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
  var id = ts()
  var posted = s.from.equals(s.to) ? id : Infinity
  var story = Story({ ...s, id, posted }).use()
  cache.set(id, story)
  return story
}

Story.get = function (id) {
  return Story(cache.get(Number(id)))
}

Story.list = function () {
  return Array.from(cache.values())
}

getter(Story.prototype, 'id', function () {
  return this.use(function (err, s) {
    if (err) throw err
    return s.id
  })
})

getter(Story.prototype, 'posted', function () {
  return this.use(function (err, s) {
    if (err) throw err
    return s.posted
  })
})

getter(Story.prototype, 'from', function () {
  return this.use(function (err, s) {
    if (err) throw err
    return Guest(s.from)
  })
})

getter(Story.prototype, 'to', function () {
  return this.use(function (err, s) {
    if (err) throw err
    return Guest(s.to)
  })
})

getter(Story.prototype, 'lede', function () {
  return this.use(function (err, s) {
    if (err) throw err
    return s.lede
  })
})

getter(Story.prototype, 'main', function () {
  return this.use(function (err, s) {
    if (err) throw err
    return s.main
  })
})

module.exports = Story
