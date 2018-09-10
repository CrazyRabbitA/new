module.exports = {
  get: {
    '/tuia_chain/searchApp': '/dataPanel/searchApp.json',
    '/tuia_chain/getAppCurve': '/dataPanel/getAppCurve.json',
    '/tuia_chain/getSlotCurve': '/dataPanel/getAppCurve.json',
    '/tuia_chain/findAppInfo': '/dataPanel/findAppInfo.json',
    '/tuia/app/line/chart': '/dataPanel/mediaDimension.json',
    '/tuia/activity/line/chart': '/dataPanel/mediaDimension.json',
    '/tuia/adslot/app/line/chart': '/dataPanel/mediaDimension.json',
    '/tuia/activity/adslot/line/chart': '/dataPanel/mediaDimension.json',
    '/tuia/activity/app/line/chart': '/dataPanel/mediaDimension.json',
    '/tuia/ads/transfee': '/dataPanel/getAdvCost.json',
    // 修改
    '/cheat/data': '/dataPanel/newRule.json',
    '/ka': '/dataPanel/kaCharts.json',
    '/ka/account': '/dataPanel/kaAccount.json',
    '/ka/table': '/dataPanel/kaTable.json',
    '/ka/newTable': '/dataPanel/newData.json'
  },
  post: {
    '/cheat/monitor/slot': '/dataPanel/pageSlot.json',
    '/cheat/monitor/app': '/dataPanel/pageApp.json',
    '/one/mytest': '/dataPanel/echarts.json',
    '/income/realtime': '/dataPanel/incom.json',
    '/income2/realtime': '/dataPanel/echarts.json',
    '/cheatproof/risklevel': '/dataPanel/prevent.json',
    '/cheatproof/hitrule': '/dataPanel/top.json'
  }
};
