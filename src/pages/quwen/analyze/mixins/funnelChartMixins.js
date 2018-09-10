import echarts from 'echarts';

export default {
  ready() {
    this.lineChart = echarts.init(document.getElementById(this.chartId));
  },
  methods: {
    renderFunnelChart(obj) {
      this.lineChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              return `<p style="text-align:left">漏斗图</p>${params.data.name}${obj.legendData[params.dataIndex]}  (${obj.tipData[params.dataIndex]}%)`;
            }
          },
          legend: {
            data: ['APP启动用户数', '登录用户数', '阅读文章/观看视频数', '阅读文章/观看视频金币发放用户数', '提现用户数'],
            bottom: 0
          },
          calculable: true,
          series: [
            {
              name: '漏斗图',
              type: 'funnel',
              left: '10%',
              top: 60,
              bottom: 60,
              width: '50%',
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort: 'none',
              gap: 2,
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: function(params) {
                    return `${params.data.name}\n${obj.legendData[params.dataIndex]}  (${obj.tipData[params.dataIndex]}%)`;
                  }
                }
              },
              data: obj.data
            }
          ]
        },
        true
      );
      let myChart = this.lineChart;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    },
    renderLineChart(obj) {
      this.lineChart.setOption({
        legend: {
          data: obj.map(k => k.name),
          bottom: 0
        },
        grid: {
          height: '60%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let tpl = '';
            params.forEach(function(item, index) {
              if (index === 0) {
                tpl += item.axisValue + '<br/>';
              }
              let name = item.seriesName;
              let data = item.data === '-' ? '无转化数据' : item.data;
              // 格式化 第几个指标
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '%<br/>';
            });
            return `<div style="text-align:left">${tpl}<div>`;
          }
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Object.keys(this.data.lineChart)
        },
        series: obj
      }, true);
      let myChart = this.lineChart;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
};
