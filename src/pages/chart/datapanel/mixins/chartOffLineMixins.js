import echarts from 'echarts';

export default {
  ready() {
    this.resourcesline = echarts.init(document.getElementById('offline'));
  },
  methods: {
    renderLineChart(dataList, xData, yData) {
      this.resourcesline.setOption({
        legend: {
          data: dataList.map(k => k.name),
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
              // 格式化 第几个指标
              data = self.formatToolTip(data, params[index].seriesIndex);
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '<br/>';
            });
            return tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: yData,
        series: dataList
      }, true);
      let myChart = this.resourcesline;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
};
