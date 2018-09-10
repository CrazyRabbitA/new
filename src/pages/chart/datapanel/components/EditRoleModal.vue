<template>
  <d-modal :title="title" :show.sync="show" width="500" :on-ok="onOk" :on-close="onClose">
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="control-label">角色名称：</label>
          <input type="text" class="form-control" v-model="roleName">
        </div>
        <div class="radio-wrapper">
          <div class="verify-tag" >内容权限标签：</div>
          <div class="radio-item">
            <p><input  type="radio" name="radio" value="1"/><span>&nbsp;媒体运营</span></p>
            <p><input  type="radio" name="radio" value="2"/><span>&nbsp;媒介运营</span></p>
            <p><input  type="radio" name="radio" value="3"/><span>&nbsp;活动运营</span></p>
            <p><input  type="radio" name="radio" value="4"/><span>&nbsp;AE</span></p>
            <p><input  type="radio" name="radio" value="5"/><span>&nbsp;销售</span></p>
            <p><input  type="radio" name="radio" value="0"/><span>&nbsp;无</span></p>
          </div>
        </div>
        <div class="form-group cf" style="margin-bottom: 0;padding-left: 0;">
          <ul class="tree">
            <tree-doc :model.sync="items" v-for="(index, items) in datas.roles" :click="true"></tree-doc>
          </ul>
        </div>
        
      </div>
  </d-modal>
</template>
<script>
export default {
  props: {
    datas: {
      default: ''
    },
    title: {
      required: true,
      default: '',
      type: String
    },
    show: {
      required: true,
      default: false
    },
    onSave: {
      type: Function,
      default: null
    },
    onClose: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      newlist: [],
      oldlist: [],
      cancelClickList: [],
      roleName: this.datas.item.roleName,
      need: this.datas
    };
  },
  ready() {
    this.ckForEach(this.datas.roles, this.oldlist);
    const label = this.need.item.roleLabel;
    const nodes = document.getElementsByName('radio');
    nodes.forEach((ele) => {
      if (label === parseInt(ele.value)) {
        ele.checked = true;
        return;
      }
    });
  },
  events: {
    'changebox': function(model) {
      let curpObj = this.getParent(model);
      let curcObj = this.getChild(model);
      if (curpObj && curpObj.child) {
        let temp = curpObj.child && curpObj.child.filter((item) => {
          return item.click;
        });
        curpObj.click = (temp.length > 0);
      }

      if (model.click) {
        if (curcObj) {
          this.agForEach(curcObj, true);
        }
      } else {
        if (curcObj) {
          this.agForEach(curcObj, false);
        }
      }
    }
  },
  methods: {
    onOk() {
      let cklist = [];
      this.ckForEach(this.datas.roles, this.newlist);

      this.oldlist.forEach((items) => {
        if (this.newlist.indexOf(items) === -1) {
          this.cancelClickList.push(items);
        }
      });
      this.newlist.forEach((items) => {
        // newlist 即为选择中的
        if (this.oldlist.indexOf(items) !== -1) {
          cklist.push(items);
        }
      });

      let param = {
        roleName: this.roleName,
        newlist: this.newlist,
        cancelClickList: this.cancelClickList

      };

      this.onSave(param);
      this.onClose();
    },
    /**
     *  递归
     */
    agForEach(curcObj, flag) {
      curcObj.forEach((i) => {
        i.click = flag;
        if (i.child && i.child.length > 0) {
          this.agForEach(i.child, flag);
        }
      });
    },
    /**
     *  递归
     */
    ckForEach(curcObj, list) {
      curcObj.forEach((i) => {
        if (i.click) {
          list.push(i.id);
        }
        if (i.child && i.child.length > 0) {
          this.ckForEach(i.child, list);
        }
      });
    },
    /**
     *  获取父层节点
     */
    getParent(model) {
      let curObj = '';
      if (model.parentId !== 0) {
        curObj = this.findattr('id', model.parentId, this.datas);
      } else {
        curObj = false;
      }
      return curObj;
    },
    /**
     *  获取子节点
     */
    getChild(model) {
      let curObj = '';
      if (model.child && model.child.length !== 0) {
        curObj = model.child;
      } else {
        curObj = false;
      }
      return curObj;
    },
    getType(obj, lc) {
      var ret;
      if (obj) {
        ret = ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1];
      } else {
        ret = (obj === null) ? 'Null' : 'Undefined';
      }
      return (!lc ? ret.toLowerCase() : ret);
    },
    findattr(attrkey, attrval, data) {
      var self = this;
      data = data || this.attributes;
      function finder(attrkey, attrval, data) {
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            if (self.getType(data[prop]) === 'object' || self.getType(data[prop]) === 'array') {
              var refp = finder(attrkey, attrval, data[prop]);
              if (refp) return refp;
            } else if (prop === attrkey && data[prop] === attrval) {
              return data;
            }
          }
        }
        return false;
      }
      return finder(attrkey, attrval, data);
    }
  },
  watch: {
    datas(val) {
    }
  }
};
</script>
<style lang="less">
  .modal-body {
    .tree {
      max-height: 300px;
      min-height: 200px;
      i {
        height: 14px;
        width: 14px;
      }
    }
    .radio-wrapper{
      // height:40px;
      display: inline-block;
      line-height:40px;
      font-size:14px;
      .verify-tag{
        font-weight:bold;
      }
      div{
        float:left;
        input{
          vertical-align: -1px;
          cursor:pointer;
        }
        p{
          float:left;
          font-size:0px;
          margin-right:15px;
          span{
            margin-top:-3px;
            font-size:14px;
          }
        }
      }
    }
  }
</style>