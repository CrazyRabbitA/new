export default {
  methods: {
    getResourcesDate(lineList, type) {
      let sevAvePoint = {
        name: `七日平均：${this.totalData[2]}`,
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
      let yesterday = {
        name: `昨日：${this.totalData[1]}`,
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
      let today = {
        name: `今日：${this.totalData[0]}`,
        type: 'line',
        itemStyle: {
          normal: {
            color: '#73cfca',
            borderWidth: 4
          }
        },
        data: []
      };
      let lastDay = {
        name: `上周同日：${this.totalData[3]}`,
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

      if (!this.isEmptyObject(lineList.today)) {
        Object.keys(lineList.today).forEach((key) => {
          if (lineList.today[key][type] === 'Infinity') {
            today.data.push('-');
          } else if (lineList.today[key][type] === null) {
            today.data.push(0);
          } else {
            today.data.push(lineList.today[key][type]);
          }
        });
        dataList.push(today);
      }
      if (!this.isEmptyObject(lineList.yesterday)) {
        Object.keys(lineList.yesterday).forEach((key) => {
          if (lineList.yesterday[key][type] === 'Infinity') {
            yesterday.data.push('-');
          } else if (lineList.yesterday[key][type] === null) {
            yesterday.data.push(0);
          } else {
            yesterday.data.push(lineList.yesterday[key][type]);
          }
        });
        dataList.push(yesterday);
      }
      if (!this.isEmptyObject(lineList['7avg'])) {
        Object.keys(lineList['7avg']).forEach((key) => {
          if (lineList['7avg'][key][type] === 'Infinity') {
            sevAvePoint.data.push('-');
          } else if (lineList['7avg'][key][type] === null) {
            sevAvePoint.data.push(0);
          } else {
            sevAvePoint.data.push(lineList['7avg'][key][type]);
          }
        });
        dataList.push(sevAvePoint);
      }
      if (!this.isEmptyObject(lineList.lastDay)) {
        Object.keys(lineList.lastDay).forEach((key) => {
          if (lineList.lastDay[key][type] === 'Infinity') {
            lastDay.data.push('-');
          } else if (lineList.lastDay[key][type] === null) {
            lastDay.data.push(0);
          } else {
            lastDay.data.push(lineList.lastDay[key][type]);
          }
        });
        dataList.push(lastDay);
      }
      this.renderLineChart(dataList);
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
