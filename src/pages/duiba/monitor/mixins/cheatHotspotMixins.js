import echarts from 'echarts';

export default {
  ready() {
    this.resourcesline = echarts.init(document.getElementById(this.lineId));
    this.renderLineChart([]);
  },
  methods: {
    renderLineChart(obj) {
      this.resourcesline.setOption({
        legend: {
          data: obj.map(k => k.name),
          bottom: 0
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let tpl = '';
            let self = this;
            params.forEach(function(item, index) {
              if (index === 0) {
                tpl += item.axisValue + '<br/>';
              }
              let name = item.seriesName;
              let data = item.data === '-' ? '无转化数据' : item.data;
              if (self.selectQuota === 'uvClickRate' || self.selectQuota === 'pvClickRate' || self.selectQuota === 'wastageRate' || self.selectQuota === 'mainmeetRate') {
                if (data !== '无转化数据') {
                  data = parseFloat((data * 100).toPrecision(12)) + '%';
                }
              }
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + self._fixNum(data) + '<br/>';
            });
            return tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
        }],
        series: obj
      }, true);
      let myChart = this.resourcesline;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
};
