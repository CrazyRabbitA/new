<template>
  <label class="checkbox-control"
    v-bind:class="{
      'active': checked
    }"
  >
    <input type="checkbox" :name="name" autocomplete="off" :checked="checked" />
    <i class="icon" v-bind:class="{'iconhandle': checked}" @click="handleClick"></i>
    <slot></slot>
  </label>
</template>

<script>
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    value: {
      type: [String, Number]
    },
    checked: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    name: {
      type: String
    },
    onChange: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        return;
      }
      this.checked = !this.checked;
      this.onChange(this.checked);
    }
  }
};
</script>
