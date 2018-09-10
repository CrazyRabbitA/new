<template>
<div class="advertpanel-container">
  <h2 v-if="!datas">该查询条件下饼图暂无数据！</h2>
  <div v-if="datas" class="advertpanel" id="advertpie">
  </div>
</div>
</template>
<script>
  import {_fixNum} from 'components/utils/cheatDataUtils.js';
  import echarts from 'echarts';
  export default {
    props: {
      datas: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
      };
    },
    methods: {
      _initchart(val) {
        const legendData = val.map((ele) => ele.name);
        const seriesData = val.map((ele) => {
          return {
            name: ele.name,
            value: ele.value
          };
        });
        const options = {
          grid: {
            left: '1%',
            bottom: '15%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            formatter(params) {
              // 判断整数还是小数
              let tpl = '';
              tpl = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ${params.color}"></span>` +
              `${params.name} :${_fixNum(params.value, 0)} (${params.percent}%)`;
              return tpl;
            }
          },
          legend: {
            data: legendData,
            bottom: 'bottom'
          },
          series: [
            {
              // name:,
              type: 'pie',
              radius: ['40%', '60%'],
              center: ['50%', '45%'],
              data: seriesData,
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
        this.chart.setOption(options);
      }
    },
    watch: {
      'datas': {
        handler(val) {
          if (!val) {
            return;
          }
          this.show = false;
          if (this.chart !== null && this.chart !== '' && this.chart !== undefined) {
            this.chart.dispose();
          }
          this.chart = echarts.init(document.getElementById('advertpie'));
          this._initchart(val);
        },
        deep: true
      }
    },
    ready() {

    }
  };
</script>
<style lang="less" scoped>
.advertpanel-container{
  margin-bottom: 100px;
  h2{
    height:80px;
    text-align: center;
    line-height: 80px;
    border:1px solid #eee;
  }
  .advertpanel{
    width:100%;
    height:400px;
  }
}
</style>
