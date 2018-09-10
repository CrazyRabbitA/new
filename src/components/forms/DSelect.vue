<template>
<div class="select-group" :class="{open: show}" v-el:container :disabled="disabled">
  <a class="select-toggle" v-el:trigger>
    {{selectItem && selectItem[key]}}
    <i class="iconhandle">&#xe618;</i>
  </a>
  <ul class="select-menu" v-show="!disabled && show">
    <template v-if="options.length">
      <li v-for="option in options" :id="option.id || option[idName]" :class="{'active': isSelected(option)}">
        <a @mousedown.prevent="select(option.id || option[idName])">
          <i class="iconhandle" v-show="isSelected(option)">&#xe610;</i>
          {{ option.label || option[key] }}
        </a>
      </li>
    </template>
  </ul>
</div>
</template>

<script>
/* eslint-disable no-extra-boolean-cast */
import EventListener from '../utils/EventListener.js';
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    idName: {
      type: String,
      default: 'id'
    },
    key: {
      type: String,
      default: 'label'
    },
    value: {
      twoWay: true
    },
    options: {
      twoWay: true,
      type: Array,
      default() {
        return [];
      }
    },
    onSelect: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    }
  },
  data() {
    return {
      show: false
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
      this._clickEvent = EventListener.listen(triger, 'click', this.toggleDropdown);
      this._documentEvent = EventListener.listen(document, 'click', () => {
        this.show = false;
      });
    }
  },
  computed: {
    selectItem() {
      if (!!this.value) {
        let item = this.options.filter((item) => {
          return (item.id || item[this.idName]) === this.value;
        });
        return item && item[0];
      } else {
        let first = this.options[0];
        this.value = this.idName ? (first && first[this.idName]) : (first && first.id);
        return first;
      }
    }
  },
  methods: {
    /**
     * 选中某个值
     */
    select(v) {
      this.value = v;
      this.toggleDropdown();
      this.onSelect(v);
    },
    /**
     * 当前是否选中
     */
    isSelected(option) {
      if (!this.value) {
        return this.options.indexOf(option) === 0;
      }
      return this.value === (option.id || option[this.idName]);
    },
    /**
     * 切换下拉框
     */
    toggleDropdown(e) {
      if (e) {
        e.stopPropagation();
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
