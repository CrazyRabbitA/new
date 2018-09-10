import echarts from 'echarts';

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
  extradate: {
    name: '额外日期',
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
  ready() {
    this.lineChart = echarts.init(document.getElementById('mainline'));
  },
  methods: {
    renderLineChart(obj) {
      this.lineChart.setOption({
        legend: {
          data: Object.keys(this.showNewListForLine).map(k => this.itemSet[k].name),
          bottom: 20
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let tpl = params[0].axisValueLabel + '<br/>';
            let self = this;
            params.forEach(function(item, index) {
              let data = item.data === '-' ? '无转化数据' : item.data;
              if (self.selectDimension === 'advertClickRate' || self.selectDimension === 'participateRate' || self.selectDimension === 'requestParticipateRate' || self.selectDimension === 'launchRequestRate' || self.selectDimension === 'clickExposureRate' || self.selectDimension === 'actParticipateRate' || self.selectDimension === 'ctr' || self.selectDimension === 'plpPlc') {
                if (data !== '无转化数据') {
                  data = parseFloat((data * 100).toPrecision(12)) + '%';
                }
              }
              let name = item.seriesName;
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + self._fixNum(data) + '<br/>';
            });
            return tpl;
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
        series: Object.values(this.showNewListForLine)
      }, true);
      let myCHart = this.lineChart;
      window.addEventListener('resize', function() {
        myCHart.resize();
      });
    }
  }
};
