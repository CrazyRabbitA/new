export default {
  data() {
    return {
      batchModalShow: false,
      batchtitle: '导出',
      curview: ''
    };
  },

  methods: {
    /**
     * 导出
     */
    tuiaGoodsExport: function() {
      this.curview = 'tuiaGoodsExportmodal';
      this.batchtitle = '导出';
      this.batchModalShow = true;
    },
    /**
     * 关闭窗口
     */
    onClose: function() {
      this.batchModalShow = false;
      setTimeout(() => {
        this.curview = '';
      }, 500);
    }
  }
};
