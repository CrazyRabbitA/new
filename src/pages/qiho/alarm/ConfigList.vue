<template>
  <div class="alarm-config-list">
    <pagetitle title="报警配置列表"></pagetitle>
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
    <component :is="curview" :title="batchtitle" :show.sync="batchModalShow" :on-close="onClose" ></component>
    <d-modal title="删除报警配置" :show.sync="deleteConfigModal.show" width="280" description="确定删除吗？" :on-ok="deleteConfig"></d-modal>
  </div>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import configListMixins from './mixins/ConfigListMixins';

  export default {
    mixins: [configListMixins],
    data() {
      return {
        data: {},
        params: {
          pageNum: 1,
          pageSize: 20,
          advertId: null
        },
        deleteConfigModal: {
          show: false,
          id: null
        },
        query: ''
      };
    },
    route: {
      data: function(transition) {
        this.getAlamConfigList(this.params, transition);
      }
    },
    methods: {
      /**
       * 删除报警配置
       * @return {[type]} [description]
       */
      deleteConfig: function() {
        this.deleteConfigModal.show = false;
        this.$http.post('/alarm/config/delete', {id: this.deleteConfigModal.id}, {emulateJSON: true}).then((res) => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '删除成功！',
              type: 'success'
            });
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },

      /**
       * 筛选报警配置文件
       */
      filterConfigs: function() {
        var params = this.params;
        params.pageNum = 1;
        this.getAlamConfigList(this.params);
      },

      /**
       * 获取商品列表
       */
      getAlamConfigList: function(options, transition) {
        this.$http.post('/alarm/config/findByParam', options).then((res) => {
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
        this.getAlamConfigList(this.params);
      }
    }
  };
</script>

<style lang="less">
  .datacenter-app{
    .alarm-config-list{
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
