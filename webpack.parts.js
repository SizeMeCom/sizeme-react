/* global require exports */

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
//const GitRevisionPlugin = require("git-revision-webpack-plugin");
const BabiliPlugin = require("babili-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

exports.devServer = ({ host, port, publicPath } = {}) => ({
    devServer: {
        historyApiFallback: true,
        stats: "errors-only",
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        overlay: {
            errors: true,
            warnings: true
        },
        compress: true
    }
});

exports.lintJavaScript = ({ include, exclude, options }) => ({
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include,
                exclude,
                enforce: "pre",

                loader: "eslint-loader",
                options
            }
        ]
    }
});

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.scss$/,
                include,
                exclude,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
});

const autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => ([
            require("autoprefixer")
        ])
    }
});

exports.extractCSS = ({ include, exclude, filename } = {}) => {
    // Output extracted CSS to a file
    const plugin = new ExtractTextPlugin({
        filename: filename || "[name].[contenthash:8].css",
        allChunks: true
    });

    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include,
                    exclude,
                    use: plugin.extract({
                        use: ["css-loader", "sass-loader", autoprefix()],
                        fallback: "style-loader"
                    })
                }
            ]
        },
        plugins: [plugin]
    };
};

exports.purifyCSS = ({ paths }) => ({
    plugins: [
        new PurifyCSSPlugin({ paths })
    ]
});

/*exports.lintCSS = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,
                enforce: "pre",

                loader: "postcss-loader",
                options: {
                    plugins: () => ([
                        require("stylelint")({
                            // Ignore node_modules CSS
     *///                       ignoreFiles: "node_modules/**/*.css",
     /*                   }),
                    ]),
                },
            },
        ],
    },
});*/

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg)$/,
                include,
                exclude,

                use: {
                    loader: "url-loader",
                    options
                }
            }
        ]
    }
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                // Capture eot, ttf, woff, and woff2
                test: /\.(eot|ttf|woff|woff2|svg)(\?v=\d+\.\d+\.\d+)?$/,
                include,
                exclude,

                use: {
                    loader: "file-loader",
                    options
                }
            }
        ]
    }
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type
});

exports.extractBundles = (bundles) => ({
    plugins: bundles.map((bundle) => (
        new webpack.optimize.CommonsChunkPlugin(bundle)
    ))
});

exports.loadJavaScript = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include,
                exclude,

                loader: "babel-loader",
                options: {
                    // Enable caching for improved performance during
                    // development.
                    // It uses default OS directory by default. If you need
                    // something more custom, pass a path to it.
                    // I.e., { cacheDirectory: "<path>" }
                    cacheDirectory: true
                }
            }
        ]
    }
});

exports.clean = (path) => ({
    plugins: [
        new CleanWebpackPlugin([path])
    ]
});

/*exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version(),
        }),
    ],
});*/

exports.minifyJavaScript = () => ({
    plugins: [
        new BabiliPlugin()
    ]
});

exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false
        })
    ]
});

/*exports.setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env),
        ],
    };
};*/

exports.page = (
    {
        path = "",
        template = require.resolve(
            "html-webpack-plugin/default_index.ejs"
        ),
        title,
        entry,
        chunks,
        inject = "head"
    } = {}
) => (
    {
        entry,
        plugins: [
            new HtmlWebpackPlugin({
                chunks,
                filename: `${path && path + "/"}index.html`,
                template,
                title,
                inject
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: "defer"
            })
        ]
    }
);