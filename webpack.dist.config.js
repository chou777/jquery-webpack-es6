var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');

// 构建manifest文件
var manifest = function () {
  this.plugin('done', function (stats) {
    var statsJson = stats.toJson();
    var assetsByChunkName = statsJson.assetsByChunkName;
    var modules = statsJson.modules;

    modules.forEach(function (module) {
      if (module.assets && module.assets.length) {
        assetsByChunkName[module.name] = module.assets[0];
      }
    });
    fs.writeFileSync(
      path.join(`${__dirname}/build`, 'manifest.json'),
      JSON.stringify(assetsByChunkName)
    );
  });
};


config.output = {
  filename: 'js/[name].[chunkhash:8].js',
  chunkFilename: '[name].[chunkhash:8].js',
  path: __dirname + '/build'
};

config.plugins = config.plugins.concat([
  // manifest,
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html'
  }),
  new webpack.optimize.UglifyJsPlugin({
      mangle: {
          except: ['$', 'exports', 'require']
      }
  })  
]);

module.exports = config;

