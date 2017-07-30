var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');
var packageConfig = require('./package.json');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var port = packageConfig.config.clientPort;

config.output = {
  filename: '[name].js',
  publicPath: `//0.0.0.0:${port}/`,
  path: path.resolve(__dirname, 'src')
};

config.devServer = {
  host: '0.0.0.0',
  port: port
};

config.plugins = config.plugins.concat([

  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin(),

  new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
  })
]);

module.exports = config;
