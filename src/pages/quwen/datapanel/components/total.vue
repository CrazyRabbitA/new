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
                <input id = 'checkvers' @click='chooseAll1($event)' class='checkall' type="checkbox">
                <span>全选</span>
            </p>
        </h2>
        <ul class='item-wrapper'>
            <li
            class='getvers'
            :verIds = 'index' 
            :key='index'
            @click.native.stop='getItemActive1($event,item)'
            v-for = '(index,item) in datatol.dataver' track-by="$index"> {{item}}</li>
        </ul>

        <h2 class="title"> 
            <span>渠道：</span>
            <p>
                <input id = 'checksous' @click='chooseAll2($event)' class='checkall' type="checkbox">
                <span>全选</span>
            </p>
        </h2>
        <ul class='item-wrapper'>
            <li
            class='getsous'
            :souIds = 'index' 
            :key='index'
            @click.native.stop='getItemActive2($event,item)'
            v-for = '(index,item) in datatol.datasou' track-by="$index"> {{item === '1'? '未知':item}}</li>
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
import MessageBox from 'components/basic/MessageBox';
import { hasClass, removeClass, addClass } from '../mixins/dom';
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
    datatol: {
      default() {
        return {};
      },
      type: Object
    },
    datatolchild: {
      default() {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {
      obj: {},
      datasouchild: [],
      dataverchild: []
    };
  },
  methods: {
    // 版本全选
    chooseAll1(e) {
      const nodes = document.querySelectorAll('.getvers');
      if (e.target.checked === true) {
        nodes.forEach((item, index) => {
          if (item.innerText.length >= 1) {
            addClass(item, 'verActives');
          }
        });
      } else {
        nodes.forEach((item, index) => {
          removeClass(item, 'verActives');
        });
      }
        // 数据传递
      const nodeArr = document.querySelectorAll('.verActives');
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('verIds');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.dataverchild = textArr;
      this.obj = {datasouchild: this.datasouchild, dataverchild: this.dataverchild};
      this.$emit('datatols', this.obj);
    },
    // 渠道全选
    chooseAll2(e) {
        // 全选
      const nodes = document.querySelectorAll('.getsous');
      if (e.target.checked === true) {
        nodes.forEach((item, index) => {
          if (item.innerText.length >= 1) {
            addClass(item, 'souActives');
          }
        });
      } else {
        nodes.forEach((item, index) => {
          removeClass(item, 'souActives');
        });
      }
      //
        // 数据传递
      const nodeArr = document.querySelectorAll('.souActives');
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('souIds');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.datasouchild = textArr;
      this.obj = {datasouchild: this.datasouchild, dataverchild: this.dataverchild};
      this.$emit('datatols', this.obj);
    },
    close() {
      const nodes1 = document.querySelectorAll('.getvers');
      nodes1.forEach((item, index) => {
        removeClass(item, 'verActives');
      });
      const nodes2 = document.querySelectorAll('.getsous');
      nodes2.forEach((item, index) => {
        removeClass(item, 'souActives');
      });
      // if (document.querySelectorAll('.verActives').length <= 0 || document.querySelectorAll('.souActives').length <= 0) {
      //   MessageBox({
      //     title: '未选择渠道号或版本号！',
      //     type: 'error'
      //   });
      //   return;
      // }
      // const _len = (document.querySelectorAll('.verActives').length) * (document.querySelectorAll('.souActives').length);
      // if (_len > 10) {
      //   MessageBox({
      //     title: '所选渠道号或版本号不能超过10个！',
      //     type: 'error'
      //   });
      //   return;
      // }
      // 关闭的时候
      // this.$emit('totol');
      //
      document.getElementById('checkvers').checked = false;
      document.getElementById('checksous').checked = false;
      this.$emit('closetol');
      this.$emit('datatols', {});
    },
    onOk() {
      if (document.querySelectorAll('.verActives').length <= 0 || document.querySelectorAll('.souActives').length <= 0) {
        MessageBox({
          title: '未选择渠道号或版本号！',
          type: 'error'
        });
        return;
      }
      const _len = (document.querySelectorAll('.verActives').length) * (document.querySelectorAll('.souActives').length);
      if (_len > 10) {
        MessageBox({
          title: '所选渠道号或版本号不能超过10个！',
          type: 'error'
        });
        return;
      }
      this.$emit('totol', 'load');
    },
    // 版本数据传递
    getItemActive1(e, item) {
      if (item === undefined) {
        return false;
      }
      const isAct1 = hasClass(e.target, 'verActives');
      if (!isAct1) {
        addClass(e.target, 'verActives');
      } else {
        removeClass(e.target, 'verActives');
      }
        // 全选判断
      const nodeArr = document.querySelectorAll('.verActives');
      let _len = 0;
      const parentnodes = document.querySelectorAll('.getvers');
      parentnodes.forEach(ele => {
        if (ele.innerText.length >= 1) {
          _len++;
        }
      });
      if (nodeArr.length === _len) {
        document.getElementById('checkvers').checked = 'checked';
      } else {
        document.getElementById('checkvers').checked = false;
      }
        // 数据传递
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('verIds');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.dataverchild = textArr;
      this.obj = {datasouchild: this.datasouchild, dataverchild: this.dataverchild};
      this.$emit('datatols', this.obj);
    },
    // 渠道数据传递
    getItemActive2(e, item) {
      if (item === undefined) {
        return false;
      }
      const isAct = hasClass(e.target, 'souActives');
      if (!isAct) {
        addClass(e.target, 'souActives');
      } else {
        removeClass(e.target, 'souActives');
      }
      const nodeArr = document.querySelectorAll('.souActives');

        // this.$emit("datatols", textArr);
        // 判断全选
      let _len = 0;
      const parentnodes = document.querySelectorAll('.getsous');
      parentnodes.forEach(ele => {
        if (ele.innerText.length >= 1) {
          _len++;
        }
      });
      if (nodeArr.length === _len) {
        document.getElementById('checksous').checked = 'checked';
      } else {
        document.getElementById('checksous').checked = false;
      }
        // 数据传递
      let textArr = [];
      nodeArr.forEach(ele => {
        const text = ele.innerText;
        const id = ele.getAttribute('souIds');
        textArr.push({
          labName: text,
          id: id
        });
      });
      this.datasouchild = textArr;
      this.obj = {datasouchild: this.datasouchild, dataverchild: this.dataverchild};
      this.$emit('datatols', this.obj);
    }
  },
  ready() {
    // 页面进入全选判断
    this.$watch('show', val => {
      if (this.show) {
        let _len1 = 0;
        if (this.datatol.datasou) {
          this.datatol.datasou.forEach(ele => {
            if (ele !== undefined) {
              _len1++;
            }
          });
          if (document.querySelectorAll('.souActives').length < _len1) {
            document.getElementById('checksous').checked = false;
          } else if (document.querySelectorAll('.souActives').length > 0 && _len1 > 0 && document.querySelectorAll('.souActives').length === _len1) {
            document.getElementById('checksous').checked = true;
          }
        }
        let _len2 = 0;
        if (this.datatol.dataver) {
          this.datatol.dataver.forEach(ele => {
            if (ele !== undefined) {
              _len2++;
            }
          });
          if (document.querySelectorAll('.verActives').length < _len2) {
            document.getElementById('checkvers').checked = false;
          } else if (document.querySelectorAll('.verActives').length > 0 && _len2 > 0 && document.querySelectorAll('.verActives').length === _len2) {
            document.getElementById('checkvers').checked = true;
          }
        }
        // if (this.datatolchild.dataverchild && document.querySelectorAll('.verActives').length < this.datatol.dataver.length) {
        //   document.getElementById('checkvers').checked = false;
        // };
        // if (this.datatolchild.datasouchild && document.querySelectorAll('.souActives').length < this.datatol.datasou.length) {
        //   document.getElementById('checksous').checked = false;
        // }
      }
    });
  },
  watch: {
    datatolchild: {
      handler(newval) {
        setTimeout(() => {
            // 版本
          const nodes2 = document.querySelectorAll('.getvers');
          nodes2.forEach((item, index) => {
            removeClass(item, 'verActives');
            if (newval.dataverchild) {
              newval.dataverchild.forEach(ele => {
                if (item.getAttribute('verIds').toString() === ele.id.toString() && item.getAttribute('verIds') && ele.id) {
                  addClass(item, 'verActives');
                }
              });
            }
          });
          // 渠道
          const nodes1 = document.querySelectorAll('.getsous');
          nodes1.forEach((item, index) => {
            removeClass(item, 'souActives');
            if (newval.datasouchild) {
              newval.datasouchild.forEach(ele => {
                if (item.getAttribute('souIds').toString() === ele.id.toString() && item.getAttribute('souIds') && ele.id) {
                  addClass(item, 'souActives');
                }
              });
            }
          });
        }, 20);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less">
.dimen-wrapper {
  .verActives {
    background: #FFC715;
  }
  .souActives {
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
