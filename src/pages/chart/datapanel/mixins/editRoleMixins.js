import MessageBox from 'components/basic/MessageBox';
export default {
  data() {
    return {
      curview: '',
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
    openEdit(item) {
      this.getRolePermissions(item);
    },
    /**
     * 获取角色权限
     */
    getRolePermissions(item) {
      let params = {
        roleId: item.id,
        systemLabel: item.systemLabel
      };
      this.$http.get('/chart/role/cate', {params: params}).then((res) => {
        res = res.json();
        let rolesData = {};
        rolesData.child = res.data.list;
        rolesData.child.forEach(item => {
          item.parentId = res.data.id;
          item.click = false;
          item.name = item.categoryName;
          item.child = item.list;
          item.child.forEach(item1 => {
            item1.parentId = item.id;
            item1.click = false;
            item1.name = item1.categoryName;
            item1.child = item1.queryList;
            item1.child.forEach(item2 => {
              item2.parentId = item1.id;
              item2.id = 'chartQueryId' + item2.chartQueryId;
              item2.click = item2.isCheck;
              // item2.child = item2.queryList;
              item2.name = item2.queryName;
            });
          });
        });
        if (res.success) {
          this.curview = '';
          this.$nextTick(() => {
            this.curview = 'editrolemodal';
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
      // 选中 newlist 中单表的id
      let chartQueryIds = [];
      param.newlist.forEach(item => {
        if ((item + '').indexOf('chartQueryId') !== -1) {
          chartQueryIds.push(Number(item.substring(12)));
        }
      });
      // 选中按钮
      const tagnodes = document.getElementsByName('radio');
      let val = '';
      tagnodes.forEach((ele) => {
        if (ele.checked === true) {
          val = ele.value;
        }
      });
      // debugger
      let params = {
        roleEntity: {
          bizName: this.editModal.item.bizName,
          id: this.editModal.item.id,
          roleName: param.roleName,
          roleLabel: val
        },
        chartQueryIds: chartQueryIds
      };
      this.$http.post('/chart/role/save', params).then((res) => {
        res = res.json();
        if (res.success) {
          MessageBox({
            title: '编辑成功！',
            type: 'success'
          });
          this.getRoleList();
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
    },
    /**
     * 关闭窗口
     */
    onClose: function() {
      this.editModal.show = false;
      setTimeout(() => {
        this.curview = '';
      }, 500);
    }
  }
};
