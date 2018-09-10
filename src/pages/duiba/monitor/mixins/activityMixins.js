export default {
  methods: {
    getResourcesDate(lineList, type) {
      let extPoint = {
        name: '输入日期',
        type: 'line',
        data: []
      };
      let sevAvePoint = {
        name: '七日平均',
        type: 'line',
        data: []
      };
      let yesPoint = {
        name: '昨日',
        type: 'line',
        data: []
      };
      let todPoint = {
        name: '今日',
        type: 'line',
        data: []
      };
      let dataList = [];

      if (!this.isEmptyObject(lineList.todPoint)) {
        Object.keys(lineList.todPoint).forEach((key) => {
          if (lineList.todPoint[key][type] === -1) {
            todPoint.data.push('-');
          } else if (lineList.todPoint[key][type] === null) {
            todPoint.data.push(0);
          } else {
            todPoint.data.push(lineList.todPoint[key][type]);
          }
        });
        dataList.push(todPoint);
      }
      if (!this.isEmptyObject(lineList.yesPoint)) {
        Object.keys(lineList.yesPoint).forEach((key) => {
          if (lineList.yesPoint[key][type] === -1) {
            yesPoint.data.push('-');
            yesPoint.data.push(lineList.yesPoint[key][type]);
          } else if (lineList.yesPoint[key][type] === null) {
            yesPoint.data.push(0);
          } else {
            yesPoint.data.push(lineList.yesPoint[key][type]);
          }
        });
        dataList.push(yesPoint);
      }
      if (!this.isEmptyObject(lineList.sevAvePoint)) {
        Object.keys(lineList.sevAvePoint).forEach((key) => {
          if (lineList.sevAvePoint[key][type] === -1) {
            sevAvePoint.data.push('-');
          } else if (lineList.sevAvePoint[key][type] === null) {
            sevAvePoint.data.push(0);
          } else {
            sevAvePoint.data.push(lineList.sevAvePoint[key][type]);
          }
        });
        dataList.push(sevAvePoint);
      }
      if (!this.isEmptyObject(lineList.extPoint)) {
        Object.keys(lineList.extPoint).forEach((key) => {
          if (lineList.extPoint[key][type] === -1) {
            extPoint.data.push('-');
          } else if (lineList.extPoint[key][type] === null) {
            extPoint.data.push(0);
          } else {
            extPoint.data.push(lineList.extPoint[key][type]);
          }
        });
        dataList.push(extPoint);
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
        num = Number(num).toFixed(2);
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
