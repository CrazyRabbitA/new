export default {
  data() {
    return {
      curView: '',
      colModal: {
        show: false,
        onClose: '',
        colSave: '',
        columns: '',
        colskey: ''
      },
      downloadmodal: {
        type: 'app',
        show: false
      }
    };
  },
  methods: {
    /**
     * 打开table列自定义
     */
    // 媒体
    openCol() {
      this.curView = 'columnsmodal';
      this.showMask = false;
      this.colModal = {
        show: true,
        onClose: this.onCloseFun,
        colSave: this.colSaveFun,
        columns: this.columns,
        colskey: this.colskey
      };
    },
    /**
     * 打开table列自定义
     */
    // 广告
    openSlotCol() {
      this.showMask = true;
      this.curView = 'columnsmodal';
      this.colModal = {
        show: true,
        onClose: this.onCloseFun,
        colSave: this.colSaveFun2,
        columns: this.columns2,
        colskey: this.colskey2
      };
    },
    /**
     * 路由跳转--------------媒体-------------------------
     */
    clickModel(e) {
      // alert('ok1')
      let dom = e.currentTarget;
      let appid = dom.getAttribute('appid');

      window.open(window.location.origin +
      window.location.pathname + `#!/anticheat/cheat/${appid}/${this.params.startDate}/${this.params.endDate}/1`);
    },
    /**
     * 路由跳转------------广告---------------------------
     */
    clickModel2(e) {
      let dom = e.currentTarget;
      let slotid = dom.getAttribute('slotid');

      window.open(window.location.origin +
        window.location.pathname + `#!/anticheat/cheat/${slotid}/${this.params2.startDate}/${this.params2.endDate}/2`);
    },
    /**
     * 保存col
     */
    colSaveFun(key) {
      let changecol = this.columns.filter((c) => {
        return key.indexOf(c.key) !== -1;
      });
      this.colskey = key;
      this.cols = changecol;
      localStorage.colskey = JSON.stringify(key);
      this.onClose();
    },
    /**
     * 保存col
     */
    colSaveFun2(key) {
      let changecol = this.columns2.filter((c) => {
        return key.indexOf(c.key) !== -1;
      });
      this.colskey2 = key;
      this.cols2 = changecol;
      localStorage.colskey2 = JSON.stringify(key);
      this.onClose();
    },
    /**
     * 打开速查
     */
    openSearch() {
      this.curSearchView = 'appidsearchmodal';
      this.searchModalShow = true;
    },
    /**
     * 保存
     */
    searchSave(key) {
      this.params.appIds = key.join(',');
      this.onClose();
    },
    /**
     * 筛选查询
     */
    doMediafilter() {
      this.$loadingRouteData = true;
      this.params.page = 1;
      this.getPageApp();
    },
    /**
     * 筛选查询
     */
    doSlotfilter() {
      this.$loadingRouteData = true;
      this.params.page = 1;
      this.getPageSlot();
    },
    /**
     * 导出
     */
    pageAppDownload() {
      this.downloadmodal = {
        type: 'app',
        show: true
      };
    },
    /**
     * 导出
     */
    pageSlotDownload() {
      this.downloadmodal = {
        type: 'slot',
        show: true
      };
    },
    /**
     * 关闭窗口
     */
    onClose() {
      this.colModal.show = false;
      setTimeout(() => {
        this.curView = '';
      }, 500);
    }
  }
};
