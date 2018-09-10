module.exports = {
    get: {
      '/quwen/dashboard': '/quwen/dashboardList.json',
      '/quwen/funnelVS': '/quwen/dashboardList.json',
      '/quwen/coreDataIndicators': '/quwen/indicators.json',
    },
    post: {
      '/quwen/dashboard': '/quwen/dashboardData.json',
      '/quwen/analysis/funnelplotdata': '/quwen/quwenanalysisfunnelplotdata.json',
      '/quwen/analysis/detaildatalist': '/quwen/quwenanalysisdetaildatalist.json',
      '/quwen/coredata': '/quwen/quwencoredata.json',
      '/quwen/coreData/appVS' : '/quwen/dashboardList.json'
    }
  };
