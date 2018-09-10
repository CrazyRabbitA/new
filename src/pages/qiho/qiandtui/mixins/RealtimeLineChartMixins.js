import echarts from 'echarts';

export default {
  data() {
    return {
    };
  },
  ready() {
    this.resourcesline = echarts.init(document.getElementById('lineTotalChart'));
    this.resourcesScatter = echarts.init(document.getElementById('scatterTimeChart'));
  },
  methods: {
    renderLineChart(obj) {
      obj.map(k => k.data.unshift(''));
      let self = this;
      this.resourcesline.setOption({
        title: {
          text: '图1: 各个时间段累积数据对比图',
          left: 'center'
        },
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
                tpl += self.params.extraDate + ' ' + item.axisValue + '<br/>';
              }
              let name = item.seriesName;
              let data = item.data;
              if (self.curLineQuota === 'cvr' || self.curLineQuota === 'ctr') {
                data = parseFloat((data * 100).toPrecision(12)).toFixed(2) + '%';
              }
              let newData = data;
              let y = false;
              let tDate = null;
              if (name !== '当天累积') {
                params.forEach((ite) => {
                  if (ite.seriesName === '当天累积') {
                    y = true;
                    tDate = ite.data;
                  }
                });
                if (!y) {
                  tDate = 0;
                }
                newData = tDate - newData;
              }
              newData = self._fixNum(newData);
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + newData + '<br/>';
            });
            return tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['00:00', '00-00:30', '00-01', '00-01:30', '00-02', '00-02:30', '00-03', '00-03:30', '00-04', '00-04:30', '00-05', '00-05:30', '00-06', '00-06:30', '00-07', '00-07:30', '00-08', '00-08:30', '00-09', '00-09:30', '00-10', '00-10:30', '00-11', '00-11:30', '00-12', '00-12:30', '00-13', '00-13:30', '00-14', '00-14:30', '00-15', '00-15:30', '00-16', '00-16:30', '00-17', '00-17:30', '00-18', '00-18:30', '00-19', '00-19:30', '00-20', '00-20:30', '00-21', '00-21:30', '00-22', '00-22:30', '00-23', '00-23:30', '00-24']
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
              if (self.curLineQuota !== 'ctr' && self.curLineQuota !== 'cvr') {
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
    },
    renderScatterChart(obj) {
      obj.map(k => k.data.unshift(''));
      let self = this;
      this.resourcesScatter.setOption({
        title: {
          text: '图2: 各个时间段数据对比图',
          left: 'center'
        },
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
                tpl += self.params.extraDate + ' ' + item.axisValue + '<br/>';
              }
              let name = item.seriesName;
              let data = item.data;
              let newData = data;
              // 标记是否有当天数据，true是有，false没有
              let y = false;
              let tDate = null;
              if (name !== '当前时段') {
                params.forEach((ite) => {
                  if (ite.seriesName === '当前时段') {
                    // 当前时间点上有当天数据
                    y = true;
                    // 有当天数据tDate=当天数据
                    tDate = ite.data;
                  }
                });
                if (!y) {
                  // 没当天数据tDate置为0
                  tDate = 0;
                }
                newData = tDate - newData;
              }
              if (self.curScatterQuota === 'cvr' || self.curScatterQuota === 'ctr') {
                newData = parseFloat((newData * 100).toPrecision(12)).toFixed(2) + '%';
              }
              newData = self._fixNum(newData);
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + newData + '<br/>';
            });
            return tpl;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: true
          },
          data: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00']
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
              if (self.curScatterQuota !== 'ctr' && self.curScatterQuota !== 'cvr') {
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
      let myChart = this.resourcesScatter;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
};
