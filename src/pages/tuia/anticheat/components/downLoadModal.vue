<template>
  <d-modal :title="title" :show.sync="downloadmodal.show" width="300" :on-close="onClose">
      <div class="modal-body" slot="modal-body">
        <div class="down-btn-warp">  
          <div class="down-btn" @click="tableDownload('part')">分日导出</div>
          <div class="down-btn" @click="tableDownload('all')">汇总导出</div>
        </div>
      </div>
      <div class="modal-footer cf" slot="modal-footer">
      </div>
  </d-modal>
</template>
<script>
export default {
  props: {
    downloadmodal: {
      required: true,
      type: Object,
      defalut: null
    },
    paramsapp: {
      required: true,
      type: Object,
      defalut: null
    },
    paramsslot: {
      required: true,
      type: Object,
      defalut: null
    }
  },
  methods: {
    onOk() {
      this.onSave(this.colskey);
    },
    formatParams(data) {
      // 格式化参数
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
      }
      return arr.join('&');
    },
    tableDownload(type) {
      if (this.downloadmodal.type === 'app') {
        if (type === 'all') {
          location.href = '/cheat/monitor/app/download?' + this.formatParams(this.paramsapp);
        } else {
          location.href = '/cheat/monitor/app/period/download?' + this.formatParams(this.paramsapp);
        }
      } else {
        if (type === 'all') {
          location.href = '/cheat/monitor/slot/download?' + this.formatParams(this.paramsslot);
        } else {
          location.href = '/cheat/monitor/slot/period/download?' + this.formatParams(this.paramsslot);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .down-btn-warp {
    padding: 10px 40px;
    .down-btn {
      height: 50px;
      background-color: #ef6b3b;
      border: 1px solid #ef6b3b;
      border-radius: 3px;
      text-align: center;
      line-height: 50px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      &:nth-child(2) {
        margin-top: 30px;
      }
    } 
  }

</style>