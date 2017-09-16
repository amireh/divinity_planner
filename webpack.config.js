const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const root = path.resolve(__dirname)
const gaKey = process.env.NODE_ENV === 'production' ?
  'UA-69626857-1' :
  null
;
const plugins = [
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'dos-common',
  // }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.GOOGLE_ANALYTICS_KEY': JSON.stringify(gaKey)
  }),

  new HtmlWebpackPlugin({
    inject: false,
    template: path.join(root, 'packages/dos/index.html'),
    filename: 'index.html',
  }),

  new CopyWebpackPlugin([{
    from: path.join(root, 'packages/dos/css/splash.css'),
    to: 'dos-splash.css'
  }, {
    from: path.join(root, 'packages/dos/favicon.ico'),
    to: 'favicon.ico'
  }]),

  process.env.NODE_ENV === 'production' && (
    new ExtractTextWebpackPlugin('dos.css')
  )
].filter(x => !!x);

const loaders = [ 'babel-loader?presets[]=es2015&presets[]=react&babelrc=false' ];
if (process.env.NODE_ENV === 'development') {
  loaders.push('react-hot-loader');
}
else if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : null,
  entry: {
    'dos': path.join(root, 'packages/dos/js/index.js'),
  },

  plugins: plugins,

  output: {
    filename: '[name].js',
    path: path.join(root, 'public', 'dist'),
    publicPath: '/dist/'
  },

  resolve: {
    alias: {
      'dos-common': path.join(root, 'packages/dos-common'),
      'dos-components': path.join(root, 'packages/dos-common'),
      'dos1': path.join(root, 'packages/dos1'),
      'dos2': path.join(root, 'packages/dos2'),
    },
    root: [
      path.join(root, 'packages/dos-common/js/shared/shims'),
      path.join(root, 'packages/dos-common/js/shared'),
      path.join(root, 'packages/dos-common/node_modules'),
      path.join(root, 'packages/dos1/node_modules'),
      path.join(root, 'packages/dos2/node_modules'),
    ],
  },

  module: {
    // noParse: /vendor/,
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(root, 'packages/dos-common/js'),
          path.join(root, 'packages/dos/js'),
          path.join(root, 'packages/dos1/js'),
          path.join(root, 'packages/dos2/js'),
        ],
        loader: loaders.join('!')
      },

      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },

      {
        test: /\.less$/,
        loader: process.env.NODE_ENV === 'production' ?
          ExtractTextWebpackPlugin.extract('style-loader', 'css-loader?importLoaders=1!less-loader') :
          'style-loader!css-loader?importLoaders=1!less-loader'
        ,
      },
    ]
  }
}