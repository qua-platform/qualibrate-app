// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require("dotenv-webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyWebpackPlugin = require("copy-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const inProject = path.resolve.bind(path, __dirname);
const inProjectSrc = (file) => inProject("src", file);

const public_path = process.env.PUBLIC_PATH || ".";

const config = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: {
    main: [inProjectSrc("index")],
  },
  output: {
    path: inProject("dist"),
    publicPath: public_path,
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },
  resolve: {
    modules: [inProject("src"), "node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: { url: false, punycode: false },
    alias: {
      "react/jsx-dev-runtime": "react/jsx-dev-runtime",
      "react/jsx-runtime": "react/jsx-runtime",
    },
  },
  devServer: {
    static: [
      {
        directory: inProject("public"),
        publicPath: "/",
      },
    ],
    port: 1234,
    hot: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
    compress: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: inProject("public/assets"),
          to: inProject("dist/assets"),
        },
        {
          from: inProject("public/manifest.json"),
          to: inProject("dist/manifest.json"),
        },
        {
          from: inProject("public/service-worker.js"),
          to: inProject("dist/service-worker.js"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].chunk.css",
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "node_modules/"),
        use: ["babel-loader"],
      },
      {
        test: /\.(png|svg)$/,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]",
                exportLocalsConvention: "camelCase",
              },
              sourceMap: true,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              modules: {
                localIdentName: "[local]",
              },
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    runtimeChunk: false,
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  performance: {
    hints: false,
  },
  stats: {
    errorDetails: true,
  },
};

module.exports = config;
