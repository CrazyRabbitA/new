var path = require('path')
var os = require('os')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HappyPack = require('happypack')
var entryConfig = require('../config/entry')
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
var projectRoot = path.resolve(__dirname, '../src')

var webpackConfig = merge(baseWebpackConfig, {
  profile: true,
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: path.resolve(__dirname, '../node_modules', 'happypack/loader') + '?id=eslint',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: path.resolve(__dirname, '../node_modules', 'happypack/loader') + '?id=eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: path.resolve(__dirname, '../node_modules', 'happypack/loader') + '?id=vue'
      },
      { test: /iview.src.*?js$/, loader: 'babel' },
      {
        test: /\.js$/,
        loader: path.resolve(__dirname, '../node_modules', 'happypack/loader') + '?id=babel',
        include: projectRoot,
        exclude: function(path) {
          // 路径中含有 node_modules 的就不去解析。
          var isNpmModule = !!path.match(/node_modules/);
          return isNpmModule;
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: '1024',
          name: '/complete/styles/images/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: '1024',
          name: '/complete/styles/fonts/[name]_[hash:8].[ext]'
        }
      }
    ].concat(utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true }))
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: 'complete/scripts/[name].js',
    chunkFilename: 'complete/scripts/[name]_[chunkhash:8].js'
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dist/manifest.json')
    }),
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // 公共文件提取
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons', // 注意不要.js后缀
      chunks: utils.computeChunks(entryConfig, ''),
      minChunks: function(module) {
        if (module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin('complete/styles/[name].css'),
    new HappyPack({
      id: 'vue',
      loaders: ['vue'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
    new HappyPack({
      id: 'babel',
      loaders: ['babel'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
    new HappyPack({
      id: 'eslint',
      loaders: ['eslint'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig
