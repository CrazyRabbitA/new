import echarts from 'echarts';
import { _fixNum } from 'components/utils/cheatDataUtils';

export default {
  data() {
    return {};
  },
  methods: {
    chartInit(totalData, key, name) {
      let arr = [];
      for (let value in totalData) {
        arr.push(totalData[value][key]);
      }
      // 基于准备好的dom，初始化echarts实例
      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('roiMain'));
      }
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: ''
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
              let data = item.data;
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + _fixNum(data) + '<br/>';
            });
            return tpl;
          }
        },
        legend: {
          data: [name],
          bottom: 0
        },
        xAxis: {
          data: Object.keys(totalData)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: name,
          type: 'line',
          data: arr,
          itemStyle: {
            normal: {
              color: '#fda228',
              borderWidth: 4
            }
          }
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
    updateChart(totalData, key, name) {

    }
  }
};
