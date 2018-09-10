<template>
<div class="datapanel-container">
  <h2 v-if="!datas">该查询条件下柱状图暂无数据！</h2>
  <div style = "width:100%;height:450px" v-if="datas" class="datapanel" :id="ids">
  </div>
</div>
</template>
<script>
  import {_fixNum} from 'components/utils/cheatDataUtils.js';
  import echarts from 'echarts';
  export default {
    props: {
      datas: {
        type: Object,
        default: null
      },
      ydata: {
        type: String,
        default: ''
      },
      ids: {
        type: String,
        default: 'offdata'
      },
      dimen: {
        type: String,
        default: '2'
      }
    },
    data() {
      return {
      };
    },
    methods: {
      compare(val1, val2) {
        if (val1.data > val2.data) {
          return -1;
        } else if (val1.data < val2.data) {
          return 1;
        } else {
          return 0;
        }
      },
      _initchart(val) {
        const _this = this;
        let {keys, entries, values} = Object;
        let xAxisData = [];
        let seriesData = [];
        let legendData = keys(val);
        for (let [key, vals] of entries(val)) {
          xAxisData = keys(vals);
          seriesData.push({
            name: key,
            type: 'line',
            data: values(vals).map((ele) => {
              return ele === null ? '暂无数据' : ele;
            })
          });
        };

        // 总计其他
        const options = {
          grid: {
            left: '5%',
            bottom: '25%',
            containLabel: true
          },
          legend: {
            icon: 'rect',
            itemWidth: 25,
            itemHeight: 3,
            itemGap: 10,
            left: 'center',
            bottom: 20,
            data: legendData,
            selected: _this.dimen === '1' ? {
              '其他广告主': false
            } : {}
          },
          toolbox: {
            show: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              // 对离线数据求和
              params = params.sort(_this.compare);
              let tpl = '';
              let fix = _this.ydata === '消耗 / 元' ? 0 : 2;
              params.forEach(function(item, index) {
                tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' +
                item.seriesName + ' : ' + (item.data === '暂无数据' ? '暂无数据' : _fixNum(item.data, fix)) + '<br/>';
              });
              return tpl;
            },
            position: function(point, params, dom, rect, size) {
              return [point[0] - size.contentSize[0], '10%'];
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: xAxisData,
              nameTextStyle: {
                fontSize: 20,
                color: 'red'
              },
              axisLabel: {
                margin: 20
              }
            }
          ],
          yAxis: [
            {
              name: this.ydata,
              type: 'value'
            }
          ],
          series: seriesData
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
          this.chart = echarts.init(document.getElementById(this.ids));
          this._initchart(val);
        },
        deep: true
      }
    }
  };
</script>
<style lang="less" scoped>
.datapanel-container{
  h2{
    height:80px;
    text-align: center;
    line-height: 80px;
    border:1px solid #eee;
    margin-bottom:20px;
    margin-top:20px;
  }
}
</style>
