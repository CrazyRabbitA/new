<template>
  <div class="chart-line">
    <d-select :options.sync="quotaArr" :value.sync="selectQuota[0]" @select="selectDimensionChange"></d-select>
    <d-select :options.sync="quotaArr" :value.sync="selectQuota[1]" @select="selectDimensionChange"></d-select>
    <div :id="chartQueryId" style="height:400px;width:100%;margin-top:20px;"></div>
  </div>
</template>
<script>
import chartOffLineMixins from '../mixins/chartOffLineMixins';
import offLineMixins from '../mixins/offLineMixins';
import { _fixNum } from 'components/utils/cheatDataUtils';
export default {
  mixins: [_fixNum, chartOffLineMixins, offLineMixins],
  props: {
    chartQueryId: {
      type: Number,
      default: null
    },
    obj: {
      type: Object,
      default: null
    },
    columns: {
      type: Array,
      default: null
    }
  },
  created() {
    // 默认指标
    if (this.obj.chartExt) {
      this.selectQuota[0] = this.obj.chartExt.defaultColumnName;
      this.selectQuota[1] = this.obj.chartExt.defaultColumnName;
    }
    // 构造指标
    this.obj.quota.forEach(item => {
      this.columns.forEach(_item => {
        if (item === _item.columnTitle) {
          this.quotaArr.push({
            label: _item.alias,
            id: item
          });
        }
      });
    });
  },
  ready() {
    this.selectDimensionChange();
  },
  data() {
    return {
      quotaArr: [],
      selectQuota: ['', '']
    };
  },
  methods: {
    formatToolTip(data, index) {
      this.columns.forEach(item => {
        if (this.selectQuota[index] === item.columnTitle) {
          this.formatToolTipType = item.formatType;
        }
      });
      // 无穷大
      if (data === '无转化数据') {
        return data;
      }
      // 浮点数
      if (this.formatToolTipType === 6) {
        return _fixNum(data, 2);
      }
      // 整数
      if (this.formatToolTipType === 5) {
        return _fixNum(data, 0);
      }
      // 百分比
      if (this.formatToolTipType === 2) {
        return parseFloat((data * 100).toPrecision(12)) + '%';
      }
      return data;
    },
    // 汇总暂时不加
    // getTotalData(type) {
    //     let self = this;
    //     self.totalData = [];
    //     let lastDayTotal = self.obj.collect['extraDate'][type];
    //     lastDayTotal = this.formatToolTip(lastDayTotal);
    //     self.totalData.push(lastDayTotal);
    // },
    selectDimensionChange() {
      // this.getTotalData(this.selectQuota);
      let selectType = [];
      if (this.selectQuota[0] === this.selectQuota[1]) {
        selectType = [this.selectQuota[0]];
      } else {
        selectType = this.selectQuota;
      }
      if (this.obj.extraDate) {
        this.getResourcesDate(this.obj.extraDate, selectType);
      }
    }
  }
};
</script>
<style lang="less" scoped>

</style>

