require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SRC_DIR = path.join(__dirname, "/client/src");
const DIST_DIR = path.join(__dirname, "/client/dist");

module.exports = {
  entry: path.join(SRC_DIR, "index.tsx"),
  output: {
    path: DIST_DIR,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(SRC_DIR, "index.html"),
      inject: "body",
    }),
  ],
  resolve: {
    alias: {
      Source: path.resolve(__dirname, "/client/src/"),
    },
    extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
  },
};
