<template>
  <div class="page-content finance-app">
    <div class="form-inline bottomline filter-style">
      <d-button type="primary" size="large" class="fr" @click="showAeEdit">添加AE</d-button>
    </div>
    <table class="table-goods table-goods-list">
      <thead>
      <tr class="tr-header">
        <th width="15%">AE名称</th>
        <th width="10%">角色分配</th>
        <th width="10%">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr class="tr-items" v-for="(index, item) in data.list">
        <td>{{item.aeName}}</td>
        <!-- 1=组员、2=组长 , -->
        <td>{{+item.aeRole === 1 ? '组员' : '组长'}}</td>
        <td class="td-options">
         <a href="javascript:void(0)" @click="delConfirm(item.id)">删除</a>
        </td>
      </tr>
      </tbody>
    </table>
    <tableempty v-if="!$loadingRouteData && (!data || (data.list && data.list.length === 0))"></tableempty>
    <d-pagination v-if="data && data.total" :total="data.total" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange"></d-pagination>
    <loading :show="$loadingRouteData"></loading>
		<d-modal title="删除AE" :show.sync="delAEModal.show" width="280" description="确定删除？" :on-ok="delAEModal.action"></d-modal>
    <aeadd v-if="addAEModal.show" :show.sync="addAEModal.show" :title="addAEModal.title"></aeadd>
  </div>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import aeadd from './components/AeEditModal';
  // import ObjectAssign from 'object-assign';

  export default {
    components: {
      aeadd
    },
    data() {
      return {
        addAEModal: {
          show: false,
          title: '添加AE'
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
        delAEModal: {
          show: false,
          action: ''
        }
      };
    },
    route: {
      data: function(transition) {
        this.getAEList(transition);
      }
    },
    methods: {
			/**
				* 获取AE列表
				* @param  {[type]} transition [description]
			*/
      getAEList: function(transition) {
        this.$http.post('/ae/findByParam', this.params).then((res) => {
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

        this.getAEList();
      },
      /**
       * 编辑帐号弹层
       */
      showAeEdit: function(aeObj) {
        this.addAEModal = {
          show: true,
          title: '添加AE'
        };
      },
			/**
       * 删除确认框
       */
      delConfirm: function(id) {
        this.delAEModal = {
          show: true,
          id: id,
          action: () => {
            this.delAE();
          }
        };
      },
			/**
       * 删除AE
       * @return {[type]} [description]
       */
      delAE: function() {
        this.delAEModal.show = false;
        this.$http.post('/ae/delete', {id: this.delAEModal.id}).then((res) => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '删除成功！',
              type: 'success'
            });
            this.getAEList();
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
          location.reload();
        }, 2000);
      }
    },
    events: {
      pageRefresh: function() {
        this.getAEList();
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
  }
</style>