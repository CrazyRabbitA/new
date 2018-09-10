export default {
  methods: {
    getResourcesDate(lineList, type, selectQuotaName) {
      let dataLineChart = {
        name: selectQuotaName,
        type: 'line',
        data: []
      };
      if (!this.isEmptyObject(lineList)) {
        Object.keys(lineList).forEach(item => {
          if (lineList[item][type] === -1) {
            dataLineChart.data.push('-');
          } else if (lineList[item][type] === null) {
            dataLineChart.data.push(0);
          } else {
            dataLineChart.data.push(lineList[item][type]);
          }
        });
        this.renderLineChart(dataLineChart);
      }
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    },
    _fixNum(num) {
      let isFloatNum = (num.toString()).indexOf('.');
      let isPrecentNum = (num.toString()).indexOf('%');
      if (isPrecentNum === -1 && isFloatNum !== -1) {
        num = num.toFixed(2);
      }
      let result = Number(num);
      if (result) {
        num = num + '';
        let fix = ''; // 小数点情况
        let splitArr = num.split('.');
        num = splitArr[0];
        fix = splitArr[1] ? splitArr[1] : '';
        num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
          return s + ',';
        });
        if (fix) {
          return num + '.' + fix;
        }
        return num + fix;
      }
      return num;
    }
  }
};
