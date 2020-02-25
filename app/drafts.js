var { format } = require('url')
var string = require('stdopt/string')
var ts = require('monotonic-timestamp')

module.exports.create = create
module.exports.display = display

function create (req, res) {
  var url = format({
    pathname: ts(),
    query: req.query
  })

  res.redirect(url)
}

function display (req, res) {
  var title = 'Draft'
  var to = string(req.query.to).or('').value()
  res.render('draft', { title, to })
}
