export default {
  methods: {
    getResourcesDate(lineList, type) {
      const colorArr = ['#70dec3', '#73a3fe', '#ffbc1c'];
      let yesterday = {
        name: 'T-1',
        type: 'line',
        itemStyle: {
          normal: {
            color: colorArr[0],
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
      let extraDate = {
        name: '查询日期',
        type: 'line',
        itemStyle: {
          normal: {
            color: colorArr[1],
            borderWidth: 4
          }
        },
        lineStyle: {
          normal: {
            type: 'solid'
          }
        },
        data: []
      };
      let sevenDaysAgo = {
        name: 'T-7',
        type: 'line',
        itemStyle: {
          normal: {
            color: colorArr[2],
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
      if (!this.isEmptyObject(lineList.extraDate)) {
        Object.keys(lineList.extraDate).forEach((key) => {
          if (lineList.extraDate[key][type] === -1) {
            extraDate.data.push('-');
          } else if (lineList.extraDate[key][type] === null) {
            extraDate.data.push(0);
          } else {
            extraDate.data.push(lineList.extraDate[key][type]);
          }
        });
        dataList.push(extraDate);
      }
      if (!this.isEmptyObject(lineList.yesterday)) {
        Object.keys(lineList.yesterday).forEach((key) => {
          if (lineList.yesterday[key][type] === -1) {
            yesterday.data.push('-');
            yesterday.data.push(lineList.yesterday[key][type]);
          } else if (lineList.yesterday[key][type] === null) {
            yesterday.data.push(0);
          } else {
            yesterday.data.push(lineList.yesterday[key][type]);
          }
        });
        dataList.push(yesterday);
      }
      if (!this.isEmptyObject(lineList.sevenDaysAgo)) {
        Object.keys(lineList.sevenDaysAgo).forEach((key) => {
          if (lineList.sevenDaysAgo[key][type] === -1) {
            sevenDaysAgo.data.push('-');
          } else if (lineList.sevenDaysAgo[key][type] === null) {
            sevenDaysAgo.data.push(0);
          } else {
            sevenDaysAgo.data.push(lineList.sevenDaysAgo[key][type]);
          }
        });
        dataList.push(sevenDaysAgo);
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
        num = Number(num);
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
