/* global require, module, __dirname, process */

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const parts = require("./webpack.parts");
const glob = require("glob");

const PATHS = {
    app: path.resolve(__dirname, "src"),
    build: path.resolve(__dirname, "dist"),
    images: path.resolve(__dirname, "src/images")
};

process.traceDeprecation = true;

const commonConfig = merge([
    {
        entry: {
            sizeme: PATHS.app
        },
        resolve: {
            extensions: [".js", ".jsx"]
        },
        output: {
            path: PATHS.build,
            filename: "[name].js"
        }
    },
    parts.loadFonts({
        include: /.*fonts.*/,
        options: {
            name: "[name].[hash].[ext]"
        }
    }),
    parts.lintJavaScript({ include: PATHS.app }),
    parts.loadJavaScript({ include: PATHS.app }),
    parts.attachRevision()
]);

const developmentConfig = merge([
    {
        output: {
            devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
        }
    },
    parts.generateSourceMaps({ type: "source-map" }),
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST || "0.0.0.0",
        port: process.env.PORT,
        publicPath: "/dist/"
    }),
    parts.loadCSS(),
    parts.loadImages({
        include: PATHS.images,
        options: {
            limit: 10000
        }
    }),
    parts.page({ template: "index.html" }),
    parts.page({ template: "index1.html", filename: "index1.html" }),
    parts.page({ template: "index2.html", filename: "index2.html" }),
    parts.page({ template: "index3.html", filename: "index3.html" }),
    parts.page({ template: "index4.html", filename: "index4.html" }),
    parts.page({ template: "index5.html", filename: "index5.html" }),
    parts.page({ template: "kookenka.html", filename: "kookenka.html" }),
    parts.page({ template: "selectric.html", filename: "selectric.html" })
]);

const productionConfig = merge([
    {
        performance: {
            hints: false, // 'error' or false are valid too
            maxEntrypointSize: 100000, // in bytes
            maxAssetSize: 450000 // in bytes
        },
        output: {
            chunkFilename: "[name].[chunkhash:8].js",
            filename: "[name].js" //"[name].[chunkhash:8].js"
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin()
        ]/*,
        recordsPath: path.join(__dirname, "records.json")*/
    },
    parts.clean(PATHS.build),
    parts.extractCSS({ filename: "sizeme-styles.css" }),
    parts.extractBundles([
        {
            name: "sizeme-vendor",
            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf("node_modules") >= 0 &&
                resource.match(/\.js$/)
            )
        },
        {
            name: "sizeme-manifest",
            minChunks: Infinity
        }
    ]),
    parts.loadImages({
        include: PATHS.images,
        options: {
            limit: 15000,
            name: "[name].[hash:8].[ext]"
        }
    }),
    parts.minifyJavaScript(),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
                // Run cssnano in safe mode to avoid
                // potentially unsafe transformations.
                safe: true
            },
            zindex: false
        }
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true })
    })
]);

module.exports = (env) => {
    const config = env === "production" ?
        productionConfig :
        developmentConfig;
    
    return merge([commonConfig, config]);
};