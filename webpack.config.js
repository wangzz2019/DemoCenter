var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
//路径是相对于package.json所在路径
var entry_map = {
  'rum': './public/javascripts/rum.js',
}
module.exports = {
  entry: entry_map,
  devtool: 'source-map',
  output: {
    path: path.resolve(process.cwd(),'dist/'),
    //[name]-[hash].js可以指定hash值。
    filename: '[name].js',
  },
  plugins: [
    // new HtmlWebpackPlugin({ template:'./view/spa.html' })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: 'style-loader' },
          // [css-loader](/loaders/css-loader)
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}