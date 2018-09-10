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

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueValidator);
Vue.use(Sortable);
initComponents(Vue);
Vue.component('iTable', iTable);

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
    '/chart': {
      component: function(resolve) {
        getOss('/chart', './datapanel/Datas', resolve);
      },
      subRoutes: {
        '/list': {
          component: function(resolve) {
            getOss('/chart/list', './datapanel/chartList', resolve);
          }
        },
      // 添加报表
        '/add': {
          component: function(resolve) {
            getOss('/chart/add', './datapanel/add', resolve);
          }
        },
      // 编辑报表
        '/add/:id': {
          name: 'edit',
          component: function(resolve) {
            getOss('/chart/add', './datapanel/add', resolve);
          }
        },
        '/tableview/:id': {
          name: 'table',
          component: function(resolve) {
            getOss('/chart/tableview', './datapanel/tableView', resolve);
          }
        },
      // 预览
        '/tableview/:type/:id': {
          name: 'table',
          component: function(resolve) {
            getOss('/chart/tableview', './datapanel/tableView', resolve);
          }
        },
      // 用户管理
        '/usermange': {
          name: 'table',
          component: function(resolve) {
            getOss('/chart/usermange', './datapanel/userMange', resolve);
          }
        },
      // 权限管理
        '/authormange': {
          name: 'table',
          component: function(resolve) {
            getOss('/chart/authormange', './datapanel/authorMange', resolve);
          }
        }
      }
    },
  // 配置数据源
    '/database': {
      component: function(resolve) {
        getOss('/database', './database/Datas', resolve);
      },
      subRoutes: {
        '/add': {
          component: function(resolve) {
            getOss('/database/add', './database/cfgData', resolve);
          }
        }
      }
    }
  });

  let getOssCfg = function() {
    let ossCfg = {};
  // 一级目录
    if (roleMap.includes('/chart')) {
      ossCfg['*'] = '/chart';
    }
    if (roleMap.includes('/database')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/database';
      }
    }
  // 二级目录 数据看板
    if (roleMap.includes('/chart/list')) {
      ossCfg['/chart'] = '/chart/list';
    }
    if (roleMap.includes('/chart/add')) {
      if (!ossCfg['/chart']) {
        ossCfg['/chart'] = '/chart/add';
      }
    }
    if (roleMap.includes('/chart/usermange')) {
      if (!ossCfg['/chart']) {
        ossCfg['/chart'] = '/chart/usermange';
      }
    }
    if (roleMap.includes('/chart/authormange')) {
      if (!ossCfg['/chart']) {
        ossCfg['/chart'] = '/chart/authormange';
      }
    }

  // 二级目录 数据源
    if (roleMap.includes('/database/add')) {
      ossCfg['/database'] = '/database/add';
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
