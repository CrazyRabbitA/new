<template>
  <div class="checkbox-group" :style="checkboxstyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'd-checkbox-group',

  props: {
    value: {
      type: Array
    },
    checkboxstyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  watch: {
    value: function(value) {
      this.$emit('change', value);
    }
  }
};
</script>
