/* global require, module, __dirname */

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "dist");
const APP_DIR = path.resolve(__dirname, "src");
const SCSS_DIR = path.join(APP_DIR, "scss");

module.exports = {
    entry: {
        "sizeme": `${APP_DIR}/index.js`,
        "sizeme-styles": `${SCSS_DIR}/main.scss`
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].js",
        devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    },
    devtool: "source-map",
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "sizeme-vendor",
            minChunks: function (module) {
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "sizeme-manifest",
            minChunks: Infinity
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            allChunks: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                use: "babel-loader"
            },
            {
                test: /\.scss$/,
                include: SCSS_DIR,
                loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
            },
            {
                test: /\.(png|jpg)$/,
                include: path.join(APP_DIR, "images"),
                loader: "url-loader?limit=10000"
            }
        ]
    }
};
