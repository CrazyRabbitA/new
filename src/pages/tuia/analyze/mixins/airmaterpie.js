import echarts from 'echarts';
import { _fixNum } from '../../../../components/utils/cheatDataUtils.js';
export default {
  ready() {},
  methods: {
    initmasterchart(data) {
      const airpieyesChart = echarts.init(document.getElementById('airmasterpie'));
      const options = {
        title: {
          text: 'KA广告主消耗占比',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter(val) {
            const eleval = _fixNum(val.data.value);
            let tpl = '';
            tpl = `${val.data.name}:${eleval}(${val.percent}%)`;
            return tpl;
          }
        },
        color: ['#749F83', '#D48265'],
        legend: {
          left: 'center',
          bottom: 20,
          data: data.map(ele => ele.name)
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '60%',
            center: [
              '50%', '40%'
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
