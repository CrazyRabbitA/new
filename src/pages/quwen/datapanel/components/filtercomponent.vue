<template>
  <modals
  :title="title"
  :show.sync="show"  width="70%"  class="quotamodal dimen-wrapper">
    <div slot='modal-header'>
        <div class="modal-header">
            <i class="iconhandle close"  @click="close">&#xe609;</i>
        </div>
    </div>
    <div ref="modal"  class="modal-body quota-modal-body charts-wraper" slot="modal-body" >
        <h2 class="top-title">
            <p class="title-item">{{title}}</p>
            <p class="check-box">
                <input @click="checkall"  class='checkall' :checked="isTrue" type="checkbox">
                <span>全选</span>
            </p>
        </h2>
        <ul class='item-wrapper'>
          <li
            :class="{ 'isActive' : item.active && item.label }"
            @click="getItemActive(index,item)"
            v-for="(index,item) in maskdata"
            :key="index">{{item.label}}</li>
        </ul>
    </div>
    <div slot="modal-footer">
       <div class="modal-footer">
            <d-button type="primary" size="large" @click="onOk">确定</d-button>
            <d-button size="large" @click="close">取消</d-button>
        </div>
        <loading :show="maskdata.length === 0"></loading>
    </div>
  </modals>
</template>
<script>
import modals from '../base/modals';
export default {
  components: {
    modals
  },
  props: {
    title: {
      required: true,
      default: '',
      type: String
    },
    show: {
      default: true,
      type: Boolean
    },
    maskdata: {
      type: Array,
      default: []
    },
    propdata: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isTrue: false,
      maskdatas: []
    };
  },
  methods: {
    close() {
      this.$emit('getmask', this.propdata);
    },
    onOk() {
      const emitData = this.maskdata.filter((item) => {
        return item.active === true && item.label;
      });
      this.$emit('getmask', emitData);
    },
    // 全选
    checkall() {
      this.isTrue = !this.isTrue;
      if (this.isTrue) {
        this.maskdata.map((item, index) => {
          item.active = true;
          return item;
        });
      } else {
        this.maskdata.map((item, index) => {
          item.active = false;
          return item;
        });
      }
    },
    getItemActive(index, item) {
      item.active = !item.active;
      // 全选 -- 反选
      this.isTrue = !this.maskdata.some((ditem) => ditem.label && !ditem.active);
    }
  },
  ready() {
    // 全选处理
    this.maskdata.forEach((ele) => {
      ele.active = false;
    });
    this.propdata.forEach((ditem) => {
      this.maskdata.map((item, i) => {
        if (ditem.label === item.label && ditem.label) {
          ditem.active = true;
          item.active = true;
        }
        return ditem;
      });
    });
    // 全选
    this.isTrue = !this.maskdata.some((ditem) => ditem.label && !ditem.active);
  },
  watch: {
    propdata(val) {
      this.maskdata.forEach((ele) => {
        ele.active = false;
      });
      this.propdata.forEach((ditem) => {
        this.maskdata.forEach((item, i) => {
          if (ditem.label === item.label && ditem.label) {
            ditem.active = true;
          }
          return ditem;
        });
      });
      this.isTrue = !this.maskdata.some((ditem) => ditem.label && !ditem.active);
    }
  }
};
</script>
<style lang="less" scoped>
.dimen-wrapper {
  .isActive {
    background: #ffc715;
  }
  .modal-title {
    text-align: center;
  }
  .top-title {
    min-height:34px;
    .title-item {
      font-size: 18px;
      margin-right: 10px;
      float:left;
    }
    .check-box {
      float:left;
      height: 20px;
      height:34px;
      line-height: 38px;
      .checkall {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      span {
        font-size: 14px !important;
        font-weight: normal;
        vertical-align: 2px;
      }
      .icon{
        width:16px;
        height:16px;
      }
    }
  }
  .item-wrapper {
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
    max-width: 596px;
    display: inline-block;
    margin-top:10px;
    li {
      float: left;
      width: 119px;
      line-height: 30px;
      height: 30px;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      text-align: center;
      cursor: pointer;
    }
  }
}
.modal-open{
  // overflow: auto!important
}
</style>
