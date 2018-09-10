import echarts from 'echarts';
export default {
  ready() {
    this.barChart = echarts.init(document.getElementById(this.chartId));
  },
  methods: {
    renderChart(obj, xData) {
      if (this.dataObj.chartType === 'apps' || this.dataObj.chartType === 'slot') {
        this.barChart.dispose();
        this.barChart = echarts.init(document.getElementById(this.chartId));
      }
      this.barChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            let tpl = '';
            params.forEach(function(item, index) {
              if (index === 0) {
                tpl += item.axisValue + '<br/>';
              }
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.data.barName + '<br/>';
            });
            return tpl;
          }
        },
        grid: {
          top: '12%',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: true
          }

        },
        yAxis: {
          type: 'value',
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {show: false}
        },
        series: [
          {
            type: 'bar',
            barWidth: this.classObject.barWidth,
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#000'
                },
                formatter: (params) => {
                  return params.data.barName;
                }
              }
            },
            data: obj
          }]
      }, true);
      let myChart = this.barChart;
      let self = this;
      myChart.on('click', function(params) {
        let hasInit;
        if (self.idx(params.data.id, self.checkList) !== -1) {
          hasInit = true;
        } else {
          hasInit = false;
        }
        if (hasInit) {
          self.removeItem(params.data.id, self.checkList);
        } else {
          self.checkList.push(params.data.id);
        }
        self.selectChange();
      });
      setTimeout(() => {
        if (myChart && myChart.resize && !this.isFetchData || this.isFirstFetchData) {
          this.isFirstFetchData = false;
          this.isFetchData = false;
          myChart.resize();
        } else {
          this.isFirstFetchData = false;
          this.isFetchData = false;
        }
      }, 100);
      if (this.dataObj.chartType !== 'apps' || this.dataObj.chartType !== 'slot') {
        window.addEventListener('resize', function() {
          if (myChart && myChart.resize) {
            myChart.resize();
          }
        });
      }
    }
  }
};
