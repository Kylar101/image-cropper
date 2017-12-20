'use strict';

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/app.js',
  output: {
    filename: 'cropper-bundle.js',
    path: path.resolve(__dirname, './app')
  },
  module: {
  	rules: [{
  		test: /\.(sass|scss|css)$/,
  		use: ExtractTextPlugin.extract({
	        use: [{
	        	loader: 'css-loader',
	        	options: {
	        		url: false,
							sourceMap: true
	        	}
	        },
	        'sass-loader'
	        ]
	    })
  	},
  	]
  },
  plugins: [
  	new ExtractTextPlugin('css/style.css'),	
  ]
};