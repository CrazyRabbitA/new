<template>
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label short label-required">商品Id：</p>
        <input type="text" class="form-control form-control-advtime" v-model="params.itemId">
      </div>
       <div class="form-filter-group">
        <p class="filter-label  label-required">广告计划Id：</p>
        <input type="text" class="form-control form-control-advtime" v-model="params.advertId">
      </div>
      <div class="form-filter-group">
        <p class="filter-label long">订单创建时间：</p>
        <datepicker :value.sync="params.extraDate" placeholder="年月日" :disabled-date="disabledDate"></datepicker>
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterAdplan" class="margin8 d-button--qiho wide-button">筛选</d-button>
      </div>
    </div>
  </div>
  <div class="chart-area">
    <ul class="chart-types cf">
      <template v-for="quota in quotaArr">
        <li class="chart-type-item" @click="toggleChart(quota.id)" :class="{active: curQuota===quota.id}"><span>{{quota.label}}</span>
        </li>
      </template>
    </ul>
    <div id="advTimeChart" class="echart"
    style="width:100%;height:400px;margin-top:20px;margin-bottom:10px;"></div>
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
    <div class="table-area">
      <table>
        <thead>
          <tr class="tr-header tr-header-right">
            <template v-for="colum in columns">
              <th>{{colum.title}}</th>
            </template>
          </tr>
        </thead>
        <tbody v-if="data && data.length !== 0">
          <tr class="tr-items tr-items-right" v-for="(index, item) in data.extraDate" track-by="$index">
            <template v-for="column in columns">
                <td v-if="column.render">{{column.render(item[column.dataIndex])}}</td>
                <td v-else>{{item[column.dataIndex]}}</td>
              </template>
            </template>
          </tr>  
        </tbody>
      </table>
      <tableempty v-if="!$loadingRouteData && (data && data.length === 0)"></tableempty>
    <div>
  </div>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import dcMixins from './mixins/DatacenterMixins';
  import dateUtil from 'components/utils/getCurDate';
  import advTimeChartMixins from './mixins/advTimeChartMixins.js';
  import advTimeMixins from './mixins/advTimeMixins.js';
  const quotaArr = [
    {
      label: '发券量',
      id: 'launchCount'
    },
    {
      label: '点击率',
      id: 'clickRate'
    },
    {
      label: 'ARPU',
      id: 'arpu'
    },
    {
      label: '预估点击收益',
      id: 'estiClickProfit'
    },
    {
      label: '下单量',
      id: 'orderCount'
    },
    {
      label: '下单率',
      id: 'orderRate'
    },
    {
      label: '预估ROI',
      id: 'estiRoi'
    }
  ];
  const columns = [
    {
      title: '时间',
      dataIndex: 'dhour'
    },
    {
      title: '发券量',
      dataIndex: 'launchCount'
    },
    {
      title: '点击量',
      dataIndex: 'clickCount'
    },
    {
      title: '点击率',
      dataIndex: 'clickRate',
      render: (text) => {
        return parseFloat((text * 100).toPrecision(12)).toFixed(0) + '%';
      }
    },
    {
      title: '下单率',
      dataIndex: 'orderRate',
      render: (text) => {
        return parseFloat((text * 100).toPrecision(12)).toFixed(2) + '%';
      }
    },
    {
      title: '下单量',
      dataIndex: 'orderCount'
    },
    {
      title: '预估出单率',
      dataIndex: 'estiIssueRate',
      render: (text) => {
        return parseFloat((text * 100).toPrecision(12)).toFixed(0) + '%';
      }
    },
    {
      title: '预估签收率',
      dataIndex: 'estiSuccessRate',
      render: (text) => {
        return parseFloat((text * 100).toPrecision(12)).toFixed(0) + '%';
      }
    },
    {
      title: '预估下单收益',
      dataIndex: 'estiOrderProfit'
    },
    {
      title: '消耗',
      dataIndex: 'adConcume'
    },
    {
      title: 'ARPU',
      dataIndex: 'arpu'
    },
    {
      title: '预估点击收益',
      dataIndex: 'estiClickProfit'
    },
    {
      title: '预估收益ARPU',
      dataIndex: 'estiArpu'
    },
    {
      title: '预估ROI',
      dataIndex: 'estiRoi'
    }
  ];
  export default {
    mixins: [dcMixins, advTimeChartMixins, advTimeMixins],
    data() {
      return {
        data: {},
        columns: columns,
        quotaArr: quotaArr,
        curQuota: 'launchCount',
        params: {
          itemId: '',
          advertId: '',
          extraDate: this.getOrderDate()
        }
      };
    },
    route: {
      data: function() {
        if (this.$route.params.itemId) {
          this.params.itemId = this.$route.params.itemId;
          this.params.advertId = this.$route.params.advertId;
          this.params.extraDate = this.$route.params.orderDate;
          this.getDataList(this.params);
        }
      }
    },
    methods: {
      /**
       * 广告计划过滤
       */
      filterAdplan: function() {
        if (this.params.itemId) {
          this.getDataList();
        } else {
          MessageBox({
            title: '请输入商品Id',
            type: 'error'
          });
        }
      },
      getDataList() {
        this.$http.get('/qiho/ads/item/dhour', { params: this.params }).then((res) => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
            this.getResourcesDate(this.data, this.curQuota);
          } else {
            MessageBox({
              title: '请求错误！',
              type: 'error'
            });
          }
        }, () => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
       * 订单创建时间设置
       */
      getOrderDate: function() {
        let myDate = new Date();
        myDate.setDate(myDate.getDate());
        return dateUtil({
          date: myDate
        });
      },
      /**
       * 订单时间禁选今天以后的时间
       */
      disabledDate: function(date) {
        let now = new Date();
        return date.getTime() > now.getTime();
      },
      toggleChart(curQuota) {
        this.curQuota = curQuota;
        this.getResourcesDate(this.data, this.curQuota);
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
  }
  .form-control-advtime {
    width: 120px !important;
  }
  .tr-header-right {
    th {
      text-align: right;
      padding-right: 10px;      
    }
    th:first-child{
      text-align: right;
      padding-left: 0px;
      padding-right: 16px;      
    }
  }
  .tr-items-right {
    td {
      text-align: right;
      padding-right: 10px;
    }
    td:first-child {
      padding-left: 0px;
    }
  }
 
</style>
