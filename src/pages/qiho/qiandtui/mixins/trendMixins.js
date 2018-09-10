export default {
  methods: {
    _fixData(dataObj) {
      let cacheObj = {};
      let yxisArr = [];
      for (let [key, item] of Object.entries(dataObj)) {
        for (let [k, v] of Object.entries(item)) {
          if (typeof v === 'object') {
            for (let i in v) {
              // 值为null的统一设置为0
              if (!v[i]) {
                v[i] = 0;
              } else if (k === 'clickRate' || k === 'successRate') {
                v[i] = (v[i] * 100).toFixed(2);
              } else if (k === 'adConcume' || k === 'itemRate') {
                v[i] = (v[i] / 100).toFixed(2);
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
     * 将商品趋势接口数据转为echarts series对应的数据
     * @param data 接口data数据
     * @param key 对应的表Key
     */
    convertTrendChartData: function(data, key) {
      let result = {};
      Object.keys(this.nameMap).map(function(k) {
        result[k] = {};
        for (let item of data) {
          let curTime = item.curTime;
          switch (k) {
            case 'incomeExpenseChart':
              // 收支(广告消耗，商品毛利)
              if (!result['incomeExpenseChart']['adConcume']) {
                result['incomeExpenseChart']['adConcume'] = [];
              }
              result['incomeExpenseChart']['adConcume'][curTime] = item.adConcume;
              if (!result['incomeExpenseChart']['itemRate']) {
                result['incomeExpenseChart']['itemRate'] = [];
              }
              result['incomeExpenseChart']['itemRate'][curTime] = item.itemRate;
              break;
            case 'flowChart':
              // 流量(发券量、点击量、点击率)
              if (!result['flowChart']['launchCount']) {
                result['flowChart']['launchCount'] = [];
              }
              result['flowChart']['launchCount'][curTime] = item.launchCount;
              if (!result['flowChart']['clickCount']) {
                result['flowChart']['clickCount'] = [];
              }
              result['flowChart']['clickCount'][curTime] = item.clickCount;
              if (!result['flowChart']['clickRate']) {
                result['flowChart']['clickRate'] = [];
              }
              result['flowChart']['clickRate'][curTime] = item.clickRate;
              break;
            case 'orderChart':
              // 订单(下单量、出单量)
              if (!result['orderChart']['orderCount']) {
                result['orderChart']['orderCount'] = [];
              }
              result['orderChart']['orderCount'][curTime] = item.orderCount;
              if (!result['orderChart']['issueCount']) {
                result['orderChart']['issueCount'] = [];
              }
              result['orderChart']['issueCount'][curTime] = item.issueCount;
              break;
            case 'successCtChart':
              // 签收(总签收量、总签收率)
              if (!result['successCtChart']['successCt']) {
                result['successCtChart']['successCt'] = [];
              }
              result['successCtChart']['successCt'][curTime] = item.successCt;
              if (!result['successCtChart']['successRate']) {
                result['successCtChart']['successRate'] = [];
              }
              result['successCtChart']['successRate'][curTime] = item.successRate;
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
