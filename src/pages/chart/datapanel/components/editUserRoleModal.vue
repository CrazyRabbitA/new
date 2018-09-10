<template>
  <d-modal :title="title" :show.sync="show" width="500" :on-ok="onOk" :on-close="onClose">
      <div slot="modal-body" class="modal-body">
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
    }
  },
  data() {
    return {
      newlist: [],
      oldlist: [],
      cancelClickList: []
    };
  },
  ready() {
    this.ckForEach(this.datas.roles, this.oldlist);
  },
  events: {
    'changebox': function(model) {
      let curpObj = this.getParent(model);
      let curcObj = this.getChild(model);

      if (curpObj) {
        let temp = curpObj.child.filter((item) => {
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
        if (this.oldlist.indexOf(items) !== -1) {
          cklist.push(items);
        }
      });
      let param = {
        newlist: this.newlist,
        cancelClickList: this.cancelClickList
      };

      this.onSave(param);
      this.onClose();
    },
    onClose() {
      this.show = false;
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
  }
};
</script>
<style lang="less">
  .modal-body {
    .tree {
      max-height: 300px;
      i {
        height: 14px;
        width: 14px;
      }
    }
  }
</style>