import echarts from 'echarts';
import { _fixNum } from 'components/utils/cheatDataUtils';

export default {
  mixins: [_fixNum],
  data() {
    return {
      formatToolTipType: 5
    };
  },
  ready() {
    this.resourcesline = echarts.init(document.getElementById(this.chartQueryId));
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
              let name = item.seriesName.split('：')[0];
              let data = item.data === '-' ? '无转化数据' : item.data;
              // 格式化
              data = self.formatToolTip(data);
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '<br/>';
            });
            return tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Object.keys(this.obj.extraDate)
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
