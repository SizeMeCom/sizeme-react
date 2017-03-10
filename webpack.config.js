var path = require('path');
var webpack = require("webpack");

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: {
  	main: APP_DIR + '/index.jsx'
  },
  output: {
  	path: BUILD_DIR,
    filename: '[name].js'
  },
  plugins: [
  	new webpack.optimize.CommonsChunkPlugin({
    	names: ['vendor', 'manifest'], // Specify the common bundle's name.
    	minChunks: function (module) {
        	// this assumes your vendor imports exist in the node_modules directory
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    })
  ],
  module: {
  	rules: [
	  	{
	       	test : /\.jsx?/,
	       	include : APP_DIR,
	       	use : 'babel-loader'        
	    }
    ]
  }
};
