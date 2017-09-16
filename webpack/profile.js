const b = require('./macros')
const root = require('./root')

module.exports = [
  b.output({
    filename: '[name].js',
    path: root.join('dist'),
    publicPath: '/'
  }),

  b.defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV,
  }),

  b.alias({
    'dos-common': root.join('packages/dos-common'),
    'dos-components': root.join('packages/dos-common'),
    'dos1': root.join('packages/dos1'),
    'dos2': root.join('packages/dos2'),
    'dos2-pak-scraper': root.join('packages/dos2-pak-scraper'),
  }),

  b.resolveModules({
    directories: [
      root.join('packages/dos-common/js/shims'),
      root.join('node_modules'),
    ],

    relativeDirectories: [],
  }),

  b.generateBundle({
    name: 'dos',
    modules: [ root.join('packages/dos/js/index.js') ]
  }),

  b.compileHTML({
    inject: false,
    template: root.join('packages/dos/index.html'),
    filename: 'index.html',
  }),

  b.copyStaticFiles(),
  b.dontEmitOnError(),

  b.compileJSON(),
  b.compileAssets(),
  b.compile({
    pattern: /\.yml$/,
    loaders: [
      b.loader({ name: 'json-loader' }),
      b.loader({ name: 'yaml-loader' })
    ]
  }),

  b.when(process.env.NODE_ENV === 'development', [
    b.devTool('eval'),
    b.compileJS({ hot: true }),
    b.compileCSS({ extract: false }),
  ]),

  b.when(process.env.NODE_ENV === 'production', [
    b.compileJS({ hot: false }),
    b.compileCSS({ extract: true }),

    b.optimizeJS(),

    b.defineConstants({
      'process.env.GOOGLE_ANALYTICS_KEY': 'UA-69626857-1'
    })
  ]),
]