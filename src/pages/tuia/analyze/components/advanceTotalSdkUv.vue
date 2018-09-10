<template>
  <div class="show-total">
    <table class="recommend-list sdk-summary">
      <thead>
        <tr class="tr-header-summary">
          <th>分析时段值</th>
          <th>对比时段值</th>
          <th>变化值</th>
          <th>变化率</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr-items-summary">
          <td>
            {{fixNum(obj.value, 0)}}
          </td>
          <td>
            {{fixNum(obj.compValue, 0)}}
          </td>
          <template v-if="isRatio">
            <td v-if="fixNum(obj.variation).indexOf('-') === 0" class="down-green">
              {{getPrecent(obj.variation)}}
            </td>
            <td v-else class="up-red">
              {{getPrecent(obj.variation)}}
            </td>
          </template>
          <template v-else>
            <td v-if="fixNum(obj.variation).indexOf('-') === 0" class="down-green">
              {{fixNum(obj.variation, 0)}}
            </td>
            <td v-else class="up-red">
              {{fixNum(obj.variation, 0)}}
            </td>
          </template>
          <td v-if="fixNum(obj.ratio).indexOf('-') === 0" class="down-green">
            {{obj.ratio !== null ? getPrecent(obj.ratio) : '∞'}}
          </td>
          <td v-else class="up-red">
            {{obj.ratio !== null ? getPrecent(obj.ratio) : '∞'}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import Tooltip from 'iview/src/components/tooltip';
Vue.component('Tooltip', Tooltip);
import Vue from 'vue';
export default {
  props: {
    obj: {
      type: Object,
      default: null
    },
    isRatio: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    fixNum: _fixNum,
    getPrecent: getPrecent
  }
};
</script>
<style lang="less" scoped>
.sdk-summary {
  height: 77px;
  width: 100%;
  margin: 10px 0 2px 0;
  th, td{
    text-align: left;
    padding-bottom: 10px;
  }
  .tr-header-summary {
    font-size:14px;
    color:#444444;
  }
  .tr-items-summary {
    color:#444444;
    font-size: 24px;
  }
  .down-green {
    color: #2ac993;
  }
  .up-red {
    color: #ff5b5b;
  }
}
</style>

