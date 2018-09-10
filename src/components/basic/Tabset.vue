<template>
  <!-- Nav tabs -->
  <ul class="header-tabs cf" role="tablist">
    <template v-for="t in headers">
      <li @click.prevent="select(t)">
        <a :class="{active: t.active, disabled: t.disabled}" href="javascript:void(0)">
          <slot name="header">{{{t.header}}}</slot>
          <slot name="header-more"></slot>
        </a>
      </li>
    </template>
  </ul>
  <div class="tab-content" v-el:tab-content>
    <slot></slot>
  </div>
</template>

<script>
import coerceNumber from '../utils/coerceNumber.js';

export default {
  props: {
    active: {
      type: Number,
      coerce: coerceNumber,
      default: 0
    }
  },
  data() {
    return {
      show: null,
      headers: [],
      tabs: []
    };
  },
  created() {
    this._tabset = true;
  },
  watch: {
    active(val) {
      this.show = this.tabs[val];
    }
  },
  ready() {
    this.show = this.tabs[this.active];
  },
  methods: {
    select(tab) {
      if (!tab.disabled) {
        this.active = tab.index;
      }
    }
  }
};
</script>
