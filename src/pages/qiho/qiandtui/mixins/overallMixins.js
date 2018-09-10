export default {
  methods: {
    _fixData(dataObj) {
      let cacheObj = {};
      let yxisArr = [];
      for (let [key, item] of Object.entries(dataObj)) {
        for (let v of Object.values(item)) {
          if (typeof v === 'object') {
            for (let i in v) {
              // 值为null的统一设置为0
              if (!v[i]) {
                v[i] = 0;
              }
              if (key === 'clickRateChart' || key === 'successCtChart' || key === 'orderRateChart') {
                v[i] = (v[i] * 100).toFixed(2);
              }
            }
          }
        }

        let seriesObj = {};

        for (let [k, v] of Object.entries(item)) {
          let dataArr = [];
          for (let i in v) {
            dataArr.push(v[i]);
            if (k === 'orderCount') {
              yxisArr.push(i);
            }
          }
          let dataObj = {
            data: dataArr
          };
          Object.assign(dataObj, this.itemSet[k]);
          seriesObj[k] = dataObj;
        }
        cacheObj[key] = {
          name: this.nameMap[key],
          key: key,
          data: seriesObj,
          isActive: false,
          yxisArr: yxisArr
        };
      }
      return cacheObj;
    },
    /**
     * 将接口数据转为echarts series对应的数据
     * @param data 接口data数据
     */
    convertChartData: function(data) {
      let result = {};
      Object.keys(this.nameMap).map(function(k) {
        result[k] = {};
        for (let item of data) {
          let curTime = item.curTime;
          switch (k) {
            case 'orderCountChart':
              // 订单(下单量，出单量)
              if (!result['orderCountChart']['orderCount']) {
                result['orderCountChart']['orderCount'] = [];
              }
              result['orderCountChart']['orderCount'][curTime] = item.orderCount;
              if (!result['orderCountChart']['issueCount']) {
                result['orderCountChart']['issueCount'] = [];
              }
              result['orderCountChart']['issueCount'][curTime] = item.issueCount;
              break;

            case 'clickRateChart':
              // 点击(点击率)
              if (!result['clickRateChart']['clickRate']) {
                result['clickRateChart']['clickRate'] = [];
              }
              result['clickRateChart']['clickRate'][curTime] = item.clickRate;
              break;

            case 'orderRateChart':
              // 下单(下单率)
              if (!result['orderRateChart']['orderRate']) {
                result['orderRateChart']['orderRate'] = [];
              }
              result['orderRateChart']['orderRate'][curTime] = item.orderRate;
              break;

            case 'successCtChart':
              // 签收(次日，三日，总)
              if (!result['successCtChart']['onedayAllRate']) {
                result['successCtChart']['onedayAllRate'] = [];
              }
              result['successCtChart']['onedayAllRate'][curTime] = item.onedayAllRate;
              if (!result['successCtChart']['threedayAllRate']) {
                result['successCtChart']['threedayAllRate'] = [];
              }
              result['successCtChart']['threedayAllRate'][curTime] = item.threedayAllRate;
              if (!result['successCtChart']['successRate']) {
                result['successCtChart']['successRate'] = [];
              }
              result['successCtChart']['successRate'][curTime] = item.successRate;
              break;

            case 'ROIChart':
              // ROI(ROI)
              if (!result['ROIChart']['itemRoi']) {
                result['ROIChart']['itemRoi'] = [];
              }
              result['ROIChart']['itemRoi'][curTime] = item.itemRoi;
              break;
            default:
              break;
          }
        }
      });
      return result;
    }
  }
};
