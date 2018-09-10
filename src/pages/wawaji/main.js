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
  // 数据看板
    '/wwjdatapanel': {
      component: function(resolve) {
        getOss('/wwjdatapanel', './datapanel/Datas', resolve);
      },
      subRoutes: {
      // 收入监控区
        '/indexdata': {
          component: function(resolve) {
            getOss('/wwjdatapanel/indexdata', './datapanel/DatasIncome', resolve);
          }
        },
        '/roidata': {
          component: function(resolve) {
            getOss('/wwjdatapanel/roidata', './datapanel/DatasRoi', resolve);
          }
        },
        '/newuser': {
          component: function(resolve) {
            getOss('/wwjdatapanel/newuser', './datapanel/DatasNewuser', resolve);
          }
        },
        '/userswitch': {
          component: function(resolve) {
            getOss('/wwjdatapanel/userswitch', './datapanel/DatasUserswitch', resolve);
          }
        }
      }
    },
  // 报表中心
    '/wwjchartcenter': {
      component: function(resolve) {
        getOss('/wwjchartcenter', './chartcenter/Datas', resolve);
      },
      subRoutes: {
      // 收入监控区
        '/wwjchartlist': {
          component: function(resolve) {
            getOss('/wwjchartcenter/wwjchartlist', './chartcenter/chartList', resolve);
          }
        },
        '/wwjtableview/:id': {
          component: function(resolve) {
            getOss('/wwjchartcenter/wwjtableview', './chartcenter/tableView', resolve);
          }
        },
      // 看板
        '/wwjdashboard': {
          component: function(resolve) {
            getOss('/wwjchartcenter/wwjdashboard', './chartcenter/dashboard', resolve);
          }
        }
      }
    }
  });

  let getOssCfg = function() {
    let ossCfg = {};
    // 一级目录
    if (roleMap.includes('/wwjdatapanel')) {
      ossCfg['*'] = '/wwjdatapanel';
    }
    if (roleMap.includes('/wwjchartcenter')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/wwjchartcenter';
      }
    }
    // 二级目录 数据看板
    if (roleMap.includes('/wwjdatapanel/indexdata')) {
      ossCfg['/wwjdatapanel'] = '/wwjdatapanel/indexdata';
    }
    // 二级目录 报表中心
    if (roleMap.includes('/wwjchartcenter/wwjdashboard')) {
      ossCfg['/wwjchartcenter'] = '/wwjchartcenter/wwjdashboard';
    }
    if (roleMap.includes('/wwjchartcenter/wwjchartlist')) {
      if (!ossCfg['/wwjchartcenter']) {
        ossCfg['/wwjchartcenter'] = '/wwjchartcenter/wwjchartlist';
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
