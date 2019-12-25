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
      ['a', { href: '/' }, 'home'],
      ['h1', 'Enclave'],
      ['a', { href: '/settings' }, 'settings']
    ]
  ]
}

function footer () {
  return ['footer',
    [ 'nav',
      ['a', { href: 'events' }, 'events'],
      ['a', { href: 'posts' }, 'posts'],
      ['a', { href: 'guests' }, 'guests']
    ]
  ]
}
