<template>
  <ul class="chart-types cf">
    <template v-for="(index,type) in types">
      <li class="chart-type-item" @click="toggleChart(index)" :class="{active: curChart===index}"><span>{{type}}</span>
      </li>
    </template>
  </ul>
  <template v-for="(index, item) in types">
    <div v-el="echartscontainer" class="echartContainer" v-show="curChart===index">
      <div :id="'chart' + (index + 1)" class="echart" v-el:echarts
           style="width:90%;height:450px;margin-top:20px;margin-bottom:10px;"></div>
    </div>
  </template>
  <div class="listTable">
    <div class="cf tooltip-container">
      <d-tooltip placement="left" content="发券量：推啊发券量<br>
                                         点击量：推啊点击量<br>
                                         点击率：点击量 / 发券量<br>
                                         消耗：推啊消耗<br>
                                         ARPU：消耗 / 发券量<br>
                                         下单量：奇货下单量<br>
                                         下单率：下单量 / 点击量<br>
                                         CPA：消耗 / 下单量<br>
                                         出单量：奇货审核通过订单量<br>
                                         出单率：出单量 / 下单量<br>
                                         总签收量：总签收成功订单量<br>
                                         总签收率：总签收成功订单量 / 出单量<br>
                                         ROI：（签收订单金额 - 签收订单成本 - 出单量 * 7.5）/ 消耗<br>
                                         次日地区签收率：次日地区签收成功订单量 / 次日地区出单量<br>
                                         三日地区签收率：三日地区签收成功订单量 / 三日地区出单量<br>
                                         五日地区签收率：五日地区签收成功订单量 / 五日地区出单量<br>
                                         其他地区签收率：其他地区签收成功订单量 / 其他地区出单量">
        <d-button type="text" class="instruction">?</d-button>
      </d-tooltip>
    </div>
    <div class="tabCont">
      <i-table width="100%" :columns="columns" :data="data" @on-sort-change="sortchange" :class="['table-goods-list']"></i-table>
    </div>
  </div>
</template>

<script>
  import overallChartMixins from './mixins/overallChartMixins';
  import overallMixins from './mixins/overallMixins';
  import MessageBox from 'components/basic/MessageBox';
  import overalltablemixins from './mixins/overallTableMixins';

  const nameMap = {
    orderCountChart: '订单',
    clickRateChart: '点击',
    orderRateChart: '下单',
    successCtChart: '签收',
    ROIChart: 'ROI'
  };
  export default {
    mixins: [overallChartMixins, overallMixins, overalltablemixins],
    data() {
      return {
        data: [],
        curChart: 0,
        // 表格所有数据
        newTableList: [],
        nameMap: nameMap,
        // 储存请求数据
        _myresultData: {},
        types: Object.values(nameMap)
      };
    },
    route: {
      data(transition) {
        this.getStatisticList(transition);
      }
    },
    methods: {
      toggleChart: function(i) {
        this.curChart = i;
        this.init(this.newTableList[i], 'chart' + (i + 1));
        this.newTableList[i].isActive = true;
      },
      getStatisticList: function(transition) {
        this.$http.post('/logistics/statisticsGeneral', {}).then((res) => {
          res = res.json();
          if (res.success) {
            // 转化为图标数据
            let data2 = this.convertChartData(res.data);
            data2 = this._fixData(data2);
            this.newTableList = Object.keys(nameMap).map(k => data2[k]);
            this.init(this.newTableList[this.curChart], 'chart' + (this.curChart + 1)); // 渲染第一个
            this.newTableList[this.curChart].isActive = true; // 渲染第一个
            let data = this.convertData(res.data);
            if (transition) {
              transition.next({
                'data': data
              });
            } else {
              this.$set('data', data);
            }
          } else {
            transition && transition.next();
            this.data = null;
          }
        }, res => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
       * 转换数据
       */
      convertData(data) {
        let result = [];
        for (let item of data) {
          // wholeCurTime为null，表示该行数据不存在，从表格中隐藏
          if (item.wholeCurTime) {
            item.clickRate = this.toPercent(item.clickRate);
            item.orderRate = this.toPercent(item.orderRate);
            item.onedayAllRate = this.toPercent(item.onedayAllRate);
            item.threedayAllRate = this.toPercent(item.threedayAllRate);
            item.successRate = this.toPercent(item.successRate);
            result.push(item);
          }
        }
        // 按时间倒序
        result = result.sort(function(a, b) {
          return a.wholeCurTime > b.wholeCurTime ? -1 : 1;
        });
        return result;
      },
      toPercent(point) {
        let str = Number(point * 100).toFixed(2);
        str += '%';
        return str;
      }
    }
  };
</script>

<style lang="less">
.datacenter-app{
  .top-content {
    overflow: hidden;
    overflow-x: auto;
    margin: 40px 0 60px 0;
    padding: 10px 10px 20px 10px;
  }
  .table-container {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 2px;
  }
  ::-webkit-scrollbar {
      width: 8px;
      height: 4px;
  }
  .table-slide {
    color: #fff;
    font-family:HiraginoSansGB-W3;
    width: 12%;
    min-width: 120px;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
    background-color: currentcolor;
    transition: all .4s linear;
    & + .table-slide {
      margin-left: 16px;
    }
    &.active, &:hover {
      box-shadow: 0 10px 20px -5px currentcolor;
      .fix:after {
        opacity: 1;
      }
    }
    .fix {
      width: 0;
      height: 0;
      &:after {
        transition: opacity .4s linear;
        content: "";
        opacity: 0;
        display: block;
        position: absolute;
        z-index: 11;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top-color: currentcolor;
        left: 50%;
        bottom: -20px;
        transform: translateX(-50%);
      }
    }
    .i-name {
      color:#fff;
      font-size: 16px;
    }
  }

  .incometitle {
    border-bottom: none;
    h2.has-sub-title {
      font-weight: bold;
      font-size:16px;
      color:#444444;
    }
    .iconhandle {
      display: none;
    }
    .sub-title {
      font-size:14px;
      color:#444444;
      font-weight: normal;
      margin-right: 9px;
    }
  }
  .tr-items td {
    padding: 15px 10px 15px 0;
    vertical-align: middle;
  }

  .listTable {
    overflow: hidden;
    .tabCont {
      overflow-x: auto;
      white-space: nowrap;
    }
    .table-goods {
      margin-top: 5px;
      .tr-header th {
        padding-right: 20px;
      }
    }
  }
  th {
    overflow: visible;
    .ivu-table-cell {
      white-space: nowrap;
    }
  }
}
</style>
