export default {
  data() {
    return {
      colorObj: {
        default: '#7aa2ed',
        red: '#da5c58',
        green: '#46ae86',
        black: '#444444'
      }
    };
  },
  methods: {
    getChartDate(_objData) {
      let self = this;
      let objData = self._deepCopy(_objData);
      switch (this.dataObj.chartType) {
        case 'apps':
          self.getCurrentData(objData, 'app_id', 'appName');
          break;
        case 'times':
          self.getCurrentData(objData, 'times', 'times');
          break;
        case 'timeInterval':
          self.getCurrentData(objData, 'hour', 'hour');
          break;
        case 'priceSection':
          self.getCurrentData(objData, 'price_section', 'price_section');
          break;
        case 'provinces':
          self.getCurrentData(objData, 'province', 'province');
          break;
        case 'brandName':
          self.getCurrentData(objData, 'brand_name', 'brand_name');
          break;
        case 'appFlowType':
          self.getCurrentData(objData, 'app_flow_type', 'app_flow_type');
          break;
        case 'platforms':
          self.getCurrentData(objData, 'platform', 'platform');
          break;
        case 'slot':
          self.getCurrentData(objData, 'slot_id', 'slotName');
          break;
      }
    },
    getCurrentData(objData, id, name) {
      // 无穷大默认值
      let _infinity = 0;
      let barName = '';
      let barColor = '';
      let barColorName = '';
      let self = this;
      objData.forEach((item) => {
        if (!isNaN(item.transCost) && Number(item.transCost) !== Infinity && _infinity < item.transCost) {
          _infinity = item.transCost;
        }
      });
      let chartData = [];

      objData.forEach((item) => {
        if (Number(item.transCost) === Infinity) {
          if (item.barName !== '无穷大') {
            item.transCost = _infinity + 1;
          }
          barName = '无穷大';
          barColor = self.colorObj.black;
          barColorName = 'black';
        } else if (isNaN(item.transCost) || item.barName === '无转化') {
          item.transCost = 0;
          barName = '无转化';
          barColor = self.colorObj.black;
          barColorName = 'black';
        } else {
          if (self.costPay !== 0) {
            item.transCost > self.costPay ? (barColor = self.colorObj.red) : (barColor = self.colorObj.green);
            item.transCost > self.costPay ? (barColorName = 'red') : (barColorName = 'green');
          } else {
            barColor = self.colorObj.default;
            barColorName = 'default';
          }
          barName = Number(item.transCost).toFixed(2);
        }
        chartData.push({
          name: item[name],
          value: item.transCost,
          id: item[id],
          transCost: item.transCost,
          consumeRatio: item.consumeRatio,
          adConsume: item.adConsume,
          effectPv: item.effectPv,
          barName: barName,
          barColor: barColorName,
          itemStyle: {
            normal: {
              color: barColor
            }
          }
        });
      });
      if (this.dataObj.chartType === 'appFlowType' || this.dataObj.chartType === 'priceSection' || this.dataObj.chartType === 'platforms' || this.dataObj.chartType === 'times') {
        let xData = [];
        let self = this;
        chartData.forEach((item) => {
          if (self.dataObj.chartType === 'times') {
            // 次序维度单独处理
            if (item.name.indexOf(',') > -1) {
              xData.push('其它' + '\n' + this._precent(this._fixNum(item.consumeRatio)));
            } else {
              xData.push('第' + item.name + '次' + '\n' + this._precent(this._fixNum(item.consumeRatio)));
            }
          } else if (self.dataObj.chartType === 'priceSection') {
            if (item.name === '') {
              xData.push('其它' + '\n' + this._precent(this._fixNum(item.consumeRatio)));
            } else {
              xData.push(item.name + '元' + '\n' + this._precent(this._fixNum(item.consumeRatio)));
            }
          } else if (this.dataObj.chartType === 'brandName') {
            xData.push(item.name + '\n' + this._precent(this._fixNum(item.consumeRatio)));
          } else if (self.dataObj.chartType === 'appFlowType') {
            let _text = '';
            switch (item.name) {
              case '1':
                _text = '微信';
                break;
              case '2':
                _text = 'QQ';
                break;
              case '3':
                _text = '支付宝';
                break;
              default:
                _text = '其他';
                break;
            }
            xData.push(_text + '\n' + this._precent(this._fixNum(item.consumeRatio)));
          } else {
            xData.push(item.name + '\n' + this._precent(this._fixNum(item.consumeRatio)));
          }
        });
        this.newChartData = chartData;
        if (this.isFirst) {
          this.checkList = [];
          this.colorCheckList = [];
          chartData.forEach((item) => {
            this.checkList.push(item.id);
          });
          this.isFirst = false;
          this.colorCheckList.push('all');
        }
        this.renderChart(chartData, xData);
      } else {
        this.sortData(chartData);
      }
    },
    sortData(chartData) {
      let self = this;
      switch (this.dataObj.sortItem) {
        case 'advToLow':
          self.sortAction(chartData, 'consumeRatio', 'advToLow');
          break;
        case 'costToHigh':
          self.sortAction(chartData, 'transCost', 'costToHigh');
          break;
        case 'costToLow':
          self.sortAction(chartData, 'transCost', 'costToLow');
          break;
        default:
          self.sortAction(chartData, 'name', 'name');
          break;
      }
    },
    sortAction(chartData, compareItem, sortItem) {
      let compare = function(obj1, obj2) {
        let val1, val2;
        if (sortItem === 'costToHigh' || sortItem === 'name') {
          val1 = obj1[compareItem];
          val2 = obj2[compareItem];
        } else {
          val2 = obj1[compareItem];
          val1 = obj2[compareItem];
        }
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
      chartData.sort(compare);
      if (this.dataObj.chartType === 'apps' || this.dataObj.chartType === 'slot') {
        this.filterData(chartData);
      } else {
        let xData = [];
        chartData.forEach((item) => {
          xData.push(item.name + '\n' + this._precent(this._fixNum(item.consumeRatio)));
        });
        this.newChartData = chartData;
        if (this.isFirst) {
          this.checkList = [];
          this.colorCheckList = [];
          chartData.forEach((item) => {
            this.checkList.push(item.id);
          });
          this.isFirst = false;
          this.colorCheckList.push('all');
        }
        this.renderChart(chartData, xData);
      }
    },
    filterData(chartData) {
      let newChartData = [];
      let otherAdConsumeSum = 0;
      let effectPvSum = 0;
      let consumeTotal = this.dataObj.consumeTotal;
      let transCost, consumeRatio;
      let otherId = '';
      let chartDataLen = chartData.length;
      let self = this;
      let barColor = '';
      let barColorName = '';
      switch (this.dataObj.filterItem) {
        case 'TOP10':
          if (chartDataLen > 10) {
            newChartData = chartData.slice(0, 10);
            chartData.forEach((item, index) => {
              if (index > 9) {
                otherAdConsumeSum = this.floatAdd(otherAdConsumeSum, item.adConsume);
                otherId += item.id + ',';
              }
              effectPvSum = this.floatAdd(effectPvSum, item.effectPv);
            });
            transCost = this.floatDiv(otherAdConsumeSum, effectPvSum);
            consumeRatio = this.floatDiv(otherAdConsumeSum, consumeTotal);
            // 单位分转元
            transCost = this.floatDiv(transCost, 100);
            consumeRatio = this.floatDiv(consumeRatio, 100);
            if (self.costPay !== 0) {
              transCost > self.costPay ? (barColor = self.colorObj.red) : (barColor = self.colorObj.green);
              transCost > self.costPay ? (barColorName = 'red') : (barColorName = 'green');
            } else {
              barColor = self.colorObj.default;
              barColorName = 'defaut';
            }
            newChartData.push({
              name: '其它',
              value: transCost,
              id: otherId,
              transCost: transCost,
              consumeRatio: consumeRatio,
              adConsume: 123,
              effectPv: 123,
              barName: transCost,
              barColor: barColorName,
              itemStyle: {
                normal: {
                  color: barColor
                }
              }
            });
          } else {
            newChartData = chartData.slice(0);
          }
          break;
        case 'TOP30':
          if (chartDataLen > 30) {
            newChartData = chartData.slice(0, 30);
            chartData.forEach((item, index) => {
              if (index > 29) {
                otherAdConsumeSum = this.floatAdd(otherAdConsumeSum, item.adConsume);
                otherId += item.id + ',';
              }
              effectPvSum = this.floatAdd(effectPvSum, item.effectPv);
            });
            transCost = this.floatDiv(otherAdConsumeSum, effectPvSum);
            consumeRatio = this.floatDiv(otherAdConsumeSum, consumeTotal);
             // 单位分转元
            transCost = this.floatDiv(transCost, 100);
            consumeRatio = this.floatDiv(consumeRatio, 100);
            if (self.costPay !== 0) {
              transCost > self.costPay ? (barColor = self.colorObj.red) : (barColor = self.colorObj.green);
              transCost > self.costPay ? (barColorName = 'red') : (barColorName = 'green');
            } else {
              barColor = self.colorObj.default;
              barColorName = 'defaut';
            }
            newChartData.push({
              name: '其它',
              value: transCost,
              id: otherId,
              transCost: transCost,
              consumeRatio: consumeRatio,
              adConsume: 123,
              effectPv: 123,
              barName: transCost,
              barColor: barColorName,
              itemStyle: {
                normal: {
                  color: barColor
                }
              }
            });
          } else {
            newChartData = chartData.slice(0);
          }
          break;
        case 'TOP50':
          if (chartDataLen > 50) {
            newChartData = chartData.slice(0, 50);
            chartData.forEach((item, index) => {
              if (index > 49) {
                otherAdConsumeSum = this.floatAdd(otherAdConsumeSum, item.adConsume);
                otherId += item.id + ',';
              }
              effectPvSum = this.floatAdd(effectPvSum, item.effectPv);
            });
            transCost = this.floatDiv(otherAdConsumeSum, effectPvSum);
            consumeRatio = this.floatDiv(otherAdConsumeSum, consumeTotal);
             // 单位分转元
            transCost = this.floatDiv(transCost, 100);
            consumeRatio = this.floatDiv(consumeRatio, 100);
            if (self.costPay !== 0) {
              transCost > self.costPay ? (barColor = self.colorObj.red) : (barColor = self.colorObj.green);
              transCost > self.costPay ? (barColorName = 'red') : (barColorName = 'green');
            } else {
              barColor = self.colorObj.default;
              barColorName = 'defaut';
            }
            newChartData.push({
              name: '其它',
              value: transCost,
              id: otherId,
              transCost: transCost,
              consumeRatio: consumeRatio,
              adConsume: 123,
              effectPv: 123,
              barName: transCost,
              barColor: barColorName,
              itemStyle: {
                normal: {
                  color: barColor
                }
              }
            });
          } else {
            newChartData = chartData.slice(0);
          }
          break;
        default:
          newChartData = chartData.slice(0);
          break;
      }
      let xData = [];
      newChartData.forEach((item) => {
        if (item.name === '其它') {
          xData.push(item.name + '\n' + this._precent(this._fixNum(item.consumeRatio)));
        } else {
          xData.push(item.name + '\n' + item.id + '\n' + this._precent(this._fixNum(item.consumeRatio)));
        }
      });
      this.newChartData = newChartData;
      if (this.isFirst) {
        this.checkList = [];
        this.colorCheckList = [];
        newChartData.forEach((item) => {
          this.checkList.push(item.id);
        });
        this.isFirst = false;
        this.colorCheckList.push('all');
      }
      this.renderChart(newChartData, xData);
    },
    floatAdd(arg1, arg2) {
     /**
      ** 加法函数，用来得到精确的加法结果
      ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
      ** 调用：accAdd(arg1,arg2)
      ** 返回值：arg1加上arg2的精确结果
      **/
      var r1, r2, m, c;
      try {
        r1 = arg1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split('.')[1].length;
      } catch (e) {
        r2 = 0;
      }
      c = Math.abs(r1 - r2);
      m = Math.pow(10, Math.max(r1, r2));
      if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
          arg1 = Number(arg1.toString().replace('.', ''));
          arg2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
          arg1 = Number(arg1.toString().replace('.', '')) * cm;
          arg2 = Number(arg2.toString().replace('.', ''));
        }
      } else {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', ''));
      }
      return (arg1 + arg2) / m;
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
    },
    _precent(num) {
      return parseFloat((num * 100).toPrecision(4)).toFixed(2) + '%';
    },
    _fixNum(num) {
      let result = Number(num);
      let isFloat = (num.toString()).indexOf('.');
      if (isFloat !== -1) {
        result.toFixed(2);
      }
      if (result) {
        num = num + '';
        let fix = ''; // 小数点情况
        let splitArr = num.split('.');
        num = splitArr[0];
        fix = splitArr[1] ? splitArr[1] : '';
        if (isFloat !== -1) {
          return num + '.' + fix;
        }
        return num + fix;
      }
      return num;
    },
    _deepCopy(o) {
      if (o instanceof Array) {
        let n = [];
        for (let i = 0; i < o.length; ++i) {
          n[i] = this._deepCopy(o[i]);
        }
        return n;
      } else if (o instanceof Object) {
        let n = {};
        for (let i in o) {
          n[i] = this._deepCopy(o[i]);
        }
        return n;
      } else {
        return o;
      }
    }
  }
};
