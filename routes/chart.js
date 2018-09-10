module.exports = {
  get: {
    '/chart/database': '/chart/database.json',
    '/chart/category/list': '/chart/chartcategorylist.json',
    '/chart/category/remove': '/chart/chartcategoryremove.json',
    '/chart/delete': '/chart/chartdelete.json',
    '/chart/config': '/chart/chartconfig.json',
    '/chart/category/droplist': '/chart/chartcategorydroplist.json',
    '/chart/biz': '/chart/chartbiz.json',
    '/chart/role/delete': '/chart/success.json',
    '/chart/role/cate': '/chart/chartrolecate.json',
    '/chart/user/role': '/chart/chartuserrole.json',
    // 智能报表查询条件获取
    '/chart/parms': '/chart/chartparams.json',
    // dashboard 我的看板
    '/chart/dashboards': '/chart/dashboards.json',
    '/chart/dashboard': '/chart/dashboard.json',
    '/chart/dashboard/remove': '/chart/dashboardremove.json',
    '/chart/category/dashboard': '/chart/dashboardlib.json',
  },
  post: {
    '/chart/parse': '/chart/parse.json',
    '/chart/sql/column': '/chart/sqlcolumn.json',
    '/chart': '/chart/chart.json',
    '/chart/check': '/chart/chartsearch.json',
    '/chart/database/edit': '/chart/databaseedit.json',
    '/chart/database/remove': '/chart/databaseremove.json',
    '/chart/database/add': '/chart/databaseadd.json',
    '/chart/list': '/chart/chartlist.json',
    '/chart/category': '/chart/chartcategory.json',
    '/chart/category/edit': '/chart/success.json',
    '/chart/add': '/chart/chartadd.json',
    '/chart/preview': '/chart/chartadd.json',
    '/chart/editrole': '/chart/success.json',
    '/chart/role/save': '/chart/success.json',
    '/chart/user/bind': '/chart/chartuserbind.json',
    '/chart/role': '/chart/chartsroles.json',
    '/chart/user': '/chart/chartuser.json',
    // 保存看板
    '/chart/dashboard/save': '/chart/dashboardsave.json',
    // 子母表
    '/chart/searchTable': '/chart/searchTable.json',
    '/chart/queryColumns': '/chart/queryColumns.json'
  }
};
