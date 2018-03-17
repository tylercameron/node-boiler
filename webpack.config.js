const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// This is our JavaScript rule that specifies what to do with .js files
const javascript = {
  test: /\.(js)$/,
  use: [{
    loader: 'babel-loader',
    options: { presets: ['env'] }
  }],
};

/*
  This is our postCSS loader which gets fed into the next loader. I'm setting it up in it's own variable because its a didgeridog
*/

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
  }
};

// this is our sass/css loader. It handles files that are require('something.scss')
const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract(
    // {
  //   use: [
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         sourceMap: true
  //       }
  //     },
  //     {
  //       loader: 'postcss',
  //       options: {
  //         sourceMap: false
  //       }
  //     },
  //     {
  //       loader: 'sass-loader',
  //       options: {
  //         sourceMap: true
  //       }
  //     }
  //   ]
  // })
    ['css-loader?sourceMap', 'sass-loader?sourceMap'])
};

const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
  compress: { warnings: false }
});

const config = {
  entry: {
    App: './public/javascripts/pub-up.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [javascript, styles]
  },
  // uncomment if you want to uglify
  // plugins: [uglify],
  plugins: [
    new ExtractTextPlugin('style.css'),
  ]
};
// webpack is cranky about some packages using a soon to be deprecated API. shhhhhhh
process.noDeprecation = true;

module.exports = config;
