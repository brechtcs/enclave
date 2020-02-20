var h = require('hastscript')

module.exports = function () {
  return textup
}

function textup (tree) {
  var ch = tree.children

  if (ch && ch.length === 1 && ch[0].type === 'text') {
    tree.children = parse(ch[0].value)
  }
  return tree
}

function parse (text) {
  return text.split('\n\n').map(function (node) {
    return h('p', node.split('\n').reduce(function (p, line) {
      p.push(line)
      p.push(h('br'))
      return p
    }, []).slice(0, -1))
  })
}
