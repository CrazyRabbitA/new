import { _fixNum, floatDiv } from 'components/utils/cheatDataUtils';
export default {
  methods: {
    getDate(chartData, type) {
      if (type === 'funnel') {
        let data = [
          {
            // chartData.funnelChart.appStartUser
            value: 100,
            name: 'APP启动用户数'
          },
          {
            value: floatDiv(chartData.funnelChart.loginUser, chartData.funnelChart.appStartUser, true) * 100,
            name: '登录用户数'
          },
          {
            value: floatDiv(chartData.funnelChart.participateUserCt, chartData.funnelChart.appStartUser, true) * 100,
            name: '阅读文章/观看视频数'
          },
          {
            value: floatDiv(chartData.funnelChart.participateIssueUser, chartData.funnelChart.appStartUser, true) * 100,
            name: '阅读文章/观看视频金币发放用户数'
          },
          {
            value: floatDiv(chartData.funnelChart.issueCashPer, chartData.funnelChart.appStartUser, true) * 100,
            name: '提现用户数'
          }
        ];
        let legendData = [
          _fixNum(chartData.funnelChart.appStartUser, 0),
          _fixNum(chartData.funnelChart.loginUser, 0),
          _fixNum(chartData.funnelChart.participateUserCt, 0),
          _fixNum(chartData.funnelChart.participateIssueUser, 0),
          _fixNum(chartData.funnelChart.cashUserCt, 0)
        ];
        let tipData = [
          parseFloat(chartData.funnelChart.appStartPer),
          parseFloat(chartData.funnelChart.startLoginPer),
          parseFloat(chartData.funnelChart.loginPartPer),
          parseFloat(chartData.funnelChart.partCoinPer),
          parseFloat(chartData.funnelChart.issueCashPer)
        ];
        this.renderFunnelChart({data: data, legendData: legendData, tipData: tipData});
      } else {
        let startLoginPer = {
          name: 'APP启动用户数-登录用户数',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#73cfca',
              borderWidth: 4
            }
          },
          data: []
        };
        let loginPartPer = {
          name: '登录用户数-阅读文章/观看视频数',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ff9090',
              borderWidth: 4
            }
          },
          lineStyle: {
            normal: {
              type: 'dashed'
            }
          },
          data: []
        };
        let partCoinPer = {
          name: '阅读文章/观看视频数-阅读文章/观看视频金币发放用户数',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#60a4e8',
              borderWidth: 4
            }
          },
          lineStyle: {
            normal: {
              type: 'dashed'
            }
          },
          data: []
        };
        let issueCashPer = {
          name: '阅读文章/观看视频金币发放用户数-提现用户数',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ffc61a',
              borderWidth: 4
            }
          },
          lineStyle: {
            normal: {
              type: 'dashed'
            }
          },
          data: []
        };
        let dataList = [];
        if (!this.isEmptyObject(chartData.lineChart)) {
          Object.keys(chartData.lineChart).forEach((key) => {
            if (chartData.lineChart[key]['startLoginPer'] === 'Infinity') {
              startLoginPer.data.push('-');
            } else if (chartData.lineChart[key]['startLoginPer'] === null) {
              startLoginPer.data.push(0);
            } else {
              startLoginPer.data.push(parseFloat(chartData.lineChart[key]['startLoginPer']));
            }
          });
          dataList.push(startLoginPer);
          Object.keys(chartData.lineChart).forEach((key) => {
            if (chartData.lineChart[key]['loginPartPer'] === 'Infinity') {
              loginPartPer.data.push('-');
            } else if (chartData.lineChart[key]['loginPartPer'] === null) {
              loginPartPer.data.push(0);
            } else {
              loginPartPer.data.push(parseFloat(chartData.lineChart[key]['loginPartPer']));
            }
          });
          dataList.push(loginPartPer);
          Object.keys(chartData.lineChart).forEach((key) => {
            if (chartData.lineChart[key]['partCoinPer'] === 'Infinity') {
              partCoinPer.data.push('-');
            } else if (chartData.lineChart[key]['partCoinPer'] === null) {
              partCoinPer.data.push(0);
            } else {
              partCoinPer.data.push(parseFloat(chartData.lineChart[key]['partCoinPer']));
            }
          });
          dataList.push(partCoinPer);
          // 阅读文章/观看视频金币发放用户数-提现用户数
          Object.keys(chartData.lineChart).forEach((key) => {
            if (chartData.lineChart[key]['issueCashPer'] === 'Infinity') {
              issueCashPer.data.push('-');
            } else if (chartData.lineChart[key]['issueCashPer'] === null) {
              issueCashPer.data.push(0);
            } else {
              issueCashPer.data.push(parseFloat(chartData.lineChart[key]['issueCashPer']));
            }
          });
          dataList.push(issueCashPer);
        }
        this.renderLineChart(dataList);
      }
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }
  }
};
