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
            <span>版本：</span>
            <p>
                <input id = 'checkver' @click='chooseAll($event)' class='checkall' type="checkbox">
                <span>全选</span>
            </p>
            <!-- <d-checkbox @click='chooseAll'>全选</d-checkbox> -->
        </h2>
        <ul class='item-wrapper'>
            <li  
            class='getver'
            :verId = 'index' 
            @click.native.stop='getItemActive($event,item)'
            v-for = '(index,item) in dataver' track-by="$index"> {{item}}</li>
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
    dataver: {
      default() {
        return [];
      },
      type: Array
    },
    dataverchild: {
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
      const nodes = document.querySelectorAll('.getver');
      if (e.target.checked === true) {
        nodes.forEach((item, index) => {
          if (item.innerText.length >= 1) {
            addClass(item, 'verActive');
          }
        });
      } else {
        nodes.forEach((item, index) => {
          removeClass(item, 'verActive');
        });
      }
        // 数据传递
      const nodeArr = document.querySelectorAll('.verActive');
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('verId');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.$emit('datavers', textArr);
    },
    close() {
      const nodes = document.querySelectorAll('.getver');
      nodes.forEach((item, index) => {
        removeClass(item, 'verActive');
      });
      // 取消全选按钮
      document.getElementById('checkver').checked = false;
      // if (document.querySelectorAll('.verActive').length <= 0) {
      //   MessageBox({
      //     title: '未选择版本号！',
      //     type: 'error'
      //   });
      //   return;
      // }
      // 关闭的时候
      // this.$emit('tover');
      this.$emit('datavers', []);
      this.$emit('closever');
    },
    onOk() {
      if (document.querySelectorAll('.verActive').length <= 0) {
        MessageBox({
          title: '未选择版本号！',
          type: 'error'
        });
        return;
      }
      this.$emit('tover');
    },
    getItemActive(e, item) {
      if (item === undefined) {
        return false;
      }
      const isAct = hasClass(e.target, 'verActive');
      if (!isAct) {
        addClass(e.target, 'verActive');
      } else {
        removeClass(e.target, 'verActive');
      }
      const nodeArr = document.querySelectorAll('.verActive');
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('verId');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.$emit('datavers', textArr);
        // 判断全选
      let _len = 0;
      const parentnodes = document.querySelectorAll('.getver');
      parentnodes.forEach(ele => {
        if (ele.innerText.length >= 1) {
          _len++;
        }
      });
      if (nodeArr.length === _len) {
        document.getElementById('checkver').checked = 'checked';
      } else {
        document.getElementById('checkver').checked = false;
      }
    }
  },
  ready() {
    this.$watch('show', val => {
      if (this.show) {
        // 判断全选 非全选
        let _len = 0;
        this.dataver.forEach(ele => {
          if (ele !== undefined) {
            _len++;
          }
        });
        if (document.querySelectorAll('.verActive').length < _len) {
          document.getElementById('checkver').checked = false;
        } else if (document.querySelectorAll('.verActive').length > 0 && _len > 0 && document.querySelectorAll('.verActive').length === _len) {
          document.getElementById('checkver').checked = true;
        }
      }
    });
  },
  watch: {
    dataverchild(newval) {
      setTimeout(() => {
        const nodes = document.querySelectorAll('.getver');
        nodes.forEach((item, index) => {
          removeClass(item, 'verActive');
          newval.forEach(ele => {
            if (item.getAttribute('verId').toString() === ele.id.toString() && item.getAttribute('verId') && ele.id) {
              addClass(item, 'verActive');
            }
          });
        });
        // const nodes1 = document.querySelectorAll('.verActive');
        // let _count = 0;
        // nodes1.forEach(ele => {
        //   if(ele){
        //     _count++
        //   }
        // })
        // if(nodes1.length === _count){
        //    document.getElementById('checkver').checked = true;
        // }
      }, 20);
    }
  }
};
</script>
<style lang="less">
.dimen-wrapper {
  .verActive {
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
