import 'iview/dist/styles/iview.css' // 使用 CSS
import '../../styles/main.less'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueValidator from 'vue-validator'
import Sortable from 'vue-sortable'
import App from './App'
import initComponents from './initComponents'
import filter from 'components/utils/filter.js'
import water from 'components/utils/water.js' // eslint-disable-line
import iTable from 'iview/src/components/table'
import iTree from 'iview/src/components/tree'
import { getcfg } from '../../components/utils/auth'
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueValidator)
Vue.use(Sortable)

initComponents(Vue)
Vue.component('iTable', iTable)
Vue.component('iTree', iTree)
filter.init()
const AppContainer = Vue.extend(App)
const router = new VueRouter()
// oss控制页面是否显示
getcfg().then(res => {
  window.CFG = JSON.parse(res.body).authList.map(ele => {
    return {
      urls: ele
    }
  })
  let roleMap = window.CFG.map(item => {
    return item.urls
  })
  let roleMapLen = roleMap.length
  let getOss = function (rule, action, resolve) {
    for (let i = 0; i < roleMapLen; i++) {
      if (roleMap[i] === rule) {
        require([action], resolve)
        break
      }
    }
  }
  router.map({
    // 数据看板
    '/datapanel': {
      component: function (resolve) {
        getOss('/datapanel', './datapanel/Datas', resolve)
      },
      subRoutes: {
        // 收入监控区
        '/income': {
          component: function (resolve) {
            getOss('/datapanel/income', './datapanel/DatasIncome', resolve)
          }
        },
        '/bigpanel': {
          component: function (resolve) {
            getOss('/datapanel/bigpanel', './datapanel/bigpanel', resolve)
          }
        },
        '/advertdata': {
          component: function (resolve) {
            getOss('/datapanel/advertdata', './datapanel/advertdata', resolve)
          }
        },
        '/advertKaData': {
          component: function (resolve) {
            getOss(
              '/datapanel/advertKaData',
              './datapanel/advertKaData',
              resolve
            )
          }
        },
        '/newAdd': {
          component: function (resolve) {
            getOss('/datapanel/newAdd', './datapanel/newAdd', resolve)
          }
        }
      }
    },
    '/monitor': {
      component: function (resolve) {
        getOss('/monitor', './monitor/Datas', resolve)
      },
      subRoutes: {
        '/': {
          component: function (resolve) {
            getOss(
              '/monitor/mediadimension',
              './monitor/DatasMediaDimension',
              resolve
            )
          }
        },
        // 5维度实时数据
        '/mediadimension': {
          component: function (resolve) {
            getOss(
              '/monitor/mediadimension',
              './monitor/DatasMediaDimension',
              resolve
            )
          }
        },
        '/mediadimension/:id/': {
          component: function (resolve) {
            getOss(
              '/monitor/mediadimension',
              './monitor/DatasMediaDimension',
              resolve
            )
          }
        },
        '/mediadimension/:id/:data': {
          component: function (resolve) {
            getOss(
              '/monitor/mediadimension',
              './monitor/DatasMediaDimension',
              resolve
            )
          }
        },
        '/activitydimension': {
          component: function (resolve) {
            getOss(
              '/monitor/activitydimension',
              './monitor/DatasActivityDimension',
              resolve
            )
          }
        },
        '/activitydimension/:id': {
          component: function (resolve) {
            getOss(
              '/monitor/activitydimension',
              './monitor/DatasActivityDimension',
              resolve
            )
          }
        },
        '/activitydimension/:id/:data': {
          component: function (resolve) {
            getOss(
              '/monitor/activitydimension',
              './monitor/DatasActivityDimension',
              resolve
            )
          }
        },
        '/adslotDimension': {
          component: function (resolve) {
            getOss(
              '/monitor/adslotDimension',
              './monitor/DatasAdslotDimension',
              resolve
            )
          }
        },
        '/adslotDimension/:id': {
          component: function (resolve) {
            getOss(
              '/monitor/adslotDimension',
              './monitor/DatasAdslotDimension',
              resolve
            )
          }
        },
        '/adslotDimension/:id/:data': {
          component: function (resolve) {
            getOss(
              '/monitor/adslotDimension',
              './monitor/DatasAdslotDimension',
              resolve
            )
          }
        },
        '/activityAdslotDimension': {
          component: function (resolve) {
            getOss(
              '/monitor/activityAdslotDimension',
              './monitor/DatasActivityAdslotDimension',
              resolve
            )
          }
        },
        '/activityAdslotDimension/:act/:app/:slot/:type': {
          component: function (resolve) {
            getOss(
              '/monitor/activityAdslotDimension',
              './monitor/DatasActivityAdslotDimension',
              resolve
            )
          }
        },
        '/activityMediaDimension': {
          component: function (resolve) {
            getOss(
              '/monitor/activityMediaDimension',
              './monitor/DatasActivityMediaDimension',
              resolve
            )
          }
        },
        '/activityMediaDimension/:act/:app/:slot/:type': {
          component: function (resolve) {
            getOss(
              '/monitor/activityMediaDimension',
              './monitor/DatasActivityMediaDimension',
              resolve
            )
          }
        },
        '/advcost': {
          component: function (resolve) {
            getOss('/monitor/advcost', './monitor/DatasAdvCost', resolve)
          }
        },
        '/advRealTime': {
          component: function (resolve) {
            getOss(
              '/monitor/advRealTime',
              './monitor/DatasAdvRealTime',
              resolve
            )
          }
        },
        '/advRealTime/:id': {
          component: function (resolve) {
            getOss(
              '/monitor/advRealTime',
              './monitor/DatasAdvRealTime',
              resolve
            )
          }
        }
      }
    },
    '/analyze': {
      component: function (resolve) {
        getOss('/analyze', './analyze/Datas', resolve)
      },
      subRoutes: {
        // 广告效果分析
        '/advEffect': {
          component: function (resolve) {
            getOss('/analyze/advEffect', './analyze/AdvEffect', resolve)
          }
        },
        // 媒体离线数据
        '/mediaoffline': {
          component: function (resolve) {
            getOss('/analyze/mediaoffline', './analyze/MediaOffline', resolve)
          }
        },
        '/mediaoffline/:appid/:slotid': {
          component: function (resolve) {
            getOss('/analyze/mediaoffline', './analyze/MediaOffline', resolve)
          }
        },
        // 媒体离线数据 - 消耗波动
        '/mediaoffline/:appid/:slotid/:starttime/:endtime': {
          component: function (resolve) {
            getOss('/analyze/mediaoffline', './analyze/MediaOffline', resolve)
          }
        },
        // 广告流量统计
        advFlow: {
          component: function (resolve) {
            getOss('/analyze/advFlow', './analyze/AdvFlow', resolve)
          }
        },
        // 热力图分析
        '/HeatMap': {
          component: function (resolve) {
            getOss('/analyze/HeatMap', './analyze/HeatMap', resolve)
          }
        },
        // 用户路径分析
        '/roadMap': {
          component: function (resolve) {
            getOss('/analyze/roadMap', './analyze/RoadMap', resolve)
          }
        },
        // 消耗波动分析
        '/consumefluctuate': {
          component: function (resolve) {
            getOss(
              '/analyze/consumefluctuate',
              './analyze/Consumefluctuate',
              resolve
            )
          }
        },
        // 消耗波动分析
        '/consumefluctuate/:dimension/:rule': {
          component: function (resolve) {
            getOss(
              '/analyze/consumefluctuate',
              './analyze/Consumefluctuate',
              resolve
            )
          }
        },
        // 消耗波动分析
        '/consumefluctuate/:dimension/:rule/:id': {
          component: function (resolve) {
            getOss(
              '/analyze/consumefluctuate',
              './analyze/Consumefluctuate',
              resolve
            )
          }
        },
        // 消耗波动分析
        '/consumefluctuate/:dimension': {
          component: function (resolve) {
            getOss(
              '/analyze/consumefluctuate',
              './analyze/Consumefluctuate',
              resolve
            )
          }
        },
        // 航站楼
        '/airport': {
          component: function (resolve) {
            getOss('/analyze/airport', './analyze/Airport', resolve)
          }
        }
      }
    },
    '/anticheat': {
      component: function (resolve) {
        getOss('/anticheat', './anticheat/Datas', resolve)
      },
      subRoutes: {
        '/': {
          component: function (resolve) {
            getOss('/anticheat/cheat', './anticheat/DatasCheat', resolve)
          }
        },
        // 防作弊数据
        '/cheat': {
          component: function (resolve) {
            getOss('/anticheat/cheat', './anticheat/DatasCheat', resolve)
          }
        },
        // 防作弊数据
        '/cheat/:id/:type': {
          component: function (resolve) {
            getOss('/anticheat/cheat', './anticheat/DatasCheat', resolve)
          }
        },
        '/cheat/:id/:start/:end/:type': {
          component: function (resolve) {
            getOss('/anticheat/cheat', './anticheat/DatasCheat', resolve)
          }
        },
        // 防作弊监控
        '/cheatmonitor': {
          component: function (resolve) {
            getOss(
              '/anticheat/cheatmonitor',
              './anticheat/DatasCheatMonitor',
              resolve
            )
          }
        },
        // 域名管理
        '/domain': {
          component: function (resolve) {
            getOss('/anticheat/domain', './anticheat/DatasDomain', resolve)
          }
        }
      }
    },

    // 报表中心
    '/tuiachartcenter': {
      component: function (resolve) {
        getOss('/tuiachartcenter', './chartcenter/Datas', resolve)
      },
      subRoutes: {
        // 报表列表
        '/tuiachartlist': {
          component: function (resolve) {
            getOss(
              '/tuiachartcenter/tuiachartlist',
              './chartcenter/chartList',
              resolve
            )
          }
        },
        '/tuiatableview/:id': {
          component: function (resolve) {
            getOss(
              '/tuiachartcenter/tuiatableview',
              './chartcenter/tableView',
              resolve
            )
          }
        },
        // 接风控数据
        '/tuiatableview/:id/:slotid/:date': {
          component: function (resolve) {
            getOss(
              '/tuiachartcenter/tuiatableview',
              './chartcenter/tableView',
              resolve
            )
          }
        },
        // 接楼层看板数据
        '/tuiatableview/:id/:accountid/:appid/:timestart/:timeend/:appName/:accountname/:iska': {
          component: function (resolve) {
            getOss(
              '/tuiachartcenter/tuiatableview',
              './chartcenter/tableView',
              resolve
            )
          }
        },
        '/tuiatableview/:id/:accountid/:appid/:timestart/:timeend/:appName/:accountname': {
          component: function (resolve) {
            getOss(
              '/tuiachartcenter/tuiatableview',
              './chartcenter/tableView',
              resolve
            )
          }
        },
        // 看板
        '/tuiadashboard': {
          component: function (resolve) {
            getOss(
              '/tuiachartcenter/tuiadashboard',
              './chartcenter/dashboard',
              resolve
            )
          }
        }
      }
    }
  })

  let getOssCfg = function () {
    let ossCfg = {}
    if (roleMap.includes('/datapanel')) {
      ossCfg['*'] = '/datapanel'
    }
    if (roleMap.includes('/monitor')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/monitor'
      }
    }
    if (roleMap.includes('/analyze')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/analyze'
      }
    }
    if (roleMap.includes('/anticheat')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/anticheat'
      }
    }
    if (roleMap.includes('/tuiachartcenter')) {
      if (!ossCfg['*']) {
        ossCfg['*'] = '/tuiachartcenter'
      }
    }

    // 二级 看板
    if (roleMap.includes('/datapanel/income')) {
      ossCfg['/datapanel'] = '/datapanel/income'
    }
    if (roleMap.includes('/datapanel/bigpanel')) {
      if (!ossCfg['/datapanel']) {
        ossCfg['/datapanel'] = '/datapanel/bigpanel'
      }
    }
    if (roleMap.includes('/datapanel/advertdata')) {
      if (!ossCfg['/datapanel']) {
        ossCfg['/datapanel'] = '/datapanel/advertdata'
      }
    }
    if (roleMap.includes('/datapanel/advertKaData')) {
      if (!ossCfg['/datapanel']) {
        ossCfg['/datapanel'] = '/datapanel/advertKaData'
      }
    }
    if (roleMap.includes('/monitor/mediadimension')) {
      ossCfg['/monitor'] = '/monitor/mediadimension'
    }
    if (roleMap.includes('/monitor/adslotDimension')) {
      if (!ossCfg['/monitor']) {
        ossCfg['/monitor'] = '/monitor/adslotDimension'
      }
    }
    if (roleMap.includes('/monitor/activitydimension')) {
      if (!ossCfg['/monitor']) {
        ossCfg['/monitor'] = '/monitor/activitydimension'
      }
    }

    if (roleMap.includes('/monitor/activityAdslotDimension')) {
      if (!ossCfg['/monitor']) {
        ossCfg['/monitor'] = '/monitor/activityAdslotDimension'
      }
    }
    if (roleMap.includes('/monitor/activityMediaDimension')) {
      if (!ossCfg['/monitor']) {
        ossCfg['/monitor'] = '/monitor/activityMediaDimension'
      }
    }
    if (roleMap.includes('/monitor/advcost')) {
      if (!ossCfg['/monitor']) {
        ossCfg['/monitor'] = '/monitor/advcost'
      }
    }
    if (roleMap.includes('/monitor/advRealTime')) {
      if (!ossCfg['/monitor']) {
        ossCfg['/monitor'] = '/monitor/advRealTime'
      }
    }

    if (roleMap.includes('/analyze/advEffect')) {
      ossCfg['/analyze'] = '/analyze/advEffect'
    }
    if (roleMap.includes('/analyze/mediaoffline')) {
      if (!ossCfg['/analyze']) {
        ossCfg['/analyze'] = '/analyze/mediaoffline'
      }
    }
    if (roleMap.includes('/analyze/advFlow')) {
      if (!ossCfg['/analyze']) {
        ossCfg['/analyze'] = '/analyze/advFlow'
      }
    }
    if (roleMap.includes('/analyze/consumefluctuate')) {
      if (!ossCfg['/analyze']) {
        ossCfg['/analyze'] = '/analyze/consumefluctuate'
      }
    }
    if (roleMap.includes('/analyze/airport')) {
      if (!ossCfg['/analyze']) {
        ossCfg['/analyze'] = '/analyze/airport'
      }
    }

    // 二级目录 防作弊
    if (roleMap.includes('/anticheat/cheatmonitor')) {
      ossCfg['/anticheat'] = '/anticheat/cheatmonitor'
    }
    if (roleMap.includes('/anticheat/cheat')) {
      if (!ossCfg['/anticheat']) {
        ossCfg['/anticheat'] = '/anticheat/cheat'
      }
    }
    if (roleMap.includes('/anticheat/domain')) {
      if (!ossCfg['/anticheat']) {
        ossCfg['/anticheat'] = '/anticheat/domain'
      }
    }

    if (roleMap.includes('/tuiachartcenter/tuiadashboard')) {
      ossCfg['/tuiachartcenter'] = '/tuiachartcenter/tuiadashboard'
    }
    if (roleMap.includes('/tuiachartcenter/tuiachartlist')) {
      if (!ossCfg['/tuiachartcenter']) {
        ossCfg['/tuiachartcenter'] = '/tuiachartcenter/tuiachartlist'
      }
    }
    return ossCfg
  }

  router.redirect(getOssCfg())
  router.beforeEach(function (transition) {
    window.scrollTo(0, 0)
    transition.next()
  })
  router.start(AppContainer, '#app-container')
})
