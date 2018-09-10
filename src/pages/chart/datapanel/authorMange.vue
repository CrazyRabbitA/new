<template>
  <div>
     <pagetitle title="用户列表"></pagetitle>
     <div class="page-content rolelist">
      <div class="form-inline bottomline cf">
        <div class="form-filter-group">
          <p class="filter-label fl">角色的名称：</p>
          <input type="text" class="form-control" placeholder="请输入角色的名称" v-model="params.name">
        </div>
        <d-button size="large" @click="getUsersList('search')" type="primary" >查询</d-button>
      </div>
    <div class="page-content userslist">
      <table v-if="data && data.table">
        <thead>
        <tr class="tr-header">
          <th>ID</th>
          <th>姓名</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tr-items" v-for="(index, item) in data.table">
            <td style="min-width: 20px">{{item.id}}</td>
            <td>{{item.name}}</td>
            <td class="td-actions">
              <p>
                <a href="javascript:void(0)" @click="openRolesEdit(item)">角色分配</a>
              </p>
            </td>
        </tr>
        </tbody>
      </table>
      <!-- <tableempty v-if="!$loadingRouteData && (!data ||  data.table && data.table.length === 0))"></tableempty> -->
      <d-pagination v-if="data && data.count" :total="data.count" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange"></d-pagination>
      <loading :show="$loadingRouteData"></loading>
      <component :is="curRoleview" :title="editModal.item.name + '角色编辑'" :show.sync="editModal.show" :datas.sync="editModal" :on-save="saveEdit"></component>
    </div>
  </div>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import edituserrolemodal from './components/editUserRoleModal';
  import edituserrolemixins from './mixins/editUserRoleMixins';

  export default {
    components: {
      edituserrolemodal
    },
    mixins: [edituserrolemixins],
    data() {
      return {
        data: {},
        params: {
          pageNum: 1,
          pageSize: 20,
          name: ''
        },
        syslist: []
      };
    },

    route: {
      data: function(transition) {
        this.getUsersList(transition);
      }
    },

    methods: {
      /**
       * 分页
       */
      onPageChange(val) {
        /**
         * 当前页不发送请求
         */
        if (val === this.params.pageNum) {
          return;
        }
        this.params.pageNum = val;
        this.getUsersList();
      },
      /**
       * 获取账号列表
       */
      getUsersList(type) {
        if (type === 'search') {
          this.params.pageNum = 1;
        }
        this.$loadingRouteData = true;
        this.$http.post('/chart/user', this.params).then((res) => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
          } else {
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
      }
    }
  };
</script>

<style lang="less" scoped>
  .userslist{
    .form-inline {
      margin-bottom: 10px;
    }
    .filter-label {
      text-align: left;
    }
    .td-actions {
      min-width: 220px;
    }
  }
</style>
