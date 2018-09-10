import echarts from 'echarts';
import {_fixNum, getPrecent} from 'components/utils/cheatDataUtils.js';
const itemSet = {  // 图表series配置除数据以外的其他配置项
  target: {
    name: '目标数',
    type: 'line',
    itemStyle: {
      normal: {
        color: '#73cfca',
        borderWidth: 4
      }
    }
  },
  KACt: {
    name: 'KA数',
    type: 'line',
    itemStyle: {
      normal: {
        color: '#ff9090',
        borderWidth: 4
      }
    }
  },
  estiKACt: {
    name: '潜力KA数',
    type: 'line',
    itemStyle: {
      normal: {
        color: '#60a4e8',
        borderWidth: 4
      }
    }
  },
  eastKACt: {
    name: '华东KA总数',
    type: 'line',
    itemStyle: {
      normal: {
        color: '#ffc61a',
        borderWidth: 4
      }
    }
  },
  eastEstiKACt: {
    name: '华东潜力KA数',
    type: 'line',
    itemStyle: {
      normal: {
        color: '#ff7746',
        borderWidth: 4
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
    handleData(allData) {
      let endObj = [];
      for (var i in allData) {
        var obj = {datas: []};
        obj.value = allData[i]['value'];
        obj.percent = allData[i].percent;
        obj.estiKACt = allData[i].estiKACt;
        obj.eastKACt = allData[i].eastKACt;
        obj.eastEstiKACt = allData[i].eastEstiKACt;
        obj.datas[0] = allData[i]['percent'];
        endObj.push(obj);
      }
      return endObj;
    },
    init(obj, allData) {
      this.myChart = echarts.init(document.getElementById('main'));
      let series = Object.values(obj.data);
      series[0].data = this.handleData(allData);
      let xAxisData = Object.values(obj.data)[0].time;
      this.myChart.setOption({
        title: {
          text: '',
          textAlign: 'center',
          left: '50%',
          itemGap: 5
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet[k].name),
          bottom: 8
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let tpl = '';
            params.forEach(function(item, index) {
              tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
              ${item.seriesName} : ${_fixNum(item.value, 0)}<br/>
              `;
              if (index === 4) {
                tpl += `完成度 : ${getPrecent(params[0].data.percent)}<br/>
                `;
              }
            });
            return params[0].name + '<br/>' + tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            interval: 5
          },
          data: xAxisData
        },
        yAxis: [{
          // minInterval: 100,
          name: '',
          nameTextStyle: {
            color: '#444'
          },
          nameLocation: 'end',
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          max: 70,
          axisLabel: {
            formatter: function(value, index) {
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
              color: 'red'
            }
          }
        }],
        series: series
      });
      window.onresize = this.myChart.resize;
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
