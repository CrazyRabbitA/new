<template>
<div class="accuData">
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group realtime">
        <p class="filter-label short">商家：</p>
        <nselect :options="merchantOptions" :on-select="selectMerchant" :value.sync="params.merchantId" :i-filter-key.sync="iFilterKey"  key="name" trigger="click" :class="{'fl': true}" :placeholder="`请输入商家名称/ID`"  search="true"></nselect>
      </div>
      <div class="form-filter-group realtime">
        <p class="filter-label middle">商品Id：</p>
        <input type="text" placeholder="多个以,分隔" class="form-control form-control-advtime" v-model="params.itemIds">        
      </div>
      <div class="form-filter-group realtime">
        <p class="filter-label long">广告计划Id：</p>
        <input type="text" class="form-control form-control-advtime" v-model="params.advertId">        
      </div>
      <div class="form-filter-group">
        <p class="filter-label short">日期：</p>
        <datepicker :value.sync="params.extraDate" placeholder="年月日" :disabled-date="disabledDate"></datepicker>
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterAdplan" class="margin8 d-button--qiho wide-button">筛选</d-button>
      </div>
      <div class="downloadbox">
        <d-button size="large" type="primary" @click="download">下载</d-button>
      </div>
    </div>
  </div>
  <div class="listTable">
    <div class="tabCont">
      <i-table width="100%" :columns="columns" :data="data" :class="['table-goods-list']"></i-table>
    </div>
  </div>
</div>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import dcMixins from './mixins/DatacenterMixins';
  import dateUtil from 'components/utils/getCurDate';
  import accumulateTableMixin from './mixins/AccumulateTableMixin.js';

  export default {
    mixins: [dcMixins, accumulateTableMixin],
    data() {
      return {
        data: [],
        params: {
          itemIds: '',
          advertId: '',
          merchantId: '',
          extraDate: this.getOrderDate()
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
      data: function(transition) {
        this.getMerchantAll();
        this.getItemAll();
        this.getAccumulatedataList(this.params, transition);
      }
    },
    methods: {
      selectMerchant: function() {
        this.getItemAll();
      },
      /**
       * 广告计划过滤
       */
      filterAdplan: function() {
        this.getAccumulatedataList(this.params);
      },
      getAccumulatedataList: function(options, transition) {
        if (this.params.itemIds) {
          var reg = /^\d+(,\d+)*$/;
          if (!reg.test(this.params.itemIds)) {
            MessageBox({
              title: '请输入正确的商品Id',
              type: 'error'
            });
            return false;
          }
        }
        this.$http.post('/qiho/advert/goods/di/findTotal/list', options).then((res) => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            if (transition) {
              transition.next({
                'data': data
              });
            } else {
              this.$set('data', data);
            }
            console.log(this.data);
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
      },
      download: function() {
        if (this.params.itemIds) {
          var reg = /^\d+(,\d+)*$/;
          if (!reg.test(this.params.itemIds)) {
            MessageBox({
              title: '请输入正确的商品Id',
              type: 'error'
            });
            return false;
          }
        }
        // 下载地址拼接
        let url = '/qiho/advert/goods/di/findTotal/export?extraDate=' + this.params.extraDate + '&merchantId=' + this.params.merchantId + '&itemIds=' + this.params.itemIds + '&advertId=' + this.params.advertId;
        window.open(url);
      }
    }
  };
</script>

<style lang="less">
  .accuData{
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
    .downloadbox{
      margin: 35px 15px -9px;
      float: right;
    }
    .listTable{
      .table-goods-list th:first-child,.table-goods-list td:first-child{
        padding-left: 0 !important;
      }
      .ivu-table-cell{
        padding-left: 5px;
        padding-right: 5px;
      }
      .table-goods-list th,.table-goods-list td{
        padding-right: 0px !important;
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
        p.filter-label.middle{
          width: 60px;
        }
        p.filter-label.long{
          width: 95px;
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
