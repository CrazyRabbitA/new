module.exports = {
  get: {
    '/duiba/dashboard/collect': '/duiba/dashboard.json',
    '/duiba/dashboard/line/chart': '/duiba/dashboardlinechart.json',
    '/duiba/credits/independent/activity/collect': '/duiba/collect.json'
  },
  post: {
    '/mainmeet': '/duiba/mainmeet.json',
    '/mainmeet/app': '/duiba/app.json',
    '/mainmeet/activity/point': '/duiba/timeappline.json',
    '/mainmeet/activity/table': '/duiba/timeapptable.json',
    // 资源位
    '/dpm/floor/table': '/duiba/dpmfloortable.json',
    '/dpm/floor/point': '/duiba/dpmfloorpoint.json',
    '/dpm/appfloor/table': '/duiba/dpmappfloortable.json',
    '/dpm/app/table': '/duiba/dpmapptable.json',
    '/dpm/appfloor/point': '/duiba/dpmappfloorpoint.json',
    '/dpm/app/point': '/duiba/dpmapppoint.json',
    // end
    '/dpm/floor': '/duiba/floor.json',
    '/dpm/app': '/duiba/hotspot.json',
    '/indact/table': '/duiba/indactTable.json',
    '/indact/line': '/duiba/indactLine.json',
    '/indact/location': '/duiba//indactLocation.json',
    '/indact/location/city': '/duiba/inactLocationCity.json',
    '/duiba/credits/independent/activity/realtime/table': '/duiba/realtimeTable.json',
    '/duiba/credits/independent/activity/realtime': '/duiba/realtime.json',
    // 媒体
    '/duiba/credits/independent/activity/top': '/duiba/appRank.json',
    // 活动
    '/duiba/top/activity': '/duiba/actRank.json',
    // 资源位置
    '/duiba/top/dpm': '/duiba/slotRank.json'
  }
};
