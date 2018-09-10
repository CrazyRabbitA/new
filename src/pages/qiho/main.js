import 'iview/dist/styles/iview.css';    // 使用 CSS
import '../../styles/main.less';
import './qiho.less';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator';
import Sortable from 'vue-sortable';
import App from './App';
import initComponents from './initComponents';
import filter from 'components/utils/filter.js';
import water from 'components/utils/water.js';// eslint-disable-line
import iTree from 'iview/src/components/tree';
import {getcfg} from '../../components/utils/auth';
import iTable from 'iview/src/components/table';
Vue.component('iTree', iTree);

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
  // 奇货
    '/qiho': {
      component: function(resolve) {
        getOss('/qiho', './qiandtui/Qiho', resolve);
      },
      subRoutes: {
      // 推啊&奇货
        '/tuia': {
          component: function(resolve) {
            getOss('/qiho/tuia', './qiandtui/Tuia', resolve);
          },
          subRoutes: {
          // 概况
            '/overall': {
              component: function(resolve) {
                require(['./qiandtui/TuiaOverall'], resolve);
              }
            },
          // 商品
            '/goods': {
              component: function(resolve) {
                require(['./qiandtui/TuiaGoods'], resolve);
              }
            },
          // 广告计划
            '/adplan': {
              component: function(resolve) {
                require(['./qiandtui/TuiaAdplan'], resolve);
              }
            },
          // 广告计划
            '/adplan/:id/:orderDate': {
              component: function(resolve) {
                require(['./qiandtui/TuiaAdplan'], resolve);
              }
            },
          // 媒体
            '/media': {
              component: function(resolve) {
                require(['./qiandtui/TuiaMedia'], resolve);
              }
            },
          // 媒体
            '/media/:id/:orderDate': {
              component: function(resolve) {
                require(['./qiandtui/TuiaMedia'], resolve);
              }
            },
          // 出券顺序
            '/coupon': {
              component: function(resolve) {
                require(['./qiandtui/TuiaCoupon'], resolve);
              }
            },
          // 出券顺序
            '/coupon/:id/:orderDate': {
              component: function(resolve) {
                require(['./qiandtui/TuiaCoupon'], resolve);
              }
            },
          // 商品趋势
            '/trend': {
              component: function(resolve) {
                require(['./qiandtui/TuiaTrend'], resolve);
              }
            },
          // 商品趋势
            '/trend/:id/:orderDate': {
              component: function(resolve) {
                require(['./qiandtui/TuiaTrend'], resolve);
              }
            },
          // 商品小时数据
            '/goodstime': {
              component: function(resolve) {
                require(['./qiandtui/TuiaGoodsTime'], resolve);
              }
            },
          // 商品小时数据
            '/goodstime/:id/:orderDate': {
              component: function(resolve) {
                require(['./qiandtui/TuiaGoodsTime'], resolve);
              }
            },
          // 广告小时数据
            '/advtime': {
              component: function(resolve) {
                require(['./qiandtui/TuiaAdvTime'], resolve);
              }
            },
          // 广告小时数据
            '/advtime/:itemId/:advertId/:orderDate': {
              component: function(resolve) {
                require(['./qiandtui/TuiaAdvTime'], resolve);
              }
            }
          }
        },
      // 投放定制化数据
        '/put': {
          component: function(resolve) {
            getOss('/qiho/put', './qiandtui/Put', resolve);
          },
          subRoutes: {
            '/customize': {
              component: function(resolve) {
                require(['./qiandtui/Customize'], resolve);
              }
            }
          }
        },
      // 实时数据平台
        '/show': {
          component: function(resolve) {
            getOss('/qiho/show', './qiandtui/Show', resolve);
          },
          subRoutes: {
            '/realtimedata': {
              component: function(resolve) {
                require(['./qiandtui/Realtimedata'], resolve);
              }
            },
            '/accumulatedata': {
              component: function(resolve) {
                require(['./qiandtui/Accumulatedata'], resolve);
              }
            },
            '/timeslotdata': {
              component: function(resolve) {
                require(['./qiandtui/Timeslotdata'], resolve);
              }
            }
          }
        },
      // 人员管理
        '/member': {
          component: function(resolve) {
            getOss('/qiho/member', './qiandtui/MemberManage', resolve);
          },
          subRoutes: {
            'AE': {
              component: function(resolve) {
                require(['./qiandtui/AEManage'], resolve);
              }
            },
            'AEGroup': {
              component: function(resolve) {
                require(['./qiandtui/AEGroupManage'], resolve);
              }
            },
            'ADAndAE': {
              component: function(resolve) {
                require(['./qiandtui/ADAndAEManage'], resolve);
              }
            }
          }
        }
      }
    },
  // ABTest
    '/abtest': {
      component: function(resolve) {
        getOss('/abtest/reports', './abtest/Datas', resolve);
      },
      subRoutes: {
        '/reports': {
          component: function(resolve) {
            getOss('/abtest/reports', './abtest/Reports', resolve);
          },
          subRoutes: {
          // 价格测试报表
            '/sku': {
              component: function(resolve) {
                require(['./abtest/SkuTest'], resolve);
              }
            }
          }
        }
      }
    },
   // 报表中心
    '/qihochartcenter': {
      component: function(resolve) {
        getOss('/qihochartcenter', './chartcenter/Datas', resolve);
      },
      subRoutes: {
      // 收入监控区
        '/qihochartlist': {
          component: function(resolve) {
            getOss('/qihochartcenter/qihochartlist', './chartcenter/chartList', resolve);
          }
        },
        '/qihotableview/:id': {
          component: function(resolve) {
            getOss('/qihochartcenter/qihotableview', './chartcenter/tableView', resolve);
          }
        },
      // 看板
        '/qihodashboard': {
          component: function(resolve) {
            getOss('/qihochartcenter/qihodashboard', './chartcenter/dashboard', resolve);
          }
        }
      }
    },
  // 投放监控
    '/alarm': {
      component: function(resolve) {
        getOss('/alarm/monitor', './alarm/Alarm', resolve);
      },
      subRoutes: {
        '/monitor': {
          component: function(resolve) {
            getOss('/alarm/monitor', './alarm/Monitor', resolve);
          },
          subRoutes: {
          // 报警配置列表
            '/configlist': {
              component: function(resolve) {
                require(['./alarm/ConfigList'], resolve);
              }
            },
          // cpa设置
            '/cpa': {
              component: function(resolve) {
                require(['./alarm/CPAConfig'], resolve);
              }
            },
            '/cpa/:advertId': {
              component: function(resolve) {
                require(['./alarm/CPAConfig'], resolve);
              }
            },
          // 消耗设置
            '/consume': {
              component: function(resolve) {
                require(['./alarm/ConsumeConfig'], resolve);
              }
            },
            '/consume/:advertId': {
              component: function(resolve) {
                require(['./alarm/ConsumeConfig'], resolve);
              }
            },
          // 点击率设置
            '/clickRate': {
              component: function(resolve) {
                require(['./alarm/ClickRateConfig'], resolve);
              }
            },
            '/clickRate/:advertId': {
              component: function(resolve) {
                require(['./alarm/ClickRateConfig'], resolve);
              }
            },
          // 报警列表
            '/alarmlist': {
              component: function(resolve) {
                require(['./alarm/AlarmList'], resolve);
              }
            }
          }
        }
      }
    }
  });

  let getOssCfg = function() {
    let ossCfg = {
      '/qiho/tuia': '/qiho/tuia/overall',
      '/qiho/put': '/qiho/put/customize',
      '/qiho/show': '/qiho/show/realtimedata',
      '/qiho/member': '/qiho/member/AE',
      '/abtest/reports': '/abtest/reports/sku',
      '/alarm/monitor': '/alarm/monitor/configlist'
    };
  // 一级目录
    if (roleMap.includes('/qiho')) {
      ossCfg['*'] = '/qiho';
    }
    if (roleMap.includes('/abtest')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/abtest';
      }
    }
    if (roleMap.includes('/qihochartcenter')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/qihochartcenter';
      }
    }
    if (roleMap.includes('/alarm')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/alarm';
      }
    }
  // 奇货 二级目录
    if (roleMap.includes('/qiho/tuia')) {
      ossCfg['/qiho'] = '/qiho/tuia';
    }
    if (roleMap.includes('/qiho/put')) {
      if (!ossCfg['/qiho']) {
        ossCfg['/qiho'] = '/qiho/put';
      }
    }
    if (roleMap.includes('/qiho/show')) {
      if (!ossCfg['/qiho']) {
        ossCfg['/qiho'] = '/qiho/show';
      }
    }
    if (roleMap.includes('/qiho/member')) {
      if (!ossCfg['/qiho']) {
        ossCfg['/qiho'] = '/qiho/member';
      }
    }
  // ABTest 二级目录
    if (roleMap.includes('/abtest/reports')) {
      ossCfg['/abtest'] = '/abtest/reports';
    }

  // 报表中心 二级目录
    if (roleMap.includes('/qihochartcenter/qihodashboard')) {
      ossCfg['/qihochartcenter'] = '/qihochartcenter/qihodashboard';
    }
    if (roleMap.includes('/qihochartcenter/qihochartlist')) {
      if (!ossCfg['/qihochartcenter']) {
        ossCfg['/qihochartcenter'] = '/qihochartcenter/qihochartlist';
      }
    }
    if (roleMap.includes('/qihochartcenter/qihotableview')) {
      if (!ossCfg['/qihochartcenter']) {
        ossCfg['/qihochartcenter'] = '/qihochartcenter/qihotableview';
      }
    }

  // 投放监控 二级目录
    if (roleMap.includes('/alarm/monitor')) {
      ossCfg['/alarm'] = '/alarm/monitor';
    }
    return ossCfg;
  };
  router.redirect(getOssCfg());

  router.beforeEach(function(transition) {
    window.onresize = function() {};
    window.scrollTo(0, 0);
    transition.next();
  });

  router.start(AppContainer, '#app-container');
});
