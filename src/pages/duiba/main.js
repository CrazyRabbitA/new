import 'iview/dist/styles/iview.css'; // 使用 CSS
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
    '/duibadatapanel': {
      component: function(resolve) {
        getOss('/duibadatapanel', './datapanel/Datas', resolve);
      },
      subRoutes: {
      // 关键数据监控
        'datasIncome': {
          component: function(resolve) {
            getOss('/duibadatapanel/datasIncome', './datapanel/DatasIncome', resolve);
          }
        },
      // 大盘数据
        'marketdata': {
          component: function(resolve) {
            getOss('/duibadatapanel/marketdata', './datapanel/MarketData', resolve);
          }
        }
      }
    },
  // 实时监控
    '/duibamonitor': {
      component: function(resolve) {
        getOss('/duibamonitor', './monitor/Datas', resolve);
      },
      subRoutes: {
      // 大盘数据
        '/market': {
          component: function(resolve) {
            getOss('/duibamonitor/market', './monitor/Market', resolve);
          }
        },
      // 主会场
        '/resources': {
          component: function(resolve) {
            getOss('/duibamonitor/resources', './monitor/Resources', resolve);
          }
        },
      // 首页资源位
        '/hotspot': {
          component: function(resolve) {
            getOss('/duibamonitor/hotspot', './monitor/Hotspot', resolve);
          }
        },
      // 独立活动
        '/activity': {
          component: function(resolve) {
            getOss('/duibamonitor/activity', './monitor/Activity', resolve);
          }
        },
      // 独立活动区域分布
        '/activity/area/:appId/:title/:curDate': {
          component: function(resolve) {
            getOss('/duibamonitor/activity/area', './monitor/components/activityArea', resolve);
          }
        }
      }
    },
   // 报表中心
    '/duibachartcenter': {
      component: function(resolve) {
        getOss('/duibachartcenter', './chartcenter/Datas', resolve);
      },
      subRoutes: {
      // 兑吧报表中心展示
        '/duibachartlist': {
          component: function(resolve) {
            getOss('/duibachartcenter/duibachartlist', './chartcenter/chartList', resolve);
          }
        },
      // 兑吧报表展示
        '/duibatableview/:id': {
          component: function(resolve) {
            getOss('/duibachartcenter/duibatableview', './chartcenter/tableView', resolve);
          }
        },
       // 看板
        '/duibadashboard': {
          component: function(resolve) {
            getOss('/duibachartcenter/duibadashboard', './chartcenter/dashboard', resolve);
          }
        }
      }
    }
  });

  let getOssCfg = function() {
    let ossCfg = {};
  // 一级目录
    if (roleMap.includes('/duibadatapanel')) {
      ossCfg['*'] = '/duibadatapanel';
    }
    if (roleMap.includes('/duibamonitor')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/duibamonitor';
      }
    }
    if (roleMap.includes('/duibachartcenter')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/duibachartcenter';
      }
    }
    // 二级目录 数据看板
    if (roleMap.includes('/duibadatapanel/datasIncome')) {
      ossCfg['/duibadatapanel'] = '/duibadatapanel/datasIncome';
    }
    if (roleMap.includes('/duibadatapanel/marketdata')) {
      if (!ossCfg['/duibadatapanel']) {
        ossCfg['/duibadatapanel'] = '/duibadatapanel/marketdata';
      }
    }
    // 二级目录 实时监控
    if (roleMap.includes('/duibamonitor/market')) {
      ossCfg['/duibamonitor'] = '/duibamonitor/market';
    }
    if (roleMap.includes('/duibamonitor/resources')) {
      if (!ossCfg['/duibamonitor']) {
        ossCfg['/duibamonitor'] = '/duibamonitor/resources';
      }
    }
    if (roleMap.includes('/duibamonitor/hotspot')) {
      if (!ossCfg['/duibamonitor']) {
        ossCfg['/duibamonitor'] = '/duibamonitor/hotspot';
      }
    }
    if (roleMap.includes('/duibamonitor/activity')) {
      if (!ossCfg['/duibamonitor']) {
        ossCfg['/duibamonitor'] = '/duibamonitor/activity';
      }
    }
    // 二级目录 报表中心
    if (roleMap.includes('/duibachartcenter/duibadashboard')) {
      ossCfg['/duibachartcenter'] = '/duibachartcenter/duibadashboard';
    }
    if (roleMap.includes('/duibachartcenter/duibachartlist')) {
      if (!ossCfg['/duibachartcenter']) {
        ossCfg['/duibachartcenter'] = '/duibachartcenter/duibachartlist';
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
