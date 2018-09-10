import echarts from 'echarts';

export default {
  data() {
    return {
    };
  },
  ready() {
    this.resourcesline = echarts.init(document.getElementById('advTimeChart'));
  },
  methods: {
    renderLineChart(obj) {
      let self = this;
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
              let data = item.data;
              if (self.curQuota === 'orderRate' || self.curQuota === 'clickRate') {
                data = parseFloat((data * 100).toPrecision(12)).toFixed(2) + '%';
              }
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + self._fixNum(data) + '<br/>';
            });
            return tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['00-01', '00-02', '00-03', '00-04', '00-05', '00-06', '00-07', '00-08', '00-09', '00-10', '00-11', '00-12', '00-13', '00-14', '00-15', '00-16', '00-17', '00-18', '00-19', '00-20', '00-21', '00-22', '00-23', '00-24']
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
              if (self.curQuota !== 'clickRate' && self.curQuota !== 'orderRate') {
                if (value > 100000) {
                  return (value / 1000) + 'k';
                }
                return value;
              } else {
                return parseFloat((value * 100).toPrecision(12)) + '%';
              }
            },
            margin: 12,
            textStyle: {
              color: '#444'
            },
            showMinLabel: false
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
