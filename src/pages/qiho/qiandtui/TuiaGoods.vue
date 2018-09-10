<template>
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label">订单创建时间：</p>
        <datepicker :value.sync="params.curDate" placeholder="年月日" :disabled-date="disabledDate"></datepicker>
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterGoods" class="margin8 d-button--qiho wide-button">筛选</d-button>
        <!-- <d-button size="large"  type="primary" @click="tuiaGoodsExport">导出</d-button> -->
      </div>
    </div>
  </div>
  <div class="listTable">
    <div class="cf tooltip-container">
      <d-tooltip placement="left" content="发券量：推啊发券量<br>
                                         点击量：推啊点击量<br>
                                         点击率：点击量 / 发券量<br>
                                         预估点击收益：（（订单价格-订单成本）*预估总签收率-7.5元*下单量）*下单率*出单率<br>
                                         消耗：推啊消耗<br>
                                         ARPU：消耗 / 发券量<br>
                                         预估ARPU: 预估点击收益*点击率,分<br>
                                         预估收益ARPU:（（（下单订单总金额-下单订单总成本）/下单量*预估签收率）/1.17-730）*预估出单率*下单率*点击率<br>
                                         下单量：奇货下单量<br>
                                         下单率：下单量 / 点击量<br>
                                         预估下单收益:（（（下单订单总金额-下单订单总成本）/下单量*预估签收率）/1.17-730）*预估出单率<br>
                                         24小时下单率方差：24小时下单率标准差 / 24小时平均下单率<br>
                                         三日下单率方差：三日下单率标准差 / 三日平均下单率<br>
                                         七日下单率方差：七日下单率标准差 / 七日平均下单率<br>
                                         CPA：消耗 / 下单量<br>
                                         出单量：奇货审核通过订单量<br>
                                         预估出单率，只算一天：T-2到T-8的平均出单率<br>
                                         出单率：出单量 / 下单量<br>
                                         总签收量：总签收成功订单量<br>
                                         预估总签收率：在T+2到T+5依据实际的总签收率计算&更新预估总签收率<br>
                                         T+2，=1.703686*总签收率+0.362999<br>
                                         T+3，=1.391289*总签收率+0.136649<br>
                                         T+4，=1.063638*总签收率+0.096429<br>
                                         T+5，=0.944633*总签收率+0.097241<br>
                                         总签收率：总签收成功订单量 / 出单量<br>
                                         预估毛利:（（（下单订单总金额-下单订单总成本）*预估签收率）/1.17-730*下单量）*预估出单率<br>
                                         预估ROI:（（（下单订单总金额-下单订单总成本）*预估签收率）/1.17-730*下单量）*预估出单率/广告消耗<br>
                                         ROI：（签收订单金额 - 签收订单成本 - 出单量 * 7.5）/ 消耗<br>
                                         三日ROI方差：三日ROI标准差 / 三日平均ROI<br>
                                         七日ROI方差：七日ROI标准差 / 七日平均ROI<br>
                                         次日地区签收率：次日地区签收成功订单量 / 次日地区出单量<br>
                                         三日地区签收率：三日地区签收成功订单量 / 三日地区出单量<br>
                                         五日地区签收率：五日地区签收成功订单量 / 五日地区出单量<br>
                                         其他地区签收率：其他地区签收成功订单量 / 其他地区出单量">
        <d-button type="text" class="instruction">?</d-button>
      </d-tooltip>
    </div>
    <div class="tabCont">
      <i-table width="100%" height="600" :columns="columns" :data="data.list" @on-sort-change="sortchange" :class="['table-goods-list']"></i-table>
      <tableempty v-if="!$loadingRouteData && (!data || (data.list && data.list.length === 0))"></tableempty>
      <loading :show="$loadingRouteData"></loading>
    </div>
    <d-pagination v-if="data && data.count" :total="data.count" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" :batch="true"></d-pagination>
    <component :is="curview" :title="batchtitle" :show.sync="batchModalShow" :on-close="onClose" ></component>
  </div>
</template>
<td class="td-actions">
  <p>
    <a v-link="{ path: '/qiho/tuia/adplan/' + item.id + '/' + params.curDate }" target="_blank">广告计划</a>
    <a v-link="{ path: '/qiho/tuia/media/' + item.id + '/' + params.curDate }" target="_blank">媒体</a>
    <a v-link="{ path: '/qiho/tuia/coupon/' + item.id + '/' + params.curDate }" target="_blank">出券顺序</a>
    <a v-link="{ path: '/qiho/tuia/trend/' + item.id + '/' + params.curDate }" target="_blank">商品趋势</a>
    <a v-link="{ path: '/qiho/tuia/advtime/' + item.id + '/' + params.curDate }" target="_blank">商品小时数据</a>    
  </p>
</td>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import dateUtil from 'components/utils/getCurDate';
  import dcMixins from './mixins/DatacenterMixins';
  import tuiaGoodsExportmodal from './components/tuiaGoodsExportModal';
  import goodstablemixins from './mixins/goodsTableMixins';

  export default {
    components: {
      tuiaGoodsExportmodal
    },
    mixins: [dcMixins, goodstablemixins],
    data() {
      return {
        data: {},
        params: {
          pageNum: 1,
          pageSize: 20,
          curDate: this.getOrderDate()
        },
        query: ''
      };
    },
    route: {
      data: function(transition) {
        this.getGoodsList(this.params, transition);
      }
    },
    methods: {
      /**
       * 商品过滤
       */
      filterGoods: function() {
        var params = this.params;
        params.pageNum = 1;
        this.getGoodsList(this.params);
      },

      /**
       * 获取商品列表
       */
      getGoodsList: function(options, transition) {
        this.$http.post('/logistics/queryStatisticsDayPage', options).then((res) => {
          res = res.json();
          if (res.success) {
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
        }, (res) => {
          // error callback
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
       * 分页
       */
      onPageChange: function(val) {
        // 当前页不发送请求
        if (val === this.params.pageNum) {
          return;
        }
        this.params.pageNum = val;
        this.getGoodsList(this.params);
      },
      /**
       * 订单时间设置为前一天
       */
      getOrderDate: function() {
        var myDate = new Date();
        myDate.setDate(myDate.getDate());
        return dateUtil({
          date: myDate
        });
      },
      /**
       * 订单时间禁选今天以后的时间
       */
      disabledDate: function(date) {
        var now = new Date();
        return date.getTime() > now.getTime();
      },
      /**
       * 转换数据
       */
      convertData(data) {
        let result = data.list;
        for (let item of result) {
          item.clickRate = this.toPercent(item.clickRate);
          item.orderRate = this.toPercent(item.orderRate);
          item.issueRate = this.toPercent(item.issueRate);
          item.successRate = this.toPercent(item.successRate);
          item.onedaySuccessRate = this.toPercent(item.onedaySuccessRate);
          item.threedaySuccessRate = this.toPercent(item.threedaySuccessRate);
          item.fivedaySuccessRate = this.toPercent(item.fivedaySuccessRate);
          item.otherSuccessRate = this.toPercent(item.otherSuccessRate);
          item.keepSuccessRate = this.toPercent(item.keepSuccessRate);
          item.orderCompleteRate = this.toPercent(item.orderCompleteRate);
          item.estiSuccessRate = this.toPercent(item.estiSuccessRate);
        }
        data.list = result;
        return data;
      },
      toPercent(point) {
        var str = Number(point * 100).toFixed(2);
        str += '%';
        return str;
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
      }
      .margin8{
        margin-left: 8px;
      }
    }
    .tuiafilter{
      padding: 20px 0;
    }
    .form-inline .form-control{
      margin-right: 0;
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
