<template>
  <d-modal 
  :title="title" id="asd" 
  :show.sync="show"  width="70%"  class="quotamodal dimen-wrapper">
    <div slot='modal-header'>
        <div class="modal-header">
            <i class="iconhandle close" @click="close">&#xe609;</i>
        </div>
    </div>
    <div ref="modal"  class="modal-body quota-modal-body charts-wraper" slot="modal-body" >
        <h2 class="title"> 
            <span>渠道：</span>
            <p>
                <input id = 'checksou' @click='chooseAll($event)' class='checkall' type="checkbox">
                <span>全选</span>
            </p>
            <!-- <d-checkbox @click='chooseAll'>全选</d-checkbox> -->
        </h2>
        <ul class='item-wrapper'>
            <li  
            class='getsou'
            :souId = 'index' 
            @click.native.stop='getItemActive($event,item)'
            v-for = '(index,item) in datasou' track-by="$index"> {{item === '1'? '未知':item}}</li>
        </ul>
    </div>   
    <div slot="modal-footer">
       <div class="modal-footer">
            <d-button type="primary" size="large" @click="onOk">确定</d-button>
            <!-- <d-button size="large" @click="close">取消</d-button> -->
        </div>
    </div>
    
  </d-modal>
</template>
<script>
import { hasClass, removeClass, addClass } from '../mixins/dom';
import MessageBox from 'components/basic/MessageBox';
export default {
  components: {
    MessageBox
  },
  props: {
    title: {
      required: true,
      default: '',
      type: String
    },

    chartdata: {
      type: Object,
      default() {
        return {};
      }
    },
    show: {
      default: true,
      type: Boolean
    },
    datasou: {
      default() {
        return [];
      },
      type: Array
    },
    datasouchild: {
      default() {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {

    };
  },
  methods: {
    chooseAll(e) {
        // 全选
      const nodes = document.querySelectorAll('.getsou');
      if (e.target.checked === true) {
        nodes.forEach((item, index) => {
          if (item.innerText.length >= 1) {
            addClass(item, 'souActive');
          }
        });
      } else {
        nodes.forEach((item, index) => {
          removeClass(item, 'souActive');
        });
      }
        // 数据传递
      const nodeArr = document.querySelectorAll('.souActive');
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('souId');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.$emit('datasous', textArr);
    },
    close() {
      const nodes = document.querySelectorAll('.getsou');
      nodes.forEach((item, index) => {
        removeClass(item, 'souActive');
      });
      // if (document.querySelectorAll('.souActive').length <= 0) {
      //   MessageBox({
      //     title: '未选择渠道号！',
      //     type: 'error'
      //   });
      //   return;
      // }
      // 关闭的时候
      document.getElementById('checksou').checked = false;
      // this.$emit('tosou');
      this.$emit('closesou');
      this.$emit('datasous', []);
    },
    onOk() {
      if (document.querySelectorAll('.souActive').length <= 0) {
        MessageBox({
          title: '未选择渠道号！',
          type: 'error'
        });
        return;
      }
      this.$emit('tosou', 'load');
    },
    getItemActive(e, item) {
      if (item === undefined) {
        return false;
      }
      const isAct = hasClass(e.target, 'souActive');
      if (!isAct) {
        addClass(e.target, 'souActive');
      } else {
        removeClass(e.target, 'souActive');
      }
      const nodeArr = document.querySelectorAll('.souActive');
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('souId');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.$emit('datasous', textArr);
        // 判断全选
      let _len = 0;
      const parentnodes = document.querySelectorAll('.getsou');
      parentnodes.forEach(ele => {
        if (ele.innerText.length >= 1) {
          _len++;
        }
      });
      if (nodeArr.length === _len) {
        document.getElementById('checksou').checked = 'checked';
      } else {
        document.getElementById('checksou').checked = false;
      }
    },
    getDataObj() {}
  },
  ready() {
    this.$watch('show', val => {
      if (this.show) {
        // if (document.querySelectorAll('.souActive').length < this.datasou.length) {
        //   document.getElementById('checksou').checked = false;
        // }
        let _len = 0;
        this.datasou.forEach(ele => {
          if (ele !== undefined) {
            _len++;
          }
        });
        if (document.querySelectorAll('.souActive').length < _len) {
          document.getElementById('checksou').checked = false;
        } else if (document.querySelectorAll('.souActive').length > 0 && _len > 0 && document.querySelectorAll('.souActive').length === _len) {
          document.getElementById('checksou').checked = true;
        }
      }
    });
  },
  watch: {
    datasouchild(newval) {
      setTimeout(() => {
        const nodes = document.querySelectorAll('.getsou');
        nodes.forEach((item, index) => {
          removeClass(item, 'souActive');
          newval.forEach(ele => {
            if (item.getAttribute('souId').toString() === ele.id.toString() && item.getAttribute('souId') && ele.id) {
              addClass(item, 'souActive');
            }
          });
        });
      }, 20);
    }
  }
};
</script>
<style lang="less">
.dimen-wrapper {
  .souActive {
    background: #FFC715;
  }
  .modal-title {
    text-align: center;
  }
  .title {
    span:nth-of-type(1) {
      font-size: 18px;
      margin-right: 10px;
    }
    p{
        display: inline-block;
        height:20px;
        margin-top:5px;
      .checkall {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        span{
            font-size:14px !important;
            font-weight: normal;
            vertical-align:2px
        }
    }
    
  }
  .item-wrapper {
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
    max-width: 596px;
    display: inline-block;
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
</style>
