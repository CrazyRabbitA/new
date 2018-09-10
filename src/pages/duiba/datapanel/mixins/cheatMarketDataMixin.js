import echarts from 'echarts';

export default {
  data() {
    return {
    };
  },
  ready() {
    this.resourcesline = echarts.init(document.getElementById('marketDataLine'));
  },
  methods: {
    renderLineChart(obj, xdata) {
      this.resourcesline.setOption({
        legend: {
          data: [obj.name],
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
              if (self.selectQuota === 'ctr' || self.selectQuota === 'launchSuccessRate') {
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
          data: xdata
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
