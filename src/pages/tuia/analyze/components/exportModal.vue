<template>
 <d-modal effect="fade" :show.sync="show" width="400" class="quotamodal" :on-ok="submit" :on-close="onClose">
  <div class="modal-header" slot="modal-header" style="text-align:right">
    <i @click="close" class="quwenicon">&#xe625;</i>
   </div>
   <template slot="modal-body">
     <div class="modal-body">
       <span class="exportbtn" @click="exportdata(1)">分日导出</span>
       <span class="exportbtn" @click="exportdata(2)">汇总导出</span>
     </div>
   </template>
   <div class="modal-footer" slot="modal-footer">

   </div>
 </d-modal>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    exportdata(type) {
      this.$emit('to-parent', {
        show: false,
        data: type
      });
    },
    close() {
      this.$emit('to-parent', {
        show: false,
        data: ''
      });
    }
  }
};
</script>
<style lang="less">
.exportbtn{
  display: block;
  width:80%;
  margin:auto;
  margin-top:40px;
  background: #ff795c;
  height:40px;
  line-height: 40px;
  text-align: center;
  color:#fff;
  font-size:18px;
  cursor:pointer;
}
</style>

