var { hash, list, number } = require('stdopt')
var { getter } = require('stdprop')
var Base = require('stdopt/base')
var Guest = require('../guest')
var Lede = require('./lede')
var Section = require('./section')
var VError = require('verror')
var ts = require('monotonic-timestamp')

var cache = new Map()
var struct = {
  id: number,
  posted: number,
  from: Guest,
  to: Guest,
  lede: Lede,
  sections: list.of(Section)
}

function Story (s) {
  if (this instanceof Story) Base.call(this, s)
  else return new Story(s)
}

Story.parse = function (s) {
  return hash(s, struct).use(function (err, story) {
    if (err) return new VError(err, 'Invalid Story')
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
  var story = cache.get(Number(id))
  return story || Story(story)
}

Story.list = function () {
  return Array.from(cache.values())
}

getter(Story.prototype, 'id', function id () {
  return this.use(function (err, s) {
    if (err) throw new VError(err, 'Cannot get id')
    return s.id
  })
})

getter(Story.prototype, 'posted', function posted () {
  return this.use(function (err, s) {
    if (err) throw new VError(err, 'Cannot get posted')
    return s.posted
  })
})

getter(Story.prototype, 'from', function from () {
  return this.use(function (err, s) {
    if (err) throw new VError(err, 'Cannot get from')
    return Guest(s.from)
  })
})

getter(Story.prototype, 'to', function to () {
  return this.use(function (err, s) {
    if (err) throw new VError(err, 'Cannot get to')
    return Guest(s.to)
  })
})

getter(Story.prototype, 'lede', function lede () {
  return this.use(function (err, s) {
    if (err) throw new VError(err, 'Cannot get lede')
    return s.lede
  })
})

getter(Story.prototype, 'sections', function sections () {
  return this.use(function (err, s) {
    if (err) throw new VError(err, 'Cannot get sections')
    return s.sections
  })
})

module.exports = Story
