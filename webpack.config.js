var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/app.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader: 'babel-loader',
        query:
        {
            presets:['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx']
  }
};

module.exports = config;
