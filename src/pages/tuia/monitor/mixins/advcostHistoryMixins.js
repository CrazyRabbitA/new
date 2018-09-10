export default {
  methods: {
    getAdvcostHistoryDate(lineList, type) {
      let lineSeries = [];
      let self = this;
      if (type) {
        let lineSeriesItem = [];
        let lineElement = {
          name: '广告计划数据',
          type: 'line',
          data: [],
          advertFeeList: [],
          effectPvList: []
        };
        let _data = Object.values(lineList.total[0].point);
        _data.forEach(function(item) {
          if (item.rate !== -1) {
            lineSeriesItem.push(item.rate);
          } else {
            lineSeriesItem.push('-');
          }
          let _advertFee = self.floatDiv(item.advertFee, 100);
          lineElement.advertFeeList.push(_advertFee);
          lineElement.effectPvList.push(item.effectPv);
        });
        lineElement.data = lineSeriesItem;
        lineElement.name = '广告计划数据';
        lineSeries.push(lineElement);
      } else {
        this.checkListHistory.forEach(function(item) {
          let lineSeriesItem = [];
          let advertFeeList = [];
          let effectPvList = [];
          let _data = Object.values(lineList.advertPackage[item].point);
          _data.forEach(function(_item) {
            if (_item.rate !== -1) {
              lineSeriesItem.push(_item.rate);
            } else {
              lineSeriesItem.push('-');
            }
            let _advertFee = self.floatDiv(_item.advertFee, 100);
            advertFeeList.push(_advertFee);
            effectPvList.push(_item.effectPv);
          });
          lineSeries.push({
            name: lineList.advertPackage[item].packageName,
            type: 'line',
            data: lineSeriesItem,
            advertFeeList: advertFeeList,
            effectPvList: effectPvList
          });
        });
      }
      this.renderHistoryLineChart(lineSeries);
    },
    floatDiv(arg1, arg2) {
      let t1 = 0;
      let t2 = 0;
      let r1, r2;
      try {
        t1 = arg1.toString().split('.')[1].length;
      } catch (e) {
      }
      try {
        t2 = arg2.toString().split('.')[1].length;
      } catch (e) {
      }
      r1 = Number(arg1.toString().replace('.', ''));
      r2 = Number(arg2.toString().replace('.', ''));
      var _num = (r1 / r2) * Math.pow(10, t2 - t1);
      return _num.toFixed(2);
    }
  }
};
