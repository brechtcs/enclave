var Coherence = require('coherence-framework')
var Guest = require('../models/guest')
var Post = require('../models/post')
var css = require('./css')
var guests = require('../views/guests')
var posts = require('../views/posts')
var settings = require('../views/settings')

function layout (opts, content, apply) {
  return ['html',
    ['head',
      ['meta', { charset: 'utf-8' }],
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      ['title', 'Enclave'],
      ['style', css],
      ['script', { src: apply.scriptUrl }]
    ],
    ['body',
      ['header',
        ['nav',
          ['h1', ['a', { href: '/' }, 'Enclave']],
          ['a', { href: 'posts' }, 'posts'],
          ['a', { href: 'guests' }, 'guests'],
          ['a', { href: '/settings' }, 'settings']
        ]
      ],
      content
    ]
  ]
}

var ui = Coherence(layout)
ui.use('guests', guests)
ui.use('posts', posts)
ui.use('settings', settings)

Guest.on('add', invalidate('guests'))
Guest.on('delete', invalidate('guests'))
Post.on('create', invalidate('posts'))

function invalidate (view) {
  return function () {
    ui.invalidate(view, Date.now())
  }
}

module.exports = ui
