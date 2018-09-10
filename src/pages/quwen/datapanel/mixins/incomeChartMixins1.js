import echarts from 'echarts';
const colorArr = [
  '#60a4e8',
  '#2ac993',
  '#ff5b5b',
  '#fe8002',
  '#ffbf55',
  '#73cfca',
  '#8291d9'
];
export default {
  data() {
    return {
      itemSet1: {}
    };
  },
  methods: {
    init1(obj) {
      const keyval = Object.keys(obj.data);
      let objData = {};
      keyval.forEach((ele, index) => {
        objData[ele] = {
          name: ele,
          type: 'line',
          itemStyle: {
            normal: {
              color: colorArr[index],
              borderWidth: 4
            }
          },
          lineStyle: {
            // normal: {
            //   type: 'dashed'
            // }
          }
        };
      });
      this.itemSet1 = objData;
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(document.getElementById('main'));
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
          subtext: this._fixNum1(obj.total)
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet1[k].name),
          bottom: 0
        },
        tooltip: {
          trigger: 'axis'
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
        series: Object.values(obj.data)
      });
      window.onresize = this.myChart.resize;
    },
    updateCharts1(index) {
      let obj = this.newTableList1[index];
      Object.keys(obj.data).map(k => { this.itemSet1[k].name; });
      this.myChart.setOption({
        title: {
          text: obj.name,
          subtext: this._fixNum1(obj.total)
        },
        legend: {
          data: Object.keys(obj.data).map(k => this.itemSet1[k].name)
        },

        series: Object.values(obj.data)
      });
    },
    _fixNum1(num) {
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
