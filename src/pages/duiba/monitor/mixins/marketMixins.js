export default {
  methods: {
    getResourcesDate(lineList, type) {
      let lastday = {
        name: '额外日期(默认上周同日)',
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
      let sevAvePoint = {
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
      let yestoday = {
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
      let dataList = [];

      if (!this.isEmptyObject(lineList.today)) {
        Object.keys(lineList.today).forEach((key) => {
          if (lineList.today[key][type] === -1) {
            today.data.push('-');
          } else if (lineList.today[key][type] === null) {
            today.data.push(0);
          } else {
            today.data.push(lineList.today[key][type]);
          }
        });
        dataList.push(today);
      }
      if (!this.isEmptyObject(lineList.yestoday)) {
        Object.keys(lineList.yestoday).forEach((key) => {
          if (lineList.yestoday[key][type] === -1) {
            yestoday.data.push('-');
            yestoday.data.push(lineList.yestoday[key][type]);
          } else if (lineList.yestoday[key][type] === null) {
            yestoday.data.push(0);
          } else {
            yestoday.data.push(lineList.yestoday[key][type]);
          }
        });
        dataList.push(yestoday);
      }
      if (!this.isEmptyObject(lineList['7avg'])) {
        Object.keys(lineList['7avg']).forEach((key) => {
          if (lineList['7avg'][key][type] === -1) {
            sevAvePoint.data.push('-');
          } else if (lineList['7avg'][key][type] === null) {
            sevAvePoint.data.push(0);
          } else {
            sevAvePoint.data.push(lineList['7avg'][key][type]);
          }
        });
        dataList.push(sevAvePoint);
      }
      if (!this.isEmptyObject(lineList.lastday)) {
        Object.keys(lineList.lastday).forEach((key) => {
          if (lineList.lastday[key][type] === -1) {
            lastday.data.push('-');
          } else if (lineList.lastday[key][type] === null) {
            lastday.data.push(0);
          } else {
            lastday.data.push(lineList.lastday[key][type]);
          }
        });
        dataList.push(lastday);
      }
      this.renderLineChart(dataList, type);
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
