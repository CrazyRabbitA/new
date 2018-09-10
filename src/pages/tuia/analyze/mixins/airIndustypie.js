import echarts from 'echarts';
import { _fixNum } from '../../../../components/utils/cheatDataUtils.js';
export default {
  methods: {
    airIndustypie(data) {
      const airpieyesChart = echarts.init(document.getElementById('airIndustypie'));
      const options = {
        title: {
          text: '实际消耗',
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
        legend: {
          left: 'right',
          bottom: 20,
          data: data.map(ele => ele.name)
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '45%',
            center: [
              '50%', '45%'
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
