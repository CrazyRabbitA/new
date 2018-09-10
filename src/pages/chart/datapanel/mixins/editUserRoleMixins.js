import MessageBox from 'components/basic/MessageBox';
export default {
  data() {
    return {
      curRoleview: '',
      item: {
        clickList: [],
        cancelClickList: []
      },
      editModal: {
        show: false
      }
    };
  },
  methods: {
    /**
     * 打开编辑
     */
    openRolesEdit(item) {
      this.getAdminRoles(item);
    },
    /**
     * 获取角色权限
     */
    getAdminRoles(item) {
      let params = {
        adminId: item.id
      };
      this.$http.get('/chart/user/role', {params: params}).then((res) => {
        res = res.json();
        let rolesData = {};
        rolesData.child = res.data.roles;
        rolesData.child.forEach(item => {
          item.id = item.roleId;
          item.click = item.isCheck;
          item.name = item.roleName;
        });
        if (res.success) {
          this.curRoleview = '';
          this.$nextTick(() => {
            this.curRoleview = 'edituserrolemodal';
            this.editModal = {
              show: true,
              roles: rolesData.child,
              item: item
            };
          });
        }
      }, (res) => {
      });
    },
    /**
     * 打开编辑
     */
    saveEdit(param) {
      this.$loadingRouteData = true;

      let params = {
        adminId: this.editModal.item.id,
        // clickList: JSON.stringify(param.newlist),
        // cancelClickList: JSON.stringify(param.cancelClickList)
        roleIds: param.newlist
      };
      this.$http.post('/chart/user/bind', params).then((res) => {
        res = res.json();
        if (res.success) {
          MessageBox({
            title: '编辑成功！',
            type: 'success'
          });
          this.getUsersList();
        } else {
          this.$loadingRouteData = false;
          MessageBox({
            title: '编辑失败！',
            type: 'error'
          });
        }
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
