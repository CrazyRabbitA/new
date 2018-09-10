<template>
 <d-modal effect="fade" :show.sync="show" width="800" class="quotamodal" :on-ok="submit" :on-close="onClose">
   <template slot="modal-body">
     <div class="modal-body">
       <div class="quota-list">
        <h1 class="qota-type">可选指标:</h1>
        <d-checkbox-group :value.sync="checkList">
          <template v-for="(index,item) in visiblecolumns" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.columnTitle">{{item.alias}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
       </div>
     </div>
   </template>
   <div class="modal-footer" slot="modal-footer">
     <d-button class="searchfilter" size="large" type="warning" @click="ok">确认</d-button>
     <d-button size="large" @click="close">取消</d-button>
   </div>
 </d-modal>
</template>
<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
export default {
  props: {
    show: {
      require: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    checkList: {
      require: true,
      default: () => []
    },
    visiblecolumns: {
      require: true,
      default: () => []
    },
    selectChange: {
      require: true,
      default: null
    }
  },
  data() {
    return {

    };
  },
  methods: {
    close() {
      this.show = false;
    },
    ok() {
      this.selectChange();
      this.close();
    }
  }
};
</script>
<style lang="less">
.quotamodal {
  .modal-dialog {
    height: 500px !important;
  }
  .checkbox-group {
    display: inline-block;
    padding-left: 10px;
    width: 100%;
    .d-checkbox-control {
      padding-left: 18px;
      margin-right: 20px;
      .icon {
        width: 14px;
        height: 14px;
      }
    }
  }
  .quota-list {
    margin-bottom: 20px;
    .qota-type {
      margin-bottom: 10px;
      font-size: 100%;
    }
    .quota-item {
      display: inline-block;
      width: 180px;
    }
  }
}
</style>

