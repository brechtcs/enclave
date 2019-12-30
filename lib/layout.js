var css = require('./css')

module.exports = function layout (opts, content, apply) {
  return ['html',
    ['head',
      ['meta', { charset: 'utf-8' }],
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      ['title', 'Enclave'],
      ['style', css],
      ['script', { src: apply.scriptUrl }]
    ],
    ['body',
      header(),
      content,
      footer()
    ]
  ]
}

function header () {
  return ['header',
    [ 'nav',
      ['a', { href: 'posts' }, 'posts'],
      ['h1', 'Enclave'],
      ['a', { href: 'guests' }, 'guests']
    ]
  ]
}

function footer () {
  return ['footer',
    [ 'nav',
      ['a', { href: '/' }, 'home'],
      ['a', { href: '/settings' }, 'settings']
    ]
  ]
}
