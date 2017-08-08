/**
 * @author Zac Chou
 * @description Webpakc Config use for dev and dist
 */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');

var extractLess = new ExtractTextPlugin({
  filename: process.env.NODE_ENV === 'development' ? 'css/[name].css' : 'css/[name].[chunkhash:8].css',
  disable: false
});

var postCssOptions = {
  plugins: () => [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ]
};

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js']
  },
  // externals: {
  //   jquery: 'jQuery'
  // },
  entry: {
    main: [
      './src/js/main.js'
    ],
    vendor: [
      './node_modules/normalize.css/normalize.css',
    ]
  },
  module: {
    loaders: [{
      test: /\.html$/,
      use: [ {
        loader: 'html-loader',
        options: {
          attrs: ['img:src'],
          minimize: false,
          root: path.resolve(__dirname, 'src'),
        }
      }],
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }, {
      test: /\.less$/,
      use: extractLess.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: postCssOptions
        }, {
          loader: 'less-loader'
        }],
        // use style-loader in development
        fallback: 'style-loader',
        publicPath: '../'
      })
    }, {
      test: /\.css$/,
      use: extractLess.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: postCssOptions

        }],
        // use style-loader in development
        fallback: 'style-loader',
        publicPath: '../'
      })
    }, {
      test: /\.(jpg|jpeg|gif|png)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
       }
      ]
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    }]
  },
  plugins: [
    extractLess,
    // 提取公共模块。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === -1;
      }
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
  ]
};

