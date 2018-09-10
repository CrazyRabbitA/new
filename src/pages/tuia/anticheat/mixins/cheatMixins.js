import echarts from 'echarts';
export default {
  data() {
    return {
      pieStyle: [ // 图表series data的配置除数据以外的其他配置项,按type排序
        {
          itemStyle: { // id
            normal: {
              color: '#f36969'
            },
            emphasis: {
              color: '#f36969'
            }
          }
        }, {
          itemStyle: { // 无
            normal: {
              color: '#ffbe5f'
            },
            emphasis: {
              color: '#ffbe5f'
            }
          }
        }, {
          itemStyle: { // 高
            normal: {
              color: '#52c79f'
            },
            emphasis: {
              color: '#52c79f'
            }
          }
        }, {
          itemStyle: { // 中
            normal: {
              color: '#659af0'
            },
            emphasis: {
              color: '#659af0'
            }
          }
        }, {
          itemStyle: {  // 低
            normal: {
              color: '#b9d4f4'
            },
            emphasis: {
              color: '#b9d4f4'
            }
          }
        }
      ]
    };
  },
  ready() {
    this.myChart = echarts.init(document.getElementById('main'));
  },
  methods: {
    thousands: function(val) {
      let result = Number(val);
      if (result) {
        val = val + '';
        let fix = ''; // 小数点情况
        if (val.includes('.')) {
          let splitArr = val.split('.');
          val = splitArr[0];
          fix = splitArr[1];
        }
        val = val.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
          return s + ',';
        });
        if (fix) {
          return val + '.' + fix;
        }
        return val + fix;
      }
      return val;
    },
    echartInit() {
      let {seriesPieData, seriesBarData, legendData, yAxisData, percentData} = this._getEchartsData();

      this.myChart.setOption({
        title: {
          text: '规则命中情况',
          textAlign: 'center',
          textStyle: {
            color: '#444',
            fontSize: 16
          },
          left: '75%',
          top: '10%'
        },
        legend: {
          orient: 'vertical',
          left: 0,
          top: 0,
          data: legendData
        },
        grid: {
          x: '65%',
          y: '20%',
          width: '30%',
          height: '40%'
        },
        xAxis: {
          gridIndex: 0,
          type: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let str = (percentData(params[0].dataIndex));
            // 表头信息
            return `${params[0].name}${this.thousands(params[0].value)}(${str})`;
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          gridIndex: 0,
          type: 'category',
          data: yAxisData
        },
        series: [
          {
            name: '风险等级',
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                return `${params.name}<br/>${this.thousands(params.value)}(${params.percent}%)`;
              }
            },
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['25%', '60%'],
            itemStyle: {
              normal: {
                shadowOffsetX: -10,
                shadowColor: 'rgba(0, 0, 0, 0.15)',
                shadowBlur: 10
              }
            },
            data: seriesPieData
          },
        // 树状图
          {
            name: '规则命中情况',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#93dbd7'
              }
            },
            data: seriesBarData
          }]
      }, true);
      window.onresize = this.myChart.resize;
    },
    updateCharts() {
      let {seriesPieData, seriesBarData, legendData, yAxisData} = this._getEchartsData();
      this.myChart.setOption({
        legend: {
          data: legendData
        },
        yAxis: {
          data: yAxisData
        },
        series: [{
          data: seriesPieData
        }, {
          data: seriesBarData
        }]
      });
    },
    _getEchartsData() {
      // 饼状图数据
      let seriesPieData = this._echartsDate().pieSeriesData();
      let legendData = this._echartsDate().pieLegendData();
      // 柱状图数据
      let yAxisData = this._echartsDate().barHitruleDate().name;
      let seriesBarData = this._echartsDate().barHitruleDate().data;
      let percentData = this._echartsDate().hitrulePerData;
      return {
        seriesPieData,
        seriesBarData,
        legendData,
        yAxisData,
        percentData
      };
    },
    //
    _echartsDate() {
      return {
        // 表头
        pieLegendData: () => {
          // const datas = this.datas.clickTable.map((item) => {
          //   return {
          //     name: item.cheatTag
          //   };
          // });
          // const newdata = datas.filter((ele) => {
          //   return ele.name === "高风险"||ele.name === "中风险"||ele.name === "低风险";
          // });
          // return newdata;
        },
        // 饼状图数据
        pieSeriesData: () => {
          let data = [];
          // 赋值--固定格式
          let pieDatas = this.datas.clickTable;
          pieDatas.forEach((ele, index) => {
            let name, value;
            name = ele.cheatTag;
            value = ele.adConsume;
            data.push(
            Object.assign({}, {
              name,
              value
            }, this.pieStyle[index])
          );
          });
          // 去掉总计
          const newdata = data.filter((ele) => {
            return ele.name === '高风险' || ele.name === '中风险' || ele.name === '低风险';
          });
          return newdata;
        },
        // { [name], [value]}
        // 柱状图数据
        barHitruleDate: () => {
          if (this.datas.dimensionClickTable) {
            return {
              name: this.datas.dimensionClickTable.map((item) => {
                return item.dtype;
              }),
              data: this.datas.dimensionClickTable.map((item) => item.adConsume)
            };
          }
          return {
            name: [],
            data: []
          };
        },
        hitrulePerData: (index) => {
          const hitrule = this.datas.dimensionClickTable.map(ele => ele.adConsumePercent);
          return hitrule[index];
        }
      };
    }

  }
};
