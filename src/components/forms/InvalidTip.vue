<template>
  <p class="invalid" :class="[additionalClass]" v-if="show">
    <i class="iconhandle">&#xe62a;</i>
    <slot></slot>
  </p>
</template>

<script>
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    show: {
      coerce: coerceBoolean,
      default: false
    },
    additionalClass: {
      default: ''
    }
  }
};
</script>
<style>
  .invalid {
    color: #ffc4b8;
    font-size: 12px;
    margin: 10px 0 0 15px;
  }
</style>
