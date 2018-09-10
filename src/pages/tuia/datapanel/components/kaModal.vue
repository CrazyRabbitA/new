<template>
  <div class="ka-modal">
    <d-modal effect="fade" width="900" :show.sync="show" class="ka-modal">
      <template slot="modal-body">
        <div class="ka-content">
          <h2 v-if="!lineData">该查询条件下柱状图暂无数据！</h2>
          <h3 class="trade-name">KA: {{newTrade}}</h3>
          <div style = "width:100%;height:450px" v-if="lineData" class="datapanel" :id="ids">
          </div>
        </div>
      </template>
      <template slot="modal-footer">
        <div class="modal-footer">
        </div>
      </template>
    </d-modal>
    <loading :show="loadingRouteData"></loading>
  </div>
</template>
<script>

import MessageBox from 'components/basic/MessageBox';
import Tooltip from 'components/basic/Tooltip';
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import echarts from 'echarts';

export default {
  components: {
    Tooltip
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      default: false
    },
    ids: {
      type: String,
      default: 'offdata'
    }
  },
  data() {
    return {
      lineData: [],
      newTrade: '',
      name: ''
    };
  },
  ready() {
    // this.getData();
  },
  watch: {
    'lineData': {
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
  },
  methods: {
    _fixNum: _fixNum,
    getPrecent(num) {
      return getPrecent(num);
    },
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
      let xAxisData = [];
      let seriesData = [];
      let seriesYdata = [];
        // let legendData = keys(val);
      val.map(el => {
        xAxisData.push(el.time);
        const val = el.value === null ? '暂无数据' : el.value;
        seriesYdata.push(val);
      });
      seriesData.push({
        name: this.name,
        type: 'line',
        data: seriesYdata
      });

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
          data: [this.name]
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
            params.forEach(function(item, index) {
                // if (item.data) {
              tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' +
                item.seriesName + ' : ' + (item.data === '暂无数据' ? '暂无数据' : _fixNum(item.data, 2)) + '<br/>';
                // } else {
                //   tpl += '';
                // }
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
      this.show = true;
    },
    getData(item) {
      this.loadingRouteData = true;
      this.name = item.accountName;
      this.newTrade = item.newTrade;
      this.$http.get(`/ka/account?accountId=${item.accountId}&newTrade=${item.newTrade}`).then(res => {
        res = JSON.parse(res.body);
        if (res.success) {
          this.loadingRouteData = false;
          this.lineData = res.data;
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      });
    }
  }

};
</script>

<style lang="less" scoped>
.ka-modal {
  .ka-content {
    padding: 0px 10px;
  }
  .trade-name {
    margin-left: 20px;
    color: #ff7746;
  }
}
</style>


