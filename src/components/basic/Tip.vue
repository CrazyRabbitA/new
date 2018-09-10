<template>
  <div v-show="show" class="tip">
    <i v-show="dismissable" class="iconhandle close" @click="close">&#xe609;</i>
    <slot></slot>
  </div>
</template>

<script>
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    dismissable: {
      type: Boolean,
      coerce: coerceBoolean,
      default: true
    },
    show: {
      type: Boolean,
      coerce: coerceBoolean,
      default: true,
      twoWay: true
    }
  },
  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>

