<template>
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label short label-required">商品Id：</p>
        <input type="text" class="form-control" v-model="params.itemId">
      </div>
      <div class="form-filter-group">
        <p class="filter-label long">订单创建时间：</p>
        <daterangepicker :start.sync="params.startTime" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="params.endTime" :disabled-date="disabledDate" width="190px"></daterangepicker>
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterGoodsTrend" class="margin8 d-button--qiho wide-button">筛选</d-button>
      </div>
    </div>
  </div>

  <ul class="chart-types cf" v-show="data">
    <template v-for="(index,type) in types">
      <li class="chart-type-item" @click="toggleChart(index)" :class="{active: curChart===index}"><span>{{type}}</span>
      </li>
    </template>
    <li class="tooltip-item">
      <d-tooltip placement="right" content="广告消耗：广告消耗<br>
                                          商品毛利：签收订单金额-签收订单成本-出单量 * 7.5<br>
                                          发券量：推啊发券量<br>
                                          点击量：推啊点击量<br>
                                          点击率：点击量 / 发券量<br>
                                          下单量：奇货下单量<br>
                                          下单率：下单量 / 点击量<br>
                                          总签收量：总签收成功订单量<br>
                                          总签收率：总签收成功订单量 / 出单量<br>">
        <d-button type="text" class="instruction">?</d-button>
      </d-tooltip>
    </li>
  </ul>

  <div class="listTable">
    <template v-for="(index, item) in types" >
      <div v-el="echartscontainer" class="echartContainer" v-show="curChart===index && data">
        <div :id="'chart' + (index + 1)" class="echart" v-el:echarts style="width:90%;height:400px;margin-bottom:10px;"></div>
      </div>
    </template>
    <tableempty v-if="!$loadingRouteData || !data || data.length === 0"></tableempty>
  </div>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import dcMixins from './mixins/DatacenterMixins';
  import trendChartMixins from './mixins/trendChartMixins';
  import overallMixins from './mixins/trendMixins';
  import * as dateUtils from 'components/utils/dateUtils';

  const nameMap = {
    incomeExpenseChart: '收支',
    flowChart: '流量',
    orderChart: '订单',
    successCtChart: '签收'
  };

  export default {
    mixins: [dcMixins, trendChartMixins, overallMixins],
    data() {
      return {
        data: null,
        params: {
          itemId: '',
          startTime: this.getOrderDate(21),
          endTime: this.getOrderDate(1)
        },
        curChart: 0,
        nameMap: nameMap,
        newTableList: [],
        types: Object.values(nameMap)
      };
    },
    route: {
      data: function(transition) {
        if (this.$route.params.id) {
          this.params.itemId = this.$route.params.id;
          let orderDate = this.$route.params.orderDate;
          if (orderDate) {
            // 默认显示创建时间前20天到创建时间的数据
            this.params.startTime = dateUtils.dateSubtract(orderDate, 20);
            this.params.endTime = orderDate;
          }
          this.getGoodsTrend(this.params, transition);
        } else {
          this.$loadingRouteData = false;
        }
      }
    },
    methods: {
      toggleChart: function(i) {
        this.curChart = i;
        this.init(this.newTableList[i], 'chart' + (i + 1));
        this.newTableList[i].isActive = true;
      },
      /**
       * 商品趋势过滤
       */
      filterGoodsTrend: function() {
        if (this.params.itemId) {
          this.getGoodsTrend(this.params);
        } else {
          MessageBox({
            title: '请输入商品Id',
            type: 'error'
          });
        }
      },
      getGoodsTrend(options, transition) {
        this.$loadingRouteData = true;
        this.$http.post('/logistics/statisticsItemTrend', options).then((res) => {
          res = res.json();
          let resData = res.data;
          if (res.success && resData.length > 0) {
            let data = this.convertTrendChartData(resData);
            data = this._fixData(data);
            this.newTableList = Object.keys(nameMap).map(k => data[k]);
            this.init(this.newTableList[this.curChart], 'chart' + (this.curChart + 1)); // 渲染第一个
            this.newTableList[this.curChart].isActive = true; // 渲染第一个
            if (transition) {
              transition.next({
                'data': resData
              });
              // $loadingRouteData会自动被赋值false待查
              this.$loadingRouteData = true;
            } else {
              this.$set('data', resData);
            }
          } else {
            transition && transition.next();
            this.data = null;
            this.$loadingRouteData = false;
          }
        }, () => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
       * 订单创建时间设置为前一天
       * @param d 当前日期前d天
       */
      getOrderDate: function(d) {
        let myDate = new Date();
        myDate.setDate(myDate.getDate() - d);
        return dateUtils.formatDate(myDate);
      },
      /**
       * 订单时间禁选今天以后的时间
       */
      disabledDate: function(date) {
        let now = new Date();
        return date.getTime() > now.getTime();
      }
    }
  };
</script>

<style lang="less">
  .datacenter-app{
    .bottomline{
      .form-filter-group{
        .filter-label{
          width: 100px;
        }
        input.form-control {
          float: none;
          width:200px;
        }
        p.filter-label.short{
          width: 70px;
        }
        p.filter-label.long{
          margin-left:8px;
        }
        .margin8{
          margin-left:8px;
        }
      }
    }
    .tuiafilter{
      padding: 20px 0;
    }
    .form-inline .form-control{
      margin-right: 0;
    }
    table.process-table {
      margin-top: 5px;
    }
    .tr-items td {
      padding: 15px 10px 15px 0;
      vertical-align: middle;
    }
    td:first-child {
      padding-left: 22px;
      padding-right: 0;
    }
    .listTable{
      overflow: hidden;
      .tr-header th {
        padding-right: 20px;
      }
      .tabCont {
        overflow-x: auto;
        white-space: nowrap;
      }
      .table-goods {
        margin-top: 5px;
      }
    }
  }
  .tooltip-item{
    float: left;
    padding: 6px 10px;
    .d-button.instruction{
      margin: 6px 0;
    }
  }
</style>
