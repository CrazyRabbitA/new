<template>
  <div class="switch" v-bind:class="{
    'on': status,
    'disable':  type === 'disable',
    'off': !status
  }" @click="toggleSwitch">
    <label class="switch-label">
      <div class="switch-inner"></div>
      <div class="switch-switch"></div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: null
    },
    onChange: {
      default: null
    },
    params: {
      default: null
    }
  },

  methods: {
    toggleSwitch: function() {
      if (this.onChange) {
        this.onChange(!this.status, this.params);
        return;
      }
      if (!this.type) {
        this.status = !this.status;
      }
    }
  }
};
</script>
