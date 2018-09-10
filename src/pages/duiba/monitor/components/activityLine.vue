<template>
  <div class="resources-line-area">
    <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange"></d-select>
    <div :id="lineId" style="height:400px;width:100%;margin-top:20px;"></div>
  </div>
</template>
<script>
  import cheatActivityMixins from '../mixins/cheatActivityMixins.js';
  import activityMixins from '../mixins/activityMixins.js';
  export default {
    mixins: [cheatActivityMixins, activityMixins],
    props: {
      chartObj: {
        type: Object,
        default: () => {}
      },
      lineId: String
    },
    data() {
      return {
        quotaArr: this.chartObj.quotaArr,
        selectQuota: this.chartObj.selectQuota
      };
    },
    methods: {
      selectQuotaChange() {
        this.getResourcesDate(this.chartObj.chartData, this.selectQuota);
      }
    }
  };
</script>