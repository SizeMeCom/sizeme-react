/* global require, module, __dirname, process */

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const parts = require("./webpack.parts");
const glob = require("glob");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");



const PATHS = {
    app: path.resolve(__dirname, "src"),
    build: path.resolve(__dirname, "dist"),
    images: path.resolve(__dirname, "src/images")
};

process.traceDeprecation = true;

const commonConfig = merge([
    {
        entry: {
            sizeme: PATHS.app + "/index"
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
    parts.attachRevision(),
    {
        plugins: [
            new DuplicatePackageCheckerPlugin()
        ]
    }

]);

const developmentConfig = () => merge([
    {
        mode: "development",
        output: {
            devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
        }
    },
    parts.generateSourceMaps({ type: "cheap-module-source-map" }),
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
    parts.page({ template: "local.html", filename: "local.html" }),
    parts.page({ template: "index1.html", filename: "index1.html" }),
    parts.page({ template: "index1b.html", filename: "index1b.html" }),
    parts.page({ template: "index1c.html", filename: "index1c.html" }),
    parts.page({ template: "index1d.html", filename: "index1d.html" }),
    parts.page({ template: "index2.html", filename: "index2.html" }),
    parts.page({ template: "index2r.html", filename: "index2r.html" }),
    parts.page({ template: "index2kk.html", filename: "index2kk.html" }),
    parts.page({ template: "index2d.html", filename: "index2d.html" }),
    parts.page({ template: "index3.html", filename: "index3.html" }),
    parts.page({ template: "index4.html", filename: "index4.html" }),
    parts.page({ template: "index5.html", filename: "index5.html" }),
    parts.page({ template: "index5-ar.html", filename: "index5-ar.html" }),
    parts.page({ template: "index5b.html", filename: "index5b.html" }),
    parts.page({ template: "kookenka.html", filename: "kookenka.html" }),
    parts.page({ template: "kookenka2.html", filename: "kookenka2.html" }),
    parts.page({ template: "selectric.html", filename: "selectric.html" }),
    parts.page({ template: "makia1.html", filename: "makia1.html" }),
    parts.page({ template: "harrysoflondon.html", filename: "harrysoflondon.html" }),
    parts.page({ template: "levelshoes.html", filename: "levelshoes.html" }),
    parts.page({ template: "nosizeme.html", filename: "nosizeme.html" }),
    parts.page({ template: "no-sku.html", filename: "no-sku.html" }),
    parts.page({ template: "no-select.html", filename: "no-select.html" })
]);

const productionConfig = env => merge([
    {
        mode: "production",
        performance: {
            hints: false, // 'error' or false are valid too
            maxEntrypointSize: 100000, // in bytes
            maxAssetSize: 450000 // in bytes
        },
        output: {
            chunkFilename: "[name].[chunkhash:8].js",
            filename: "[name].js",
            publicPath: env["cdn"] ? env["cdn"] : "https://test.sizeme.com/3.0/"
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin()
        ]
    },
    parts.clean(),
    parts.loadCSS(),
    parts.loadImages({
        include: PATHS.images,
        options: {
            limit: 15000,
            name: "[name].[hash:8].[ext]"
        }
    }),
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
    parts.purgeCSS({
        paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true })
    })
]);

module.exports = (env) => {
    let config;
    if (env.environment === "production") {
        config = productionConfig;
        console.log("Production build");
        if (env["cdn"]) {
            console.log("- CDN: " + env["cdn"]);
        }
    } else {
        config = developmentConfig;
    }

    return merge([commonConfig, config(env)]);
};
