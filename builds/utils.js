var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

exports.assetsPath = function (_path) {
  return path.posix.join(config.build.assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

exports.computeChunks = function(entryConfig) {
  entryConfig = entryConfig || []
  var chuncks = []

  for (var i = 0; i < entryConfig.length; i++) {
    chuncks.push(entryConfig[i].name);
  }
  return chuncks
}

exports.computeEntry = function (entry) {
  entry = entry || []
  var result = {}

  for (var i = 0; i < entry.length; i++) {
    var item = entry[i]
    var name = item.name
    result[name] = './src/pages/' + name + '/main.js'
  }
  return result
}

exports.computeHtmlWebpackPlugin = function (entry) {
  entry = entry || []
  var result = []

  for (var i = 0; i < entry.length; i++) {
    var item = entry[i]
    var name = item.name
    var template = item.template
    result.push(
      new HtmlWebpackPlugin({
        filename: template,
        template: template,
        inject: true,
        chunks: [name]
      })
    )
  }

  return result
}
