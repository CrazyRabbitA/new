var fs = require('fs')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var proxyMiddleware = require('http-proxy-middleware')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// mock路由
var routeConfig = require('../routes/index');
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// serve webpack bundle output
app.use(devMiddleware)
// hot update
app.use(webpackHotMiddleware(compiler))

// 路由
function redirectPage(page) {
  return function(req, res) {
    res.redirect('/html/' + page + '.html');
  }
}
app.get('/', redirectPage('tuia'));
app.get('/duiba', redirectPage('duiba'));
app.get('/youfen', redirectPage('youfen'));
app.get('/qiho', redirectPage('qiho'));
app.get('/quwen', redirectPage('quwen'));
app.get('/chartdev', redirectPage('chart'));
app.get('/tuia', redirectPage('tuia'));

function readJson(filePath) {
  return function(req, res) {
    var url = 'mock' + filePath;
    fs.readFile(url, function (err, data) {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  };
}
for (var i in routeConfig) {
  var page = routeConfig[i];
  for (var j in page) {
    var pageRoutes = page[j];
    if (j === 'get') {
      for (var k in pageRoutes) {
        app.get(k, readJson(pageRoutes[k]));
      }
    } else if (j === 'post') {
      for (var k in pageRoutes) {
        app.post(k, readJson(pageRoutes[k]));
      }
    }
  }
}

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
