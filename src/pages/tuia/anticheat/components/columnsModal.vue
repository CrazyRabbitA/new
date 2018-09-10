<template>
<!-- 弹出层 -->
  <d-modal :title="title" :show.sync="show" width="840" class="quotamodal" :on-close="onClose">
    <div class="modal-body quota-modal-body" slot="modal-body">
       <div class="check-all">
         <d-checkbox :checked="allcheck" @change="allchecked">全部</d-checkbox>
       </div>
       <div class="quota-list">
        <h1 class="qota-type">广告位数据:</h1>
        <d-checkbox-group :value.sync="colskey">
          <template v-for="(index,col) in checkboxs" track-by="$index">
            <div :key="index" class="quota-item" v-if=" index < 7">
              <d-checkbox  :name="col.key" >{{col.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
       </div>
       <div class="quota-list">
        <h1 class="qota-type">活动数据:</h1> 
        <d-checkbox-group :value.sync="colskey">
          <template v-for="(index,col) in checkboxs" track-by="$index">
            <div :key="index" class="quota-item" v-if="index > 6 && index < 13">
              <d-checkbox  :name="col.key" >{{col.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
       </div> 
       <div class="quota-list">
        <h1 class="qota-type">广告数据:</h1> 
        <d-checkbox-group :value.sync="colskey">
          <template v-for="(index,col) in checkboxs" track-by="$index">
            <div :key="index" class="quota-item" v-if="index > 12 && index < 28">          
              <d-checkbox :name="col.key" >{{col.title}}</d-checkbox>
            </div>  
          </template>
        </d-checkbox-group>
       </div> 
      <div class="quota-list">
        <h1 class="qota-type">转化数据:</h1> 
        <d-checkbox-group :value.sync="colskey">
          <template v-for="(index,col) in checkboxs" track-by="$index">
            <div :key="index" class="quota-item" v-if="index > 27 && index < 35">          
              <d-checkbox :name="col.key" >{{col.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
      </div>
      <div class="quota-list">
        <h1 class="qota-type">媒体收益数据:</h1> 
        <d-checkbox-group :value.sync="colskey">
          <template v-for="(index,col) in checkboxs" track-by="$index">
            <div :key="index" class="quota-item" v-if="index > 34 && index < 41">          
              <d-checkbox :name="col.key" >{{col.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
      </div>
      <div v-show = "isshow" class="quota-list">
        <h1 class="qota-type">其他:</h1> 
        <d-checkbox-group :value.sync="colskey">
          <template v-for="(index,col) in checkboxs" track-by="$index">
            <div :key="index" class="quota-item" v-if="index > 40 && index < 42">          
              <d-checkbox :name="col.key" >{{col.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group> 
      </div>
    </div>
    
    <div class="modal-footer cf" slot="modal-footer">
      <d-button type="primary" :disabled="btnvalid" @click="onOk">确定</d-button>
    </div>
  </d-modal>
</template>
<script>
export default {
  props: {
    isshow: {
      default: false,
      type: Boolean
    },
    title: {
      required: true,
      default: '',
      type: String
    },
    checkboxs: {
      required: true,
      default: ''
    },
    colskey: {
      required: true,
      default: ''
    },
    show: {
      required: true,
      default: false
    },
    onClose: {
      type: Function,
      default: null
    },
    onSave: {
      type: Function,
      default: null
    }
  },
  data() {
    let allcheck = false;
    if (this.colskey.length === this.checkboxs.length) {
      allcheck = true;
    } else {
      allcheck = false;
    }
    return {
      allcheck: allcheck
    };
  },
  methods: {
    onOk() {
      this.onSave(this.colskey);
    },
    change(val) {
      if (val.length === this.checkboxs.length) {
        this.allcheck = true;
      } else {
        this.allcheck = false;
      }
    },
    allchecked() {
      this.allcheck = !this.allcheck;
      if (this.allcheck) {
        this.colskey = [];
        this.checkboxs.map((c) => {
          this.colskey.push(c.key);
        });
      } else {
        this.colskey = [];
      }
    }
  }
};
</script>
<style lang="less">
.quotamodal {
  .modal-dialog {
    height: 500px !important;
  }
  .quota-modal-body {
    height: 500px;
    overflow-y: auto;
  }
  .check-all {
    display: inline-block;
    .icon {
      width: 14px;
      height: 14px;
    }
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
     font-size: 100%;
    }
    .quota-item {
      display: inline-block;
      width: 193px;
    }
  }
}
</style>