<template>
  <div>
    <pagetitle title="角色列表"></pagetitle>
    <div class="page-content rolelist">
      <div class="form-inline bottomline cf">
        <div class="form-filter-group">
          <p class="filter-label fl">角色的名称：</p>
          <input type="text" class="form-control" placeholder="请输入角色的名称" v-model="params.roleName">
        </div>
        <div class="form-filter-group">
          <p class="filter-label fl" style="width: 50px">业务：</p>
          <d-select :options.sync="bizOpt" id="bizName" label="bizName" :value.sync="params.bizName"></d-select>
        </div>
        <d-button size="large" @click="addRole" type="primary" :disabled="disRole">添加角色</d-button>
      </div>
      <table v-if="data">
        <thead>
        <tr class="tr-header">
          <th>角色名称</th>
          <th>业务</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tr-items" v-for="(index, item) in data"  v-show="item.bizName == params.bizName || params.bizName === '全部'">
            <td>{{item.roleName}}</td>
            <td>{{item.bizName}}</td>
            <td class="td-actions">
              <p>
                <a href="javascript:void(0)" @click="openEdit(item)">编辑</a>
                <a href="javascript:void(0)" @click="delRole(item)">删除</a>
              </p>
            </td>
        </tr>
        </tbody>
        
      </table>
      <tableempty v-if="!$loadingRouteData && (!data || (data && data.length === 0))"></tableempty>
      <loading :show="$loadingRouteData"></loading>
      <component :is="curview" title="角色编辑" :show.sync="editModal.show" :on-close="onClose" :datas.sync="editModal" :on-save="saveEdit"></component>
    </div>
  </div>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import rolemixins from './mixins/RoleMixins';
  import editrolemixins from './mixins/editRoleMixins';
  import editrolemodal from './components/EditRoleModal';
  
  const bizOptArr = [
    {
      label: '全部',
      id: '全部'
    },
    {
      label: '推啊',
      id: '推啊'
    },
    {
      label: '兑吧',
      id: '兑吧'
    },
    {
      label: '百奇',
      id: '百奇'
    },
    {
      label: '有粉',
      id: '有粉'
    },
    {
      label: '娃娃机',
      id: '娃娃机'
    }
  ];
  export default {
    components: {
      editrolemodal
    },
    mixins: [rolemixins, editrolemixins],
    data() {
      return {
        data: {},
        params: {
          roleName: '',
          bizName: '',
          chartQueryIds: []
        },
        bizOpt: bizOptArr
      };
    },

    route: {
      data: function(transition) {
        // this.getsysList();
        this.getRoleList(transition);
      }
    },

    methods: {
      /**
       * 获取角色列表
       */
      getRoleList(transition) {
        this.$http.post('/chart/role', {}).then((res) => {
          res = res.json();
          if (res.success) {
            if (transition) {
              transition.next({
                'data': res.data
              });
            } else {
              this.$set('data', res.data);
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
      }
    }
  };
</script>

<style lang="less" scoped>
  .rolelist{
    .form-inline {
      margin-bottom: 10px;
    }
    .filter-label {
      text-align: left;
    }
    .td-actions {
      width: 230px;
    }
  }
</style>
