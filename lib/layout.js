module.exports = function layout (opts, content, apply) {
  return ['html',
    ['head',
      ['meta', { charset: 'utf-8' }],
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      ['title', 'Hostbook'],
      ['script', { src: apply.scriptUrl }]
    ],
    ['body',
      header(),
      content
    ]
  ]
}

function header () {
  return ['header',
    [ 'ul',
      ['li', ['a', { href: '/' }, 'home']],
      ['li', ['a', { href: 'guests' }, 'guests']],
      ['li', ['a', { href: 'posts' }, 'posts']]
    ]
  ]
}
