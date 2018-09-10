import MessageBox from 'components/basic/MessageBox';
export default {
  data() {
    return {
      roleId: '',
      disRole: true
    };
  },
  ready() {
    let self = this;
    this.$watch('params.roleName', function() {
      if (self.params.roleName && self.params.bizName && self.params.bizName !== '全部') {
        self.disRole = false;
      } else {
        self.disRole = true;
      }
    });
    this.$watch('params.bizName', function() {
      if (self.params.roleName && self.params.bizName && self.params.bizName !== '全部') {
        self.disRole = false;
      } else {
        self.disRole = true;
      }
    });
  },
  methods: {
    /**
     * 添加角色
     */
    addRole() {
      this.$loadingRouteData = true;
      let params = {
        roleEntity: {
          bizName: this.params.bizName,
          roleName: this.params.roleName
        }
      };
      this.$http.post('/chart/role/save', params).then((res) => {
        res = res.json();
        if (res.success) {
          MessageBox({
            title: '添加成功！',
            type: 'success'
          });
          this.params = {
            roleName: '',
            bizName: ''
          };
          this.getRoleList();
        } else {
          this.$loadingRouteData = false;
          MessageBox({
            title: '添加失败！',
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
    },
    /**
     * 删除角色
     */
    delRole(item) {
      this.$http.get(`/chart/role/delete?roleId=${item.id}`, {}).then((res) => {
        res = res.json();
        if (res.success) {
          this.getRoleList();
          MessageBox({
            title: '删除成功！',
            type: 'success'
          });
        } else {
          this.$loadingRouteData = false;
          MessageBox({
            title: '删除失败！',
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
