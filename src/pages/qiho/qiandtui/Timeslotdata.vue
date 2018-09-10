<template>
<div class="slotData">
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label short">日期：</p>
        <daterangepicker :error-show.sync="errorShow" :start.sync="params.extraStartDate" :end.sync="params.extraEndDate" :range="30"></daterangepicker>
      </div>
      <div class="form-filter-group realtime">
        <p class="filter-label middle">时间段：</p>
        <d-select :options.sync="timeOpt" @select="selectTime" :value.sync="timeslot" width="100" ></d-select>
      </div>
    </div>
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group realtime">
        <p class="filter-label middle">商品Id：</p>
        <nselect :options="itemOptions" :on-select="selectItem"  :value.sync="params.itemId" :i-filter-key.sync="iFilterKeyItem"  key="name" trigger="click" :class="{'fl': true}" :placeholder="`请输入商品名称/ID`"  search="true"></nselect>
      </div>
      <div class="form-filter-group realtime">
        <p class="filter-label long">广告计划Id：</p>
        <input type="text" class="form-control form-control-advtime" v-model="params.advertId">        
        <!--<nselect :options="advOptions"  :value.sync="params.advertId" :i-filter-key.sync="iFilterKeyAdv"  key="name" trigger="click" :class="{'fl': true}" :placeholder="`请输入广告名称/ID`"  search="true"></nselect>-->
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
      <i-table width="100%" :columns="columns" :data="data" @on-sort-change="sortchange" :class="['table-goods-list']"></i-table>
    </div>
  </div>
</div>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import dcMixins from './mixins/DatacenterMixins';
  import dateUtil from 'components/utils/getCurDate';
  import timeslotdataTableMixin from './mixins/TimeslotdataTableMixin.js';

  export default {
    mixins: [dcMixins, timeslotdataTableMixin],
    data() {
      return {
        data: [],
        params: {
          itemId: '',
          advertId: '',
          extraStartDate: this.getOrderDate(),
          extraEndDate: this.getOrderDate(),
          startTime: '08:30:00',
          endTime: '09:00:00'
        },
        timeOpt: [
          {
            id: '00:00:00-00:30:00',
            label: '00: 30'
          },
          {
            id: '00:30:00-01:00:00',
            label: '01: 00'
          },
          {
            id: '01:00:00-01:30:00',
            label: '01: 30'
          },
          {
            id: '01:30:00-02:00:00',
            label: '02: 00'
          },
          {
            id: '02:00:00-02:30:00',
            label: '02: 30'
          },
          {
            id: '02:30:00-03:00:00',
            label: '03: 00'
          },
          {
            id: '03:00:00-03:30:00',
            label: '03: 30'
          },
          {
            id: '03:30:00-04:00:00',
            label: '04: 00'
          },
          {
            id: '04:00:00-04:30:00',
            label: '04: 30'
          },
          {
            id: '04:30:00-05:00:00',
            label: '05: 00'
          },
          {
            id: '05:00:00-05:30:00',
            label: '05: 30'
          },
          {
            id: '05:30:00-06:00:00',
            label: '06: 00'
          },
          {
            id: '06:00:00-06:30:00',
            label: '06: 30'
          },
          {
            id: '06:30:00-07:00:00',
            label: '07: 00'
          },
          {
            id: '07:00:00-07:30:00',
            label: '07: 30'
          },
          {
            id: '07:30:00-08:00:00',
            label: '08: 00'
          },
          {
            id: '08:00:00-08:30:00',
            label: '08: 30'
          },
          {
            id: '08:30:00-09:00:00',
            label: '09: 00'
          },
          {
            id: '09:00:00-09:30:00',
            label: '09: 30'
          },
          {
            id: '09:30:00-10:00:00',
            label: '10: 00'
          },
          {
            id: '10:00:00-10:30:00',
            label: '10: 30'
          },
          {
            id: '10:30:00-11:00:00',
            label: '11: 00'
          },
          {
            id: '11:00:00-11:30:00',
            label: '11: 30'
          },
          {
            id: '11:30:00-12:00:00',
            label: '12: 00'
          },
          {
            id: '12:00:00-12:30:00',
            label: '12: 30'
          },
          {
            id: '12:30:00-13:00:00',
            label: '13: 00'
          },
          {
            id: '13:00:00-13:30:00',
            label: '13: 30'
          },
          {
            id: '13:30:00-14:00:00',
            label: '14: 00'
          },
          {
            id: '14:00:00-14:30:00',
            label: '14: 30'
          },
          {
            id: '14:30:00-15:00:00',
            label: '15: 00'
          },
          {
            id: '15:00:00-15:30:00',
            label: '15: 30'
          },
          {
            id: '15:30:00-16:00:00',
            label: '16: 00'
          },
          {
            id: '16:00:00-16:30:00',
            label: '16: 30'
          },
          {
            id: '16:30:00-17:00:00',
            label: '17: 00'
          },
          {
            id: '17:00:00-17:30:00',
            label: '17: 30'
          },
          {
            id: '17:30:00-18:00:00',
            label: '18: 00'
          },
          {
            id: '18:00:00-18:30:00',
            label: '18: 30'
          },
          {
            id: '18:30:00-19:00:00',
            label: '19: 00'
          },
          {
            id: '19:00:00-19:30:00',
            label: '19: 30'
          },
          {
            id: '19:30:00-20:00:00',
            label: '20: 00'
          },
          {
            id: '20:00:00-20:30:00',
            label: '20: 30'
          },
          {
            id: '20:30:00-21:00:00',
            label: '21: 00'
          },
          {
            id: '21:00:00-21:30:00',
            label: '21: 30'
          },
          {
            id: '21:30:00-22:00:00',
            label: '22: 00'
          },
          {
            id: '22:00:00-22:30:00',
            label: '22: 30'
          },
          {
            id: '22:30:00-23:00:00',
            label: '23: 00'
          },
          {
            id: '23:00:00-23:30:00',
            label: '23: 30'
          },
          {
            id: '23:30:00-24:00:00',
            label: '24: 00'
          }
        ],
        timeslot: '08:30:00-09:00:00',
        iFilterKeyItem: '',
        iFilterKeyAdv: '',
        errorShow: false,
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
        this.getItemAll();
        this.getAdvAll();
      }
    },
    methods: {
      selectTime: function() {
        let timeslot = this.timeslot.split('-');
        this.params.startTime = timeslot[0];
        this.params.endTime = timeslot[1];
      },
      selectItem: function() {
        this.getAdvAll();
      },
      /**
       * 广告计划过滤
       */
      filterAdplan: function() {
        this.getSlotdataList(this.params);
      },
      getSlotdataList: function(options) {
        if ((!this.params.itemId) && (!this.params.advertId)) {
          MessageBox({
            title: '请选择商品或输入广告Id！',
            type: 'error'
          });
          return false;
        }
        this.$http.post('/qiho/advert/goods/di/find/list', options).then((res) => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            this.$set('data', data);
          } else {
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
      },
      download: function() {
        // 下载地址拼接
        let url = '/qiho/advert/goods/di/find/export?extraStartDate=' + this.params.extraStartDate + '&extraEndDate=' + this.params.extraEndDate + '&startTime=' + this.params.startTime + '&endTime=' + this.params.endTime + '&itemId=' + this.params.itemId + '&advertId=' + this.params.advertId;
        window.open(url);
      }
    }
  };
</script>

<style lang="less">
  .slotData{
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
