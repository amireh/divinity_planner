var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var loaders = [ 'babel-loader' ];
var plugins = [];

if (process.env.NODE_ENV === 'development') {
  loaders.push('react-hot-loader');
}
else if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());

  if (fs.existsSync(path.resolve(__dirname, '.ga'))) {
    var trackerId = fs.readFileSync(path.resolve(__dirname, '.ga'), 'utf-8');

    plugins.push(
      new webpack.DefinePlugin({
        'process.env.GA_TRACKER_ID': JSON.stringify(trackerId.trim())
      })
    );
  }
}

module.exports = {
  entry: path.resolve(__dirname, 'ui/index.js'),

  plugins: plugins,

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public', 'dist'),
    publicPath: 'dist/'
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