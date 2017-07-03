var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: {
    portal: APP_DIR + '/portal.jsx',
    viewer: APP_DIR + '/viewer.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].bundle.js"
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
