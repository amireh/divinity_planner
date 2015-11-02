var path = require('path');
var loaders = [ 'babel-loader' ];

if (process.env.NODE_ENV === 'development') {
  loaders.push('react-hot-loader');
}

module.exports = {
  entry: path.resolve(__dirname, 'ui/index.js'),

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public', 'dist'),
    publicPath: '/dist/'
  },

  resolve: {
    modulesDirectories: [
      'shared',
      'node_modules'
    ]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'ui')
        ],
        loader: loaders.join('!')
      },

      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },

      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?importLoaders=1!less-loader'
      },

      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?importLoaders=1'
      }
    ]
  }
}