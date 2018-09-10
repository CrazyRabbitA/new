<template>
  <div :id="lineId" style="height:400px;"></div>
</template>
<script>
import offlineMixins from '../mixins/offlineMixins';
import chartOfflineMixins from '../mixins/chartOfflineMixins';

export default {
  mixins: [offlineMixins, chartOfflineMixins],
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    quotas: {
      type: Array,
      default: () => []
    },
    lineId: {
      type: String,
      default: ''
    }
  }
};
</script>
<style>

</style>
