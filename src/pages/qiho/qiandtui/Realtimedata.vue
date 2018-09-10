<template>
<div class="realtimeData">
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group realtime">
        <p class="filter-label short">商家：</p>
        <nselect :options="merchantOptions" :on-select="selectMerchant" :value.sync="params.merchantId" :i-filter-key.sync="iFilterKey"  key="name" trigger="click" :class="{'fl': true}" :placeholder="`请输入商家名称/ID`"  search="true"></nselect>
      </div>
      <div class="form-filter-group realtime">
        <p class="filter-label short">商品：</p>
        <nselect :options="itemOptions" :on-select="selectItem"  :value.sync="params.itemId" :i-filter-key.sync="iFilterKeyItem"  key="name" trigger="click" :class="{'fl': true}" :placeholder="`请输入商品名称/ID`"  search="true"></nselect>
      </div>
      <div class="form-filter-group realtime">
        <p class="filter-label long">广告计划Id：</p>
        <input type="text" class="form-control form-control-advtime" v-model="params.advertId">        
        <!--<nselect :options="advOptions"  :value.sync="params.advertId" :i-filter-key.sync="iFilterKeyAdv"  key="name" trigger="click" :class="{'fl': true}" :placeholder="`请输入广告名称/ID`"  search="true"></nselect>-->
      </div>
      <div class="form-filter-group">
        <p class="filter-label short">日期：</p>
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
        <li class="chart-type-item" @click="toggleLineChart(quota.id)" :class="{active: curLineQuota===quota.id}"><span>{{quota.label}}</span>
        </li>
      </template>
    </ul>
    <div id="lineTotalChart" class="echart"
    style="width:100%;height:400px;margin-top:20px;margin-bottom:10px;"></div>
  </div>
  <div class="chart-area mar35">
    <ul class="chart-types cf">
      <template v-for="quota in quotaArr2">
        <li class="chart-type-item" @click="toggleScatterChart(quota.id)" :class="{active: curScatterQuota===quota.id}"><span>{{quota.label}}</span>
        </li>
      </template>
    </ul>
    <div id="scatterTimeChart" class="echart"
    style="width:100%;height:400px;margin-top:20px;margin-bottom:10px;"></div>
  </div>
</div>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import dcMixins from './mixins/DatacenterMixins';
  import dateUtil from 'components/utils/getCurDate';
  import lineChartMixins from './mixins/RealtimeLineChartMixins.js';
  import realtimeMixins from './mixins/realtimeMixins.js';
  const quotaArr = [
    {
      label: '下单量',
      id: 'orderCount'
    },
    {
      label: '消耗',
      id: 'consumeTotal'
    },
    {
      label: '下单成本',
      id: 'cpa'
    }
  ];
  const quotaArr2 = [
    {
      label: '下单量',
      id: 'orderCount'
    },
    {
      label: '下单成本',
      id: 'cpa'
    },
    {
      label: '点击率',
      id: 'ctr'
    },
    {
      label: '下单率',
      id: 'cvr'
    },
    {
      label: '消耗',
      id: 'consumeTotal'
    }
  ];
  export default {
    mixins: [dcMixins, lineChartMixins, realtimeMixins],
    data() {
      return {
        data: {},
        scatterData: {},
        quotaArr: quotaArr,
        quotaArr2: quotaArr2,
        curLineQuota: 'orderCount',
        curScatterQuota: 'orderCount',
        params: {
          itemId: this.$route.query.itemId ? parseInt(this.$route.query.itemId) : '',
          advertId: this.$route.query.advertId ? parseInt(this.$route.query.advertId) : '',
          merchantId: this.$route.query.merchantId ? parseInt(this.$route.query.merchantId) : '',
          extraDate: this.$route.query.extraDate ? this.$route.query.extraDate : this.getOrderDate()
        },
        iFilterKey: '',
        iFilterKeyItem: '',
        iFilterKeyAdv: '',
        showErr: false,
        merchantOptions: [
          {
            id: '',
            name: '请选择'
          }
        ],
        itemOptions: [
          {
            id: '',
            name: '请选择'
          }
        ],
        advOptions: [
          {
            id: '',
            name: '请选择'
          }
        ]
      };
    },
    route: {
      data: function() {
        this.getMerchantAll();
        this.getItemAll();
        this.getAdvAll();
        this.getLineDataList(this.params);
        this.getScatterDataList(this.params);
      }
    },
    methods: {
      selectMerchant: function() {
        this.getItemAll();
        this.getAdvAll();
      },
      selectItem: function() {
        this.getAdvAll();
      },
      /**
       * 广告计划过滤
       */
      filterAdplan: function() {
        this.getLineDataList(this.params);
        this.getScatterDataList(this.params);
      },
      getLineDataList(options) {
        this.$http.post('/qiho/advert/goods/di/findTotal', options).then((res) => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
            this.getResourcesDate(this.data, this.curLineQuota);
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
      getScatterDataList(options) {
        this.$http.post('/qiho/advert/goods/di/find', options).then((res) => {
          res = res.json();
          if (res.success) {
            this.$set('scatterData', res.data);
            this.getResourcesDateScatter(this.scatterData, this.curScatterQuota);
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
       * 订单时间禁选今天以后的时间和前30天之前的时间
       */
      disabledDate: function(date) {
        let now = new Date();
        // 获取今天之前30天的时间点
        let monthAgoDate = this.getMonthAgoDate();
        return date.getTime() > now.getTime() || date.getTime() < new Date(monthAgoDate).getTime();
      },
      getMonthAgoDate: function() {
        var myDate = new Date();
        myDate.setDate(myDate.getDate() - 30);
        return dateUtil({
          date: myDate
        });
      },
      toggleLineChart(curLineQuota) {
        this.curLineQuota = curLineQuota;
        this.getResourcesDate(this.data, this.curLineQuota);
      },
      toggleScatterChart(curScatterQuota) {
        this.curScatterQuota = curScatterQuota;
        this.getResourcesDateScatter(this.scatterData, this.curScatterQuota);
      },
      getMerchantAll: function() {
        this.$http.get('/qiho/advert/goods/di/merchant').then((res) => {
          res = res.json();
          if (res.success) {
            let data = this.convertData(res.data);
            this.$set('merchantOptions', data);
          }
        }, (res) => {
          // error callback
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      getItemAll: function() {
        let fiterParam = {
          merchantId: this.params.merchantId
        };
        this.$http.get('/qiho/advert/goods/di/item', {
          params: fiterParam
        }).then((res) => {
          res = res.json();
          if (res.success) {
            let data = this.convertData(res.data);
            this.$set('itemOptions', data);
          }
        }, (res) => {
          // error callback
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      getAdvAll: function() {
        let fiterParam = {
          merchantId: this.params.merchantId,
          itemId: this.params.itemId
        };
        this.$http.get('/qiho/advert/goods/di/advertId', {
          params: fiterParam
        }).then((res) => {
          res = res.json();
          if (res.success) {
            let data = this.convertData(res.data);
            this.$set('advOptions', data);
          }
        }, (res) => {
          // error callback
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      convertData: function(data) {
        let result = [
          {
            id: '',
            name: '请选择'
          }
        ];
        for (let item of data) {
          let merchant = {
            id: item.id,
            name: item.name + '(' + item.id + ')'
          };
          result.push(merchant);
        }
        return result;
      }
    }
  };
</script>

<style lang="less">
  .realtimeData{
    .chart-area{
      margin-top: 30px;
      &.mar35{
        margin-top: 100px;
      }
    }
    .form-filter-group{
      margin-top: 10px;
      &.realtime{
        .select-group {
          width: 170px;
          float: none !important;
          .select-toggle{
            height: 32px;
            max-width: 167px;
            width: 167px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        input:disabled{
          background-color: #f4f4f4;
        }
      }
    }
  }
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
          width: 42px;
        }
        p.filter-label.long{
          width: 84px;
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
