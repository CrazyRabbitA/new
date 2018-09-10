const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'vue',
      'vue-router',
      'vue-resource',
      'vue-validator',
      'vue-sortable',
      'echarts'
    ]
  },
  output: {
    path: path.join(__dirname, '../dist/complete/scripts'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: './dist/manifest.json',
      name: '[name]',
      context: __dirname,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
