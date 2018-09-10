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
import {getcfg} from '../../components/utils/auth';
import iTable from 'iview/src/components/table';
import iTree from 'iview/src/components/tree';

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
  }); ;
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
  // 报表中心
    '/youfenchartcenter': {
      component: function(resolve) {
        getOss('/youfenchartcenter', './chartcenter/Datas', resolve);
      },
      subRoutes: {
      // 收入监控区
        '/youfenchartlist': {
          component: function(resolve) {
            getOss('/youfenchartcenter/youfenchartlist', './chartcenter/chartList', resolve);
          }
        },
        '/youfentableview/:id': {
          component: function(resolve) {
            getOss('/youfenchartcenter/youfentableview', './chartcenter/tableView', resolve);
          }
        },
      // 看板
        '/youfendashboard': {
          component: function(resolve) {
            getOss('/youfenchartcenter/youfendashboard', './chartcenter/dashboard', resolve);
          }
        }
      }
    },
  // 公众号维度
    '/youfenpublicaccount': {
      component: function(resolve) {
        getOss('/youfenpublicaccount', './publicaccount/Datas', resolve);
      },
      subRoutes: {
        '/dimensionlist': {
          component: function(resolve) {
            getOss('/youfenpublicaccount/dimensionlist', './publicaccount/dimensionList', resolve);
          }
        }
      }
    }
  });
  let getOssCfg = function() {
    let ossCfg = {};
  // 一级目录
    if (roleMap.includes('/youfenchartcenter')) {
      ossCfg['*'] = '/youfenchartcenter';
    }
    if (roleMap.includes('/youfenpublicaccount')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/youfenpublicaccount';
      }
    }
  // 二级目录 数据看板
    if (roleMap.includes('/youfenchartcenter/youfendashboard')) {
      ossCfg['/youfenchartcenter'] = '/youfenchartcenter/youfendashboard';
    }
    if (roleMap.includes('/youfenchartcenter/youfenchartlist')) {
      if (!ossCfg['/youfenchartcenter']) {
        ossCfg['/youfenchartcenter'] = '/youfenchartcenter/youfenchartlist';
      }
    }
    if (roleMap.includes('/youfenpublicaccount/dimensionlist')) {
      ossCfg['/youfenpublicaccount'] = '/youfenpublicaccount/dimensionlist';
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
