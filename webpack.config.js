/* global require, module, __dirname */

const path = require("path");
const webpack = require("webpack");

const BUILD_DIR = path.resolve(__dirname, "dist");
const APP_DIR = path.resolve(__dirname, "src");

module.exports = {
    entry: {
        main: APP_DIR + "/SizeMeController.jsx"
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module){
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                use: "babel-loader"
            }
        ]
    }
};
