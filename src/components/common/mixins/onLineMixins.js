export default {
  methods: {
    getResourcesDate(lineList, type) {
      let sevAvePoint = {
        // name: `七日平均：${this.totalData[2]}`,
        name: '七日平均',
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
        // name: `昨日：${this.totalData[1]}`,
        name: '昨日',
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
        // name: `今日：${this.totalData[0]}`,
        name: '今日',
        type: 'line',
        itemStyle: {
          normal: {
            color: '#73cfca',
            borderWidth: 4
          }
        },
        data: []
      };
      let extraDate = {
        // name: `搜索日期：${this.totalData[3]}`,
        name: '搜索日期',
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
      if (!this.isEmptyObject(lineList.extraDate)) {
        Object.keys(lineList.extraDate).forEach((key) => {
          if (lineList.extraDate[key][type] === 'Infinity') {
            extraDate.data.push('-');
          } else if (lineList.extraDate[key][type] === null) {
            extraDate.data.push(0);
          } else {
            extraDate.data.push(lineList.extraDate[key][type]);
          }
        });
        dataList.push(extraDate);
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
    }
  }
};
