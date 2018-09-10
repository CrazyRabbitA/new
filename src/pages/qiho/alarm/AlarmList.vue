<template>
  <div class="alarm-list">
    <pagetitle title="报警列表"></pagetitle>
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label">广告ID：</p>
        <input type="text" class="form-control" v-model="params.advertId">
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterConfigs" class="margin8 d-button--qiho wide-button">筛选</d-button>
      </div>
    </div>
  </div>
  <div class="listTable">
    <div class="tabCont">
      <i-table width="100%" height="600" :columns="columns" :data="data.list" @on-sort-change="sortchange" :class="['table-goods-list']"></i-table>
      <tableempty v-if="!$loadingRouteData && (!data || (data.list && data.list.length === 0))"></tableempty>
      <loading :show="$loadingRouteData"></loading>
    </div>
    <d-pagination v-if="data && data.total" :total="data.total" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" :batch="true"></d-pagination>
    <component :is="curview" :title="modalTitle" :show.sync="modalShow" :on-close="onClose" :on-ok="onOk" :modal-params="modalParams"></component>
  </div>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import alarmListMixins from './mixins/AlarmListMixins';
  import showAlarmDetailModal from './components/ShowAlarmDetailModal';

  export default {
    mixins: [alarmListMixins],
    components: {
      showAlarmDetailModal
    },
    data() {
      return {
        data: {},
        modalShow: false,
        modalTitle: '',
        curview: '',
        modalParams: null,
        params: {
          pageNum: 1,
          pageSize: 20,
          advertId: null
        },
        query: ''
      };
    },
    route: {
      data: function(transition) {
        this.getAlamList(this.params, transition);
      }
    },
    methods: {
      /**
       * 筛选报警配置文件
       */
      filterConfigs: function() {
        var params = this.params;
        params.pageNum = 1;
        this.getAlamList(this.params);
      },

      /**
       * 获取商品列表
       */
      getAlamList: function(options, transition) {
        this.$http.post('/alarm/record/findByParam', options).then((res) => {
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
        this.getAlamList(this.params);
      },
      /**
       * 显示详情
       */
      showDetail: function(advertId, alarmName, adConcume, adConcumeFluctuate, launchCount, launchFluctuate, clickCount, clickFluctuate, orderCount, orderFluctuate, offer, offerFluctuate, reason) {
        this.modalTitle = '报警详情';
        this.modalParams = {
          advertId: advertId,
          alarmName: alarmName,
          adConcume: adConcume,
          adConcumeFluctuate: adConcumeFluctuate,
          launchCount: launchCount,
          launchFluctuate: launchFluctuate,
          clickCount: clickCount,
          clickFluctuate: clickFluctuate,
          orderCount: orderCount,
          orderFluctuate: orderFluctuate,
          offer: offer,
          offerFluctuate: offerFluctuate,
          reason: reason,
          idEdit: true
        };
        this.curview = 'showAlarmDetailModal';
        this.modalShow = true;
      },
      /**
       * 关闭窗口
       */
      onClose: function() {
        this.modalShow = false;
        setTimeout(() => {
          this.curview = '';
        }, 500);
      },

      /**
       * 确定保存后关闭窗口
       */
      onOk: function() {
        this.modalShow = false;
        setTimeout(() => {
          this.curview = '';
        }, 2000);
      }
    }
  };
</script>

<style lang="less">
  .datacenter-app{
    .alarm-list{
      .form-control{
        float: none;
      }
      .bottomline{
        .form-filter-group{
          .filter-label{
            width: 60px;
          }
        }
        .margin8{
          margin-left: 8px;
        }
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
