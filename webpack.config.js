// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    target: 'electron-main',
    context: __dirname,
    entry: './src/main/main.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{
            loader: 'ts-loader',
            options: {configFile: __dirname + '/tsconfig.json'},
          }]
        },
      ],
    },
    resolve: {
      modules: [__dirname, 'node_modules'],
      extensions: ['.ts', '.js', '.json'],
      plugins: [
        new TsconfigPathsPlugin({configFile: __dirname + '/tsconfig.json'}),
      ],
    },
    output: {
      path: __dirname + '/out/src/main',
      filename: 'main.bundled.js',
    },
  },
  {
    mode: 'development',
    target: 'electron-preload',
    context: __dirname,
    entry: './src/renderer/preload.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{
            loader: 'ts-loader',
            options: {configFile: __dirname + '/tsconfig.json'},
          }]
        },
      ],
    },
    resolve: {
      modules: [__dirname, 'node_modules'],
      extensions: ['.ts', '.js', '.json'],
      plugins: [
        new TsconfigPathsPlugin({configFile: __dirname + '/tsconfig.json'}),
      ],
    },
    output: {
      path: __dirname + '/out/src/renderer',
      filename: 'preload.bundled.js',
    },
  },
  {
    mode: 'development',
    target: 'electron-renderer',
    context: __dirname,
    entry: './src/renderer/renderer.ts',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: /src/,
          use: [{
            loader: 'ts-loader',
            options: {configFile: __dirname + '/tsconfig.json'},
          }]
        },
        {
          test: /\.css$/,
          use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
        },
      ],
    },
    resolve: {
      modules: [__dirname, 'node_modules'],
      extensions: ['.ts', '.js', '.json'],
      plugins: [
        new TsconfigPathsPlugin({configFile: __dirname + '/tsconfig.json'}),
      ],
    },
    output: {
      path: __dirname + '/out/src/renderer',
      filename: 'renderer.bundled.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/renderer/index.html',
        filename: 'index.html',
        // inject: 'body',
      }),
      new HtmlWebpackPlugin({
        template: 'src/renderer/splash.html',
        filename: 'splash.html',
        // inject: 'body',
      }),
    ],
  },
];
