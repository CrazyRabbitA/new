import 'iview/dist/styles/iview.css';    // 使用 CSS
import '../../styles/main.less';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator';
import Sortable from 'vue-sortable';
import App from './App';
import initComponents from './initComponents';
import filter from 'components/utils/filter.js';
import water from 'components/utils/water.js';// eslint-disable-line

import iTable from 'iview/src/components/table';
import iTree from 'iview/src/components/tree';
import {getcfg} from '../../components/utils/auth';
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueValidator);
Vue.use(Sortable);
initComponents(Vue);
Vue.component('iTable', iTable);
Vue.component('iTree', iTree);

filter.init();

const AppContainer = Vue.extend(App);
const router = new VueRouter();

// oss控制页面是否显示
getcfg().then((res) => {
  window.CFG = JSON.parse(res.body).authList.map((ele) => {
    return {
      urls: ele
    };
  });
  let roleMap = window.CFG.map((item) => {
    return item.urls;
  });
  let roleMapLen = roleMap.length;
  let getOss = function(rule, action, resolve) {
    for (let i = 0; i < roleMapLen; i++) {
      if (roleMap[i] === rule) {
        require([action], resolve);
        break;
      }
    }
  };
  router.map({
  // 数据看板
    '/quwendatapanel': {
      component: function(resolve) {
        getOss('/quwendatapanel', './datapanel/Datas', resolve);
      },
      subRoutes: {
      // 收入监控区
        '/coredata': {
          component: function(resolve) {
            getOss('/quwendatapanel/coredata', './datapanel/coredata', resolve);
          }
        },
      // 核心数据
        '/core': {
          component: function(resolve) {
            getOss('/quwendatapanel/core', './datapanel/core', resolve);
          }
        }
      }
    },
    '/quwenanalyze': {
      component: function(resolve) {
        getOss('/quwenanalyze', './analyze/Datas', resolve);
      },
      subRoutes: {
      // 漏斗图分析
        '/quwenfunnel': {
          component: function(resolve) {
            getOss('/quwenanalyze/quwenfunnel', './analyze/funnel', resolve);
          }
        }
      }
    },
  // 报表中心
    '/quwenchartcenter': {
      component: function(resolve) {
        getOss('/quwenchartcenter', './chartcenter/Datas', resolve);
      },
      subRoutes: {
      // 收入监控区
        '/quwenchartlist': {
          component: function(resolve) {
            getOss('/quwenchartcenter/quwenchartlist', './chartcenter/chartList', resolve);
          }
        },
        '/quwentableview/:id': {
          component: function(resolve) {
            getOss('/quwenchartcenter/quwentableview', './chartcenter/tableView', resolve);
          }
        },
      // 看板
        '/quwendashboard': {
          component: function(resolve) {
            getOss('/quwenchartcenter/quwendashboard', './chartcenter/dashboard', resolve);
          }
        }
      }
    }
  });

  let getOssCfg = function() {
    let ossCfg = {};
    // 一级目录
    if (roleMap.includes('/quwendatapanel')) {
      ossCfg['*'] = '/quwendatapanel';
    }
    if (roleMap.includes('/quwenanalyze')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/quwenanalyze';
      }
    }
    if (roleMap.includes('/quwenchartcenter')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/quwenchartcenter';
      }
    }
    // 二级目录 数据看板
    if (roleMap.includes('/quwendatapanel/coredata')) {
      ossCfg['/quwendatapanel'] = '/quwendatapanel/coredata';
    }
    if (roleMap.includes('/quwendatapanel/core')) {
      if (!ossCfg['/quwendatapanel']) {
        ossCfg['/quwendatapanel'] = '/quwendatapanel/core';
      }
    }
    // 二级目录 分析中心
    if (roleMap.includes('/quwenanalyze/quwenfunnel')) {
      ossCfg['/quwenanalyze'] = '/quwenanalyze/quwenfunnel';
    }
    // 二级目录
    if (roleMap.includes('/quwenchartcenter/quwendashboard')) {
      ossCfg['/quwenchartcenter'] = '/quwenchartcenter/quwendashboard';
    }
    if (roleMap.includes('/quwenchartcenter/quwenchartlist')) {
      if (!ossCfg['/quwenchartcenter']) {
        ossCfg['/quwenchartcenter'] = '/quwenchartcenter/quwenchartlist';
      }
    }
    return ossCfg;
  };
  router.redirect(getOssCfg());

  router.beforeEach(function(transition) {
    window.scrollTo(0, 0);
    transition.next();
  });
  router.start(AppContainer, '#app-container');
});
