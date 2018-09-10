import echarts from 'echarts';
import { _fixNum } from 'components/utils/cheatDataUtils';

export default {
  data() {
    return {};
  },
  methods: {
    chartInit(totalData, key, name, color) {
      let arr = [];
      for (let value in totalData) {
        arr.push(totalData[value][key]);
      }
      // 基于准备好的dom，初始化echarts实例
      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('main'));
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
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + _fixNum(data, 0) + '<br/>';
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
        yAxis: {},
        series: [{
          name,
          type: 'line',
          data: arr,
          itemStyle: {
            normal: {
              color,
              borderWidth: 4
            }
          }
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
      // window.onresize = this.myChart.resize;
    },
    updateChart(totalData, key, name, color) {
      let arr = [];
      let yAxisObj;
      if (key === 'dayStayRate' || key === 'weekStayRate') {
        for (let value in totalData) {
          arr.push(totalData[value][key] * 100);
        }
        yAxisObj = {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        };
      } else {
        for (let value in totalData) {
          arr.push(totalData[value][key]);
        }
        yAxisObj = {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        };
      }
      const option = {
        xAxis: {
          data: Object.keys(totalData)
        },
        legend: {
          data: [name]
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
              if (key === 'dayStayRate' || key === 'weekStayRate') {
                data = parseFloat((data).toPrecision(12)).toFixed(2) + '%';
                tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '<br/>';
              } else if (key === 'activityUser' || key === 'newUser' || key === 'issueCoin') {
                tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + _fixNum(data, 0) + '<br/>';
              } else {
                tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + _fixNum(data) + '<br/>';
              }
            });
            return tpl;
          }
        },
        yAxis: yAxisObj,
        series: [{
          name: name,
          type: 'line',
          data: arr,
          itemStyle: {
            normal: {
              color: color,
              borderWidth: 4
            }
          }
        }]
      };
      this.myChart.setOption(option);
    }
  }
};
