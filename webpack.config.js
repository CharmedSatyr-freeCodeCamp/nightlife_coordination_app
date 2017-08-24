const webpack = require('webpack') //Not sure why this is here.
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
   entry: ['babel-polyfill', __dirname + '/client/src/index.jsx'],
   module: {
      rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['env', 'react']
            }
         },
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
         }, {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
         }, {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
               limit: 10000, //limit =< 10000 ? Data URL : fallback to file-loader
               name: 'img/[sha256:hash:10].[ext]' //If using file-loader, emit to img/ as a 10 digit sha256 has with the proper extension.
            }
         }, {
            test: /\.(eot|ttf|svg|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader',
            options: {
               limit: 10000,
               mimetype: 'application/font-woff',
               name: 'fonts/[sha256:hash:7].[ext]'
            }
         }

      ]
   },
   output: {
      path: __dirname + '/client/views/js',
      filename: 'client.bundle.js'
   },
   plugins: [
      /*    new webpack.DefinePlugin({ //This streamlines minification and gets rid of *.min.js console warnings for UglifyJsPlugin
            'process.env': {
              NODE_ENV: JSON.stringify('production')
            }
          }),
      new webpack.optimize.UglifyJsPlugin(),*/
      new HTMLWebpackPlugin({
         template: __dirname + '/client/src/' + 'index.html',
         filename: __dirname + '/client/views/' + 'index.html',
         inject: 'body'
      })
   ]
}
