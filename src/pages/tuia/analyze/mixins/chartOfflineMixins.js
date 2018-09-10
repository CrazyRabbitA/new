import echarts from 'echarts';
import {_fixNum} from 'components/utils/cheatDataUtils';
export default {
  ready() {
    this.resourcesline = echarts.init(document.getElementById(this.lineId));
  },
  methods: {
    format(data) {
      return _fixNum(data, 3);
    },
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
              let data = item.data === '-' ? '无记录' : item.data;
              if (data !== '无记录') {
                if (item.seriesName === '广告位点击率' || item.seriesName === '广告位点击率' || item.seriesName === '参与率' || item.seriesName === '请求成功率' || item.seriesName === '发券成功率' || item.seriesName === '广告券点击率' || item.seriesName === '广告券点击率' || item.seriesName === '分成比例' || item.seriesName === '付费券占比' || item.seriesName === '付费券点击率') {
                  data = parseFloat((Number(data) * 100).toPrecision(12)) + '%';
                  tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '<br/>';
                } else if (item.seriesName === '每UV发券' || item.seriesName === '每UV券请求' || item.seriesName === '每UV券点击' || item.seriesName === '付费券点击单价' ||
                  item.seriesName === '广告券点击单价' || item.seriesName === '发券ARPU值' || item.seriesName === '付费券arpu值' || item.seriesName === '付费券arpu值' ||
                  item.seriesName === 'UV单价（元）' || item.seriesName === '媒体UV单价（元）' || item.seriesName === '活动点击单价' || item.seriesName === '媒体点击单价') {
                  tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + self.format(data) + '<br/>';
                } else {
                  tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + self._fixNum(data) + '<br/>';
                }
              } else {
                tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '<br/>';
              }
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
