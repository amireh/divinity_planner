var path = require('path');
var webpack = require('webpack');
var loaders = [ 'babel-loader' ];
var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.NODE_ENV === 'development') {
  loaders.push('react-hot-loader');
}
else if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : null,
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
    // noParse: /vendor/,
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'ui')
        ],
        exclude: [
          path.resolve(__dirname, 'ui', 'vendor')
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
        loader: 'style-loader!css-loader?importLoaders=1!less-loader'
      },

      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?importLoaders=1'
      }
    ]
  }
}