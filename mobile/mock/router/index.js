const path = require('path');
const fs = require('fs');
// const url = require('url');
const router = require('express').Router();
const httpProxyMiddleware = require('http-proxy-middleware');
// mock
const express = require('express');
const app = express();
const http = require('http');


// const config = require('../../config');
// const upload = require('../server/upload');

const Router = function(app) {
  router.get('/', function(req, res) {
    // 根路由
    res.render('index.html');
  });
  router.get(/html/, function(req, res) {
    // html路由
    res.render(req.path.replace('/', ''));
  });

  /**
   * npm命令中带有process.env.proxy参数,则开启代理到指定服务器
   */
  if (process.env.proxy) {
    const filter = function(pathname, req) {
      return !(pathname.match('html') || pathname === '/');
    };
    app.use(httpProxyMiddleware(filter, {
      target: 'http://' + process.env.proxy + ':8000',
      changeOrigin: false
    }));
  } else {
    router.all('*', (req, res) => {
      // mock路由，优先查找JS，其次是JSON，找不到返回默认值
      const JSFilePath = path.join(__dirname, '../server/', `${req.path}.js`);
      const JSONFilePath = path.join(__dirname, '../server/', `${req.path}.json`);
      if (fs.existsSync(JSFilePath)) {
        const file = fs.readFileSync(JSFilePath);
        res.json(JSON.parse(file));
      } else if (fs.existsSync(JSONFilePath)) {
        const file = fs.readFileSync(JSONFilePath);
        res.json(JSON.parse(file));
      } else {
        res.json({
          code: '0',
          desc: '成功',
          data: '0',
          success: true
        });
      }
      console.log(req.path);
    });
  }
  app.use(router);
  console.log('server start .... ');
};

Router(app);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
server.listen(3000);