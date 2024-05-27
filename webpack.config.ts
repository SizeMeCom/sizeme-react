import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { GitRevisionPlugin } from "git-revision-webpack-plugin";
import { glob } from "glob";
import path from "path";
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import merge from "webpack-merge";

const PATHS = {
  app: path.resolve(__dirname, "src"),
  build: path.resolve(__dirname, "dist"),
  images: path.resolve(__dirname, "src/images"),
  testSites: path.resolve(__dirname, "test-sites"),
};

const devServer: DevServerConfiguration = {
  https: true,
  hot: true,
  port: 8080,
  static: PATHS.testSites,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  },
};

const devConfig: Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  devServer,
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify("dev"),
      BUILD_DATE: JSON.stringify(new Date().toJSON()),
    }),
  ],
};

const prodConfig = (env: Record<string, unknown>): Configuration => {
  const gitRevisionPlugin = new GitRevisionPlugin({
    versionCommand: "describe --always --tags --dirty",
  });
  return {
    output: {
      filename: "[name].js",
      chunkFilename: "[name].[chunkhash:8].js",
      publicPath: typeof env["cdn"] === "string" ? env["cdn"] : "https://test.sizeme.com/3.0/",
    },
    plugins: [
      new webpack.ids.HashedModuleIdsPlugin(),
      new PurgeCSSPlugin({
        paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true }),
        blocklist: [],
        safelist: [],
      }),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        BUILD_DATE: JSON.stringify(new Date().toJSON()),
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          // `terserOptions` options will be passed to `swc` (`@swc/core`)
          // Link to options - https://swc.rs/docs/config-js-minify
          terserOptions: {},
        }),
      ],
    },
  };
};

const config = (env: Record<string, unknown>, argv: Record<string, unknown>): Configuration =>
  merge(
    {
      context: path.resolve(__dirname),
      entry: {
        sizeme: path.resolve(PATHS.app, "index"),
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
      output: {
        path: PATHS.build,
        filename: "[name].js",
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: PATHS.app,
            loader: "swc-loader",
          },
          {
            test: /\.(png|jpg|svg)$/,
            include: PATHS.images,
            type: "asset/resource",
          },
          {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
          },
        ],
      },
    },
    argv.mode === "production" ? prodConfig(env) : devConfig
  );

export default config;
