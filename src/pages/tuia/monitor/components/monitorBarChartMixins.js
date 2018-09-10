import echarts from 'echarts';
export default {
  ready() {
    this.barChart = echarts.init(document.getElementById(this.chartId));
  },
  methods: {
    renderChart(obj) {
      /* 活动维度  和 活动+广告位 ， 活动+媒体 维度， 没有 广告位访问(UV) 数据，不展示此数据 */
      let renderData = [].concat(obj);
      if (!this.isShowSdkUv && this.selectDimension === 'visit') {
        renderData.splice(4, 1);
      }
      /* 左侧柱状图朝左显示 */
      if (this.isLeftChart) {
        renderData.forEach((item) => {
          item.data[0] = -item.data[0];
        });
      }
      this.barChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let name = params.seriesName;
            let showPercent = this.percent[params.seriesIndex] + '%';
            let tpl = name + '<br/>' + this._fixNum(Math.abs(params.data)) + '(' + showPercent + ')';
            return tpl;
          }
        },
        legend: {
          data: renderData.map(k => k.name)
        },
        grid: {
          top: '4%',
          left: '16%',
          right: '12%',
          bottom: '3%',
          containLabel: false
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: false,
          axisLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false}
        },
        yAxis: {
          type: 'category',
          axisLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          splitLine: {show: false},
          position: 'right',
          data: [this.selectDimension]
        },
        series: renderData
      }, true);
      let myChart = this.barChart;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
};
