const { b } = require('mortal-webpack')
const root = require('./root')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = Object.assign({}, b, {
  compileJS({ hot }) {
    return b.compile({
      pattern: /\.js$/,
      include: [
        root.join('packages/dos-common/js'),
        root.join('packages/dos/js'),
        root.join('packages/dos1/js'),
        root.join('packages/dos2/js'),
      ],

      loaders: [
        b.loader({
          name: 'babel-loader',
          options: {
            presets: [ 'es2015', 'react' ],
            babelrc: false
          }
        }),

        b.loader({
          enabled: hot,
          name: 'react-hot-loader'
        })
      ]
    })
  },

  compileJSON() {
    return b.compile({
      pattern: /\.json$/,
      loaders: [
        b.loader({ name: 'json-loader' })
      ]
    })
  },

  compileAssets() {
    return b.compile({
      pattern: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
      loaders: [
        b.loader({ name: 'url-loader?limit=100000' })
      ]
    })
  },

  compileCSS({ extract = false }) {
    if (extract) {
      return [
        b.compile({
          useSingleLoader: true,
          pattern: /\.less$/,
          loaders: [
            b.loader(ExtractTextWebpackPlugin.extract('style-loader', [
              'css-loader?importLoaders=1',
              'less-loader'
            ]))
          ]
        }),

        b.plugin(new ExtractTextWebpackPlugin('dos.css'))
      ]
    }
    else {
      return b.compile({
        pattern: /\.less$/,
        loaders: [
          b.loader({ name: 'style-loader' }),
          b.loader({
            name: 'css-loader',
            options: {
              importLoaders: 1
            }
          }),
          b.loader({ name: 'less-loader' })
        ]
      })
    }
  },

  copyStaticFiles() {
    return b.plugin(new CopyWebpackPlugin([
      {
        from: root.join('packages/dos/css/splash.css'),
        to: 'dos-splash.css'
      },
      {
        from: root.join('packages/dos/favicon.ico'),
        to: 'favicon.ico'
      }
    ]))
  }
})