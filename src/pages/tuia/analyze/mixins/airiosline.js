import echarts from 'echarts';
import { _fixNum, fixNum } from '../../../../components/utils/cheatDataUtils.js';
export default {
  ready() {},
  methods: {
    airiosline(data) {
      const airpieyesChart = echarts.init(document.getElementById('airiosline'));
      const xAxisData = Object.keys(data.launchAll);
      const seriesData = [
        {
          name: '剩余发券',
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter(val) {
                return fixNum(val.value, 0);
              }
            }
          },
          areaStyle: {
            normal: {
              color: '#b43532'
            }
          },
          data: Object.values(data.launchAll)
        },
        {
          name: '大盘发券',
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter(val) {
                return fixNum(val.value, 0);
              }
            }
          },
          areaStyle: {
            normal: {
              color: '#356eb2'
            }
          },
          data: Object.values(data.launchPv)
        }
      ];
      const options = {
        title: {
          text: 'IOS发券',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter(val) {
            let dataMax, dataMin;
            let name = val[0].name;
            if (val.length > 1) {
              val.forEach(ele => {
                if (ele.seriesName === '剩余发券') {
                  dataMax = ele.value;
                } else {
                  dataMin = ele.value;
                }
              });
              let tpl = '';
              let data = _fixNum((dataMax - dataMin), 0);
              tpl = name + '</br>' + '剩余发券' + '：' + data + '<br/>';
              return tpl;
            } else {
              if (val[0].seriesName === '大盘发券') {
                let tpl = '';
                let data = _fixNum(val[0].value, 0);
                tpl = name + '</br>' + '大盘发券' + '：' + data + '<br/>';
                return tpl;
              } else {
                let tpl = '';
                let data = _fixNum(val[0].value, 0);
                tpl = name + '</br>' + '剩余发券' + '：' + data + '<br/>';
                return tpl;
              }
            }
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color: [ '#b43532', '#356eb2' ],
        // legend: {
        //   icon: 'rect',
        //   itemWidth: 20,
        //   itemHeight: 10,
        //   itemGap: 10,
        //   left: 'center',
        //   bottom: 20,
        //   data: [{
        //     name: '大盘发券'
        //   }, {
        //     name: '剩余发券'
        //   } ]
        // },
        grid: {
          left: '50px',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesData
      };
      airpieyesChart.setOption(options);
    }
  }
};
