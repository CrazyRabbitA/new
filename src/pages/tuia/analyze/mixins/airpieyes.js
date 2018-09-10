import echarts from 'echarts';
import { _fixNum } from '../../../../components/utils/cheatDataUtils.js';
export default {
  ready() {},
  methods: {
    inityeschart(data) {
      const airpieyesChart = echarts.init(document.getElementById('airpieyes'));
      const options = {
        tooltip: {
          trigger: 'item',
          formatter(val) {
            const eleval = _fixNum(val.data.value);
            let tpl = '';
            tpl = `${val.data.name}:${eleval}(${val.percent}%)`;
            return tpl;
          }
        },
        legend: {
          left: 'right',
          bottom: 10,
          data: data.map(ele => ele.name)
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: [
              '45%', '40%'
            ],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      airpieyesChart.setOption(options);
    }
  }

};
