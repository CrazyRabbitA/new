import echarts from 'echarts';
import 'echarts/map/js/china.js';
export default {
  data() {
    return {};
  },
  ready() {
    this.mapChart = echarts.init(document.getElementById(this.mapId));
  },
  methods: {
    renderMapChart(obj) {
      this.mapChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          seriesIndex: 0,
          min: 0,
          max: 2500,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true
        },
        series: [{
          zlevel: 1,
          name: '中国',
          type: 'map',
          mapType: 'china',
          selectedMode: 'multiple',
          zoom: 1,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          data: obj
        }]
      }, true);
      let myChart = this.mapChart;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
};
