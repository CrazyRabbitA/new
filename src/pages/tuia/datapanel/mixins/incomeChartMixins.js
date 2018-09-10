import echarts from 'echarts';
import {_fixNum} from 'components/utils/cheatDataUtils.js';
const itemSet = {  // 图表series配置除数据以外的其他配置项
  today: {
    name: '今日',
    type: 'line',
    itemStyle: {
      normal: {
        color: '#73cfca',
        borderWidth: 4
      }
    }
  },
  yesterday: {
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
    }
  },
  before7days: {
    name: '历史7日',
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
    }
  },
  lastDay: {
    name: '上周同日',
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
    }
  }
};

export default {
  data() {
    return {
      itemSet: itemSet
    };
  },
  methods: {
    init(obj) {
      this.myChart = echarts.init(document.getElementById('main'));
      let axisData = ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'];
      let seriesData = Object.values(obj.data).map(ele => ele.data);
      let series = Object.values(obj.data);
      this.myChart.setOption({
        title: {
          text: obj.name,
          textAlign: 'center',
          textStyle: {
            fontSize: 20,
            fontFamily: 'HiraginoSansGB-W3',
            color: '#444',
            fontWeight: 400
          },
          subtextStyle: {
            fontSize: 18,
            color: '#444'
          },
          left: '50%',
          itemGap: 5,
          subtext: this._fixNum(obj.total)
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet[k].name),
          bottom: 20
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            // 合计
            let axisitem = params[0].axisValueLabel;
            // 计算下标
            let getIndex = axisData.findIndex((ele) => ele === axisitem);
            // 对每个总数求和
            let paramsTotal = [];
            let tpl = '';
            seriesData.forEach(ele => {
              paramsTotal.push(ele.slice(0, getIndex + 1).reduce((x, y) => x + y));
            });
            if (params.length === 3) {
              params.forEach(function(item, index) {
                tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                ${item.seriesName} : ${_fixNum(item.value, 0)} (累计: ${_fixNum(paramsTotal[index + 1], 0)})<br/>`;
              });
            } else {
              params.forEach(function(item, index) {
                tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                ${item.seriesName} : ${_fixNum(item.value, 0)} (累计: ${_fixNum(paramsTotal[index], 0)})<br/>`;
              });
            }

            return params[0].name + '<br/>' + tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            interval: 5
          },
          axisLabel: {
            interval: 5
          },
          data: ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00']
        },
        yAxis: [{
          // minInterval: 100,
          name: '单位： 无',
          nameTextStyle: {
            color: '#444'
          },
          nameLocation: 'end',
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              if (value > 100000) {
                return (value / 1000) + 'k';
              }
              return value;
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        }, {
          minInterval: 100,
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              return value / 1000 + 'k';
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        }],
        series: series
      });
      window.onresize = this.myChart.resize;
    },
    updateCharts(index) {
      let obj = this.newTableList[index];
      let axisData = ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'];
      let seriesData = Object.values(obj.data).map(ele => ele.data);
      let series = Object.values(obj.data);
      this.myChart.setOption({
        title: {
          text: obj.name,
          subtext: this._fixNum(obj.total)
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            if (index === 0) {
               // 合计
              let axisitem = params[0].axisValueLabel;
              // 计算下标
              let getIndex = axisData.findIndex((ele) => ele === axisitem);
              // 对每个总数求和
              let paramsTotal = [];
              let tpl = '';
              seriesData.forEach(ele => {
                paramsTotal.push(ele.slice(0, getIndex + 1).reduce((x, y) => x + y));
              });
              if (params.length === 3) {
                params.forEach(function(item, index) {
                  tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                  ${item.seriesName} : ${_fixNum(item.value, 0)} (累计: ${_fixNum(paramsTotal[index + 1], 0)})<br/>`;
                });
              } else {
                params.forEach(function(item, index) {
                  tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                  ${item.seriesName} : ${_fixNum(item.value, 0)} (累计: ${_fixNum(paramsTotal[index], 0)})<br/>`;
                });
              }
              return params[0].name + '<br/>' + tpl;
            } else {
              let tpl = '';
              params.forEach(function(item, index) {
                tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                ${item.seriesName} : ${_fixNum(item.value, 0)}<br/>`;
              });
              return params[0].name + '<br/>' + tpl;
            }
          }
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet[k].name)
        },
        series: series
      });
    },
    _fixNum(num) {
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
        return num + fix;
      }
      return num;
    }
  }
};
