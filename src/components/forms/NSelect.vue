<template>
<div class="select-group" :class="{open: show}" v-el:container :disabled="disabled" >
  <a class="select-toggle" title="{{selectItem && selectItem[key]}}" :class="{
      'selblue': value == displayColor.blue && isconfirm,
      'selyellow': value == displayColor.yellow && isconfirm,
      'seldisabled': value == displayColor.disabled && isconfirm
    }" v-el:trigger>
    {{selectItem && selectItem[key]}}
    <i class="iconhandle">&#xe618;</i>
  </a>
  <ul class="select-menu" v-show="!disabled && show" :class="{'select-top': direction === 'top'}">
    <li v-if="search">
      <input type="text" v-model="iFilterKey" class="dselect-search" :placeholder="placeholder">
      <template v-if="showerr">
        <div class="errTip">请勿输入非法字符</div>
      </template>
    </li>
    <template v-if="options.length">
      <li v-for="option in iFilteredData" :id="option.id || option[idName]" :class="{'active': isSelected(option)}">
        <a @click="select($event, (option.id || option[idName]))">
          <i class="iconhandle" v-show="isSelected(option)">&#xe610;</i>
          {{ option.label || option[key] }}
        </a>
      </li>
      <li class="no-data" v-if="search && !iFilteredData.length">无匹配数据</li>
    </template>
  </ul>
  <confirmmodal v-if="isconfirm" :title="confirmModal.title" :show.sync="confirmModal.show" :type="confirmModal.type" :ok-text="confirmModal.oktext"  :desc="confirmModal.desc" :on-ok="confirmModal.action"></confirmmodal>
</div>

</template>

<script>
/* eslint-disable no-extra-boolean-cast */
import EventListener from '../utils/EventListener';
import coerceBoolean from '../utils/coerceBoolean';
import messagebox from 'components/basic/MessageBox';
import confirmmodal from '../layout/ConfirmModal';

export default {
  components: {
    confirmmodal
  },
  props: {
    placeholder: {
      type: String
    },
    iFilterKey: {
      type: String,
      default: ''
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    idName: {
      type: String,
      default: 'id'
    },
    isconfirm: {
      default: false
    },
    confirmparams: {
      default: null
    },
    confirmurl: {
      default: null
    },
    activitytype: {
      default: null
    },
    key: {
      type: String,
      default: 'label'
    },
    value: {
      twoWay: true
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    onSelect: {
      type: Function,
      default: () => {}
    },
    search: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    showerr: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    disabled: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    confirm: {
      type: Object,
      default: null
    },
    requestParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    method: {
      type: String,
      default: 'put'
    },
    selectval: {
      default: null
    },
    displayColor: {
      type: Object,
      default: () => {
        return {
          blue: 1,
          yellow: 2,
          disabled: 3
        };
      }
    },
    direction: {
      type: String,
      default: 'bottom'
    }
  },
  data() {
    return {
      show: false,
      confirmModal: {
        show: false,
        title: this.confirm ? this.confirm.title : '状态',
        desc: this.confirm ? this.confirm.desc : '确认修改状态？',
        type: this.confirm ? this.confirm.type : 'delete',
        action: this.confirm && this.confirm.action ? this.confirm.action : this.clickSelect
      }
    };
  },
  ready() {
    const triger = this.$els.trigger;
    const container = this.$els.container;
    if (this.trigger === 'hover') {
      this._mouseenterEvent = EventListener.listen(triger, 'mouseenter', (e) => {
        this.show = true;
      });
      this._mouseleaveEvent = EventListener.listen(container, 'mouseleave', (e) => {
        this.show = false;
      });
    } else {
      let that = this;
      this._clickEvent = triger.addEventListener('click', function(event) {
        that.toggleDropdown(event);
      }, false);
      this._documentEvent = EventListener.listen(document, 'click', (e) => {
        if (e.target.className === 'dselect-search') {
          return false;
        }
        this.show = false;
      });
    }
  },
  computed: {
    selectItem(item) {
      if (this.value) {
        let item = this.options.filter((item) => {
          return (item.id || item[this.idName]) === this.value;
        });
        return item && item[0];
      } else {
        let first = this.options[0];
        this.value = this.idName ? (first && first[this.idName]) : (first && first.id);
        return first;
      }
    },
    'iFilteredData': function() {
      let filterKey = this.iFilterKey && this.iFilterKey.toLowerCase();
      let data = this.options;
      data = data.filter(function(row) {
        return Object.keys(row).some(function(key) {
          if (key === 'imgUrl') {
            return false;
          } else {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          }
        });
      });
      return data;
    }
  },
  methods: {
    /**
     * 选中某个值
     */
    select(e, v) {
      if (this.isconfirm) {
        this.selectval = v;
        this.confirmModal.selectval = v;
        this.confirmModal.show = true;
        // this.confirm.show = true;
        // this.confirmModal.selectval = v;
        return;
      }
      this.value = v;
      this.toggleDropdown(e);
      this.onSelect(v);
      this.iFilterKey = '';
    },
    clickSelect() {
      var params;
      if (this.requestParams) {
        params = this.requestParams;
      } else {
        params = {
          id: this.confirmparams,
          activityType: this.activitytype,
          val: this.confirmModal.selectval
        };
      }
      this.$http[this.method](this.confirmurl, params).then((res) => {
        res = res.json();
        if (res.success) {
          this.confirmModal.show = false;
          this.value = this.confirmModal.selectval;
          this.onSelect(this.confirmModal.selectval);
          this.$dispatch('changeSuccess');
          messagebox({
            title: '修改状态成功!',
            type: 'success'
          });
        } else {
          messagebox({
            title: res.message || '修改状态失败!',
            type: 'error'
          });
        }
      }, (res) => {
        // error callback
        messagebox({
          title: res.message || '网络错误！',
          type: 'error'
        });
      });
      this.toggleDropdown();
    },
    /**
     * 当前是否选中
     */
    isSelected(option) {
      if (!this.value) {
        return this.options.indexOf(option) === 0;
      }
      if (typeof (+this.value) === 'number') {
        return +this.value === +(option.id || option[this.idName]);
      } else {
        return this.value === (option.id || option[this.idName]);
      }
    },
    /**
     * 切换下拉框
     */
    toggleDropdown(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      this.show = !this.show;
    }
  },
  beforeDestory() {
    if (this._mouseenterEvent) {
      this._mouseenterEvent.remove();
      this._mouseleaveEvent.remove();
    }
    if (this._clickEvent) {
      this._clickEvent.remove();
    }
  }
};
</script>
<style lang="less">
  .select-group{
    position: relative;
  }
  .select-group .selblue {
    background-color: #59ace2;
    color: #fff !important;
  }
  .select-group .selyellow {
    background-color: #f1c500;
  }
  .select-group .seldisabled {
    background-color: #bec3c7;
  }
  .select-group .btn-default {
    color: #444 !important;
    text-decoration: none;
  }
  .select-top{
    bottom: 34px;
    left: 0;
    top: auto;
  }
  .select-menu{
    overflow-x: hidden;
    .no-data{
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      padding-left: 32px;
    }
  }
  .dselect-search{
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    padding: 0 30px;
    width: 100%;
    border: 1px solid #fff;
    border-radius: 2px;
    outline:none;
    margin-left: 5px;
    font-size: 14px;
    background: url('data:image/png;base64,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') no-repeat left center;
    background-size: 20px 20px;
  }
  .errTip {
    padding: 5px 0 5px 33px;
    font-size: 14px;
    color: red;
    border-top: 1px solid #ddd;
  }
</style>
