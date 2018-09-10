<template>
  <div class="auto-complete">
    <input 
    type="text"  
    :placeholder="placeholder" 
    v-model="value"
    :class="inputClass"
    @keyup.enter="handleEnter"
    @keyup="handleKeyup"
    @keypress="handleKeypress"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput | debounce 300"
    @change="handleChange"
    >
    <ul :class="[prefixCls + '-result-list']" v-show="resultList.length > 0">
      <template v-for="item in resultList">
        <li :class="[prefixCls + '-result-item']" @mousedown="handleClick(item.key, item.value)">{{item.key}}-{{item.value}}</li>
      </template>
    </ul>
  </div>
</template>

<script>
const prefixCls = 'auto-complete';
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
      twoWay: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String
    },
    showResult: {
      type: Boolean,
      default: true
    },
    inputClass: {
      type: String
    },
    resultList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    };
  },
  methods: {
    handleEnter(event) {
      this.$emit('on-enter', event);
    },
    handleKeydown(event) {
      this.$emit('on-keydown', event);
    },
    handleKeypress(event) {
      this.$emit('on-keypress', event);
    },
    handleKeyup(event) {
      this.$emit('on-keyup', event);
    },
    handleFocus(event) {
      this.$emit('on-focus', event);
    },
    handleBlur(event) {
      this.resultList = [];
      this.$emit('on-blur', event);
    },
    handleInput(event) {
      let value = event.target.value;
      this.$emit('input', value);
      this.$emit('on-change', event);
    },
    handleChange(event) {
      this.$emit('on-input-change', event);
    },
    handleClick(key, value) {
      let selectValue = {
        key: key,
        value: value
      };
      this.$emit('on-click', selectValue);
    }
  }
};
</script>

<style lang="less">
 .auto-complete {
   position: relative;
   display: inline-block;
   .form-control {
     width: 300px !important;
   }
   .auto-complete-result-list {
     position: absolute;
     z-index: 999;
     border-bottom: 1px solid #a8e7e7;
     border-right: 1px solid #a8e7e7;
     border-left: 1px solid #a8e7e7;
     border-radius: 2px;
     background-color: #fff;    
     width: 300px;
     top: 34px;
     .auto-complete-result-item {
       width: 100%;
       padding: 8px;
       text-align: left;
       cursor: pointer;
       font-size:13px;
       color: #444;
       &:hover {
         background-color: #eee;
       }
     }
   }
 }
</style>
