<template>
  <div class="page-content finance-app">
    <div class="form-inline bottomline filter-style">
      <d-button type="primary" size="large" class="fr" @click="addEditAd">新建广告</d-button>
    </div>
    <table class="table-goods table-goods-list">
      <thead>
      <tr class="tr-header">
        <th width="15%">广告ID</th>
        <th width="10%">AE名称</th>
        <th width="10%">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr class="tr-items" v-for="(index, item) in data.list">
        <td>{{item.adId}}</td>
        <td>{{item.aeName}}</td>
        <td class="td-options">
         <a href="javascript:void(0)" @click="edit(item)">编辑</a>
         <a href="javascript:void(0)" @click="delConfirm(item)">删除</a>
        </td>
      </tr>
      </tbody>
    </table>
    <tableempty v-if="!$loadingRouteData && (!data || (data.list && data.list.length === 0))"></tableempty>
    <d-pagination v-if="data && data.total" :total="data.total" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange"></d-pagination>
    <loading :show="$loadingRouteData"></loading>
    <d-modal :title="delModal.title" :show.sync="delModal.show" width="280" :description="delModal.desc" :on-ok="delModal.action"></d-modal>
    <addad v-if="addEditGroupModal.show" :show.sync="addEditGroupModal.show" :title="addEditGroupModal.title" :item="addEditGroupModal.item"></addad>
  </div>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import addad from './components/AddEditAd.vue';

  export default {
    components: {
      addad
    },
    data() {
      return {
        addEditGroupModal: {
          show: false,
          title: '新建组'
        },
        modalShow: false,
        modalTitle: '',
        curview: '',
        modalParams: null,
        data: {
          list: [],
          total: 0
        },
        params: {
          pageNum: 1,
          pageSize: 20
        },
        delModal: {
          show: false
        }
      };
    },
    route: {
      data: function(transition) {
        this.getItemList(transition);
      }
    },
    methods: {
      /**
        * 广告id和ae管理
        * @param  {[type]} transition [description]
      */
      getItemList: function(transition) {
        this.$http.post('/ae/ad/findByParam', this.params).then((res) => {
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
          this.$loadingRouteData = false;
        }, (res) => {
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

        this.getItemList();
      },
      /**
       */
      addEditAd: function() {
        this.addEditGroupModal = {
          show: true,
          item: '',
          title: '新建广告'
        };
      },
      edit(item) {
        this.addEditGroupModal = {
          show: true,
          item: item,
          title: '编辑广告'
        };
      },
      /**
       * 删除确认框
       */
      delConfirm: function(item) {
        this.delModal = {
          show: true,
          title: '删除',
          desc: '确认删除! ',
          action: () => {
            this.delItem(item);
          }
        };
      },
      /**
       * 删除AE
       * @return {[type]} [description]
       */
      delItem: function(item) {
        this.delModal.show = false;
        this.$http.post('/ae/ad/delete', {adId: item.adId}).then((res) => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '删除成功！',
              type: 'success'
            });
            this.getItemList();
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
      }
    },
    events: {
      pageRefresh: function() {
        this.getItemList();
      }
    }
  };
</script>
<style lang="less">
  .finance-app {
    .filter-style {
      .select-group {
        width: 146px;
        margin-right: -1px;
      }
      .form-control {
        width: 180px;
      }
    }
    .td-options a{
      text-decoration: none;
    }
    .checktypelist {
      width: 100%;
      // position: absolute;
      // top: 183px;
      // left: 525px;
      height: 200px;
      background-color: #fff;
      z-index: 10;
      box-shadow: 2px 2px 8px 1px #ccc;
      padding: 10px;
      overflow: hidden;
      ul {
        height: 200px;
        overflow-y: scroll;
        li {
          height: 36px;
          line-height: 36px;
          position: relative;
          padding-left: 24px;
          .checkbox-control {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
  }
</style>