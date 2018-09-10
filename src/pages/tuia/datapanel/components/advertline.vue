<template>
<div class="datapanel-container">
  <!-- <h2 v-if="!datas.todConsumeLine">该查询条件下柱状图暂无数据！</h2> -->
  <div style = "width:100%;height:450px" v-if="datas.todConsumeLine" class="datapanel" :id="ids">
  </div>
</div>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils.js';
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
    }
  },
  data() {
    return {};
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
      let { keys, entries, values } = Object;
      // 判断只有一条的时候显示两条数据
      if (keys(val.todConsumeLine).length === 1 || keys(val.yesConsumeLine).length === 1) {
        let xAxisData = [];
        let axkey = keys(val.todConsumeLine)[0] || keys(val.yesConsumeLine)[0];
        let legendData = [];
        let seriesData = [];
        if (val.todConsumeLine) {
          for (let [key, vals] of entries(val.todConsumeLine)) {
            legendData = [`今日-${key}`, `昨日-${key}`];
            xAxisData = keys(vals).map(ele => {
              if (_this.ids === 'linedata') {
                return ele.length === 1 ? `0${ele}:00` : `${ele}:00`;
              } else {
                return ele;
              }
            });
          };
        } else if (val.yesConsumeLine) {
          for (let [key, vals] of entries(val.yesConsumeLine)) {
            legendData = [`今日-${key}`, `昨日-${key}`];
            xAxisData = keys(vals).map(ele => {
              if (_this.ids === 'linedata') {
                return ele.length === 1 ? `0${ele}:00` : `${ele}:00`;
              } else {
                return ele;
              }
            });
          };
        }
        seriesData = [
          {
            name: `今日-${axkey}`,
            type: 'line',
            data: values(val.todConsumeLine)[0] ? values(values(val.todConsumeLine)[0]).map(ele => {
              return ele === null ? '' : ele;
            }) : []
          },
          {
            name: `昨日-${axkey}`,
            type: 'line',
            data: values(val.yesConsumeLine)[0] && values(val.yesConsumeLine) ? values(values(val.yesConsumeLine)[0]).map(ele => {
              return ele === null ? '' : ele;
            }) : []
          }
        ];
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
            data: legendData
          },
          toolbox: {
            show: true
          },
          tooltip: {
            trigger: 'axis',
            position: function(point, params, dom, rect, size) {
              return [point[0] - size.contentSize[0], '10%'];
            },
            formatter: function(params) {
              // 对离线数据求和
              // 合计
              let axisitem = params[0].axisValueLabel;
              // 计算下标
              let getIndex = xAxisData.findIndex(ele => ele === axisitem);
              // 对每个总数求和
              let paramsTotal = [];
              let tpl = '';
              seriesData.forEach(ele => {
                ele.data.slice(0, getIndex + 1).length === 0 ? paramsTotal.push(0) : paramsTotal.push(
                  ele.data.slice(0, getIndex + 1).reduce((x, y) => {
                    if (!x) x = 0;
                    if (!y) y = 0;
                    return x + y;
                  })
                );
              });
              params.forEach(function(item, index) {
                tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                    item.color
                  }"></span>
                  ${item.seriesName} :  ${item.value ? _fixNum(item.value, 2) : '暂无数据'} (当前累计: ${_fixNum(paramsTotal[index], 2)})<br/>`;
              });
              return params[0].name + '<br/>' + tpl;
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
      } else {
        let xAxisData = [];
        let seriesData = [];
        let legendData = keys(val.todConsumeLine);
        for (let [key, vals] of entries(val.todConsumeLine)) {
          xAxisData = keys(vals).map(ele => {
            if (_this.ids === 'linedata') {
              return ele.length === 1 ? `0${ele}:00` : `${ele}:00`;
            } else {
              return ele;
            }
          });
          seriesData.push({
            name: key,
            type: 'line',
            data: values(vals).map(ele => {
              return ele === null ? '' : ele;
            })
          });
        }
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
            data: legendData
          },
          toolbox: {
            show: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              // 对离线数据求和
              // 合计
              let axisitem = params[0].axisValueLabel;
              // 计算下标
              let getIndex = xAxisData.findIndex(ele => ele === axisitem);
              // 对每个总数求和
              let paramsTotal = [];
              let tpl = '';
              seriesData.forEach(ele => {
                ele.data.slice(0, getIndex + 1).length === 0 ? paramsTotal.push(0) : paramsTotal.push(
                  ele.data.slice(0, getIndex + 1).reduce((x, y) => {
                    if (!x) x = 0;
                    if (!y) y = 0;
                    return x + y;
                  })
                );
              });
              params.forEach(function(item, index) {
                tpl += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                    item.color
                  }"></span>
                  ${item.seriesName} :  ${item.value ? _fixNum(item.value, 0) : '暂无数据'} (当前累计: ${_fixNum(paramsTotal[index], 0)})<br/>`;
              });
              return params[0].name + '<br/>' + tpl;
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
    }
  },

  watch: {
    datas: {
      handler(val) {
        // 没有数据 返回
        if (!val.todConsumeLine) {
          return;
        }

        this.show = false;
        if (
          this.chart !== null &&
          this.chart !== '' &&
          this.chart !== undefined
        ) {
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
.datapanel-container {
  h2 {
    height: 80px;
    text-align: center;
    line-height: 80px;
    border: 1px solid #eee;
    margin-bottom: 20px;
    margin-top: 20px;
  }
}
</style>
