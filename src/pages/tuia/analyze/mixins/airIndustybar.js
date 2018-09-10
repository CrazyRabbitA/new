import echarts from 'echarts';

export default {
  ready() {},
  methods: {
    airIndustybar(data) {
      const airpieyesChart = echarts.init(document.getElementById('airIndustybar'));
      const legendData = Object.keys(data.consumeTotal);
      const seriesData = [

        {
          data: Object.values(data.consumeTotal),
          type: 'bar',
          name: '实际消耗',
          barWidth: '20px',
          label: {
            normal: {
                // show: true,
                // position:'top'
            }
          }
        },
        {
          data: Object.values(data.estiConsume),
          type: 'bar',
          name: '预计消耗',
          barWidth: '20px',
          label: {
            normal: {
              // show: true,
              // position:'top'
            }
          }
        }
      ];
      const options = {
        title: {
          text: '广告综合行业表现',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          show: true
        },
        grid: {
          left: '50px',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        legend: {
          left: 'center',
          bottom: 20,
          data: ['实际消耗', '预计消耗'],
          tooltip: {
            show: true
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          nameLocation: 'end', // 坐标轴名称显示位置。
          axisLabel: {// 坐标轴刻度标签的相关设置。
            interval: 0,
            rotate: '45'
          },
          offset: 0,
          data: legendData
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      };
      airpieyesChart.setOption(options);
    }
  }
};
