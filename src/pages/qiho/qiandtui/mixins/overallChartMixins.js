import echarts from 'echarts';

const colorArr = ['#73cfca', '#ff9090', '#ffbc1c'];

const itemSet = {  // 图表series配置除数据以外的其他配置项
  orderCount: {
    name: '下单量',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[0],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'solid'
      }
    }
  },
  issueCount: {
    name: '出单量',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[1],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'dashed'
      }
    }
  },
  clickRate: {
    name: '点击率',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[0],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'solid'
      }
    }
  },
  orderRate: {
    name: '下单率',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[0],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'solid'
      }
    }
  },
  onedayAllRate: {
    name: '次日签收率',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[0],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'solid'
      }
    }
  },
  threedayAllRate: {
    name: '三日签收率',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[1],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'dashed'
      }
    }
  },
  successRate: {
    name: '总签收率',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[2],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'dotted'
      }
    }
  },
  itemRoi: {
    name: 'ROI',
    type: 'line',
    itemStyle: {
      normal: {
        color: colorArr[0],
        borderWidth: 4
      }
    },
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      normal: {
        width: 3,
        type: 'solid'
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
    resizeEchartDom: function() {
      let contentWidth = document.getElementsByClassName('page-title')[0].clientWidth;
      let echartsDoms = document.getElementsByClassName('echart')[this.curChart];
      if (echartsDoms) {
        echartsDoms.style.width = parseInt(contentWidth) + 'px';
      }
    },
    init(obj, canvasId) {
      // 获取页面主内容宽度
      this.resizeEchartDom();
      let self = this;
      let chartDom = document.getElementById(canvasId);
      let chartInstance = echarts.getInstanceByDom(chartDom);
      if (chartInstance) {
        echarts.dispose(chartInstance);
      }
      this.myChart = echarts.init(chartDom);
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
          left: '45%',
          top: '10px',
          itemGap: 5
        },
        grid: {
          top: 100,
          left: '8%',
          right: '8%',
          bottom: 80
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet[k].name),
          bottom: 10,
          left: '40%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
            let content = '';
            let unit;
            if (params.length > 0) {
              content = params[0].axisValue + '<br>';
            }
            for (let item of params) {
              unit = '';
              // tooltip 对于各种利率显示%单位
              if (item.seriesName.indexOf('率') > 0) {
                unit = '%';
              }
              content += item.marker + item.seriesName + '：' + item.data + unit + '<br>';
            }
            return content;
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
            interval: 0
          },
          axisLabel: {
            interval: 0
          },
          data: obj.yxisArr,
          boundaryGap: true
        },
        yAxis: [{
          // name: '单位：无',
          nameGap: 30,
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
              if (obj.key === 'orderCountChart' || obj.key === 'ROIChart') {
                if (value > 100000) {
                  return (value / 1000) + 'k';
                }
                return value;
              } else {
                return value + '%';
              }
            },
            margin: 12,
            textStyle: {
              color: '#444'
            },
            showMinLabel: false
          }
        }],
        series: Object.values(obj.data)
      });
      window.onresize = function() {
        // 窗口大小变化时需要重新设置echart容器的宽度
        self.resizeEchartDom();
        self.myChart.resize();
      };
    },
    updateCharts(index) {
      let obj = this.newTableList[index];
      this.myChart.setOption({
        title: {
          text: obj.name,
          subtext: this._fixNum(obj.total)
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet[k].name)
        },
        series: Object.values(obj.data)
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
