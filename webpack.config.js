const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";
const target = process.env.NODE_ENV === "production" ? "browserslist" : "web";
module.exports = {
  mode: mode,

  entry: {
    app: "./src/js/app.js",
  },

  output: {
    filename:
      mode === "production"
        ? "js/[name].[contenthash].chunk.js"
        : "js/[name].js",
    path: path.resolve(__dirname, "./build"),
    clean: true,
    assetModuleFilename: "assets/[contenthash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },

      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
        ],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff2|eot|woff|ttf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
    ],
  },

  devtool: mode == "production" ? false : "source-map",

  devServer: {
    contentBase: "./build",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/favicon.png",
    }),

    new MiniCssExtractPlugin({
      filename:
        mode === "production"
          ? "css/[name].[contenthash].chunk.css"
          : "css/[name].css",
    }),
  ],
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],

    moduleIds: "deterministic",
    splitChunks: {
      chunks: "all",

      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        styles: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  target: target,
};
