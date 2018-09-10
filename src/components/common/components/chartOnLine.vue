<template>
  <div class="chart-line">
    <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectDimensionChange"></d-select>
    <div :id="chartQueryId" style="height:400px;width:100%;margin-top:20px;"></div>
  </div>
</template>
<script>
import chartOnLineMixins from '../mixins/chartOnLineMixins';
import onLineMixins from '../mixins/onLineMixins';
import { _fixNum } from 'components/utils/cheatDataUtils';
export default {
  mixins: [_fixNum, chartOnLineMixins, onLineMixins],
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
      this.selectQuota = this.obj.chartExt.defaultColumnName;
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
      selectQuota: ''
    };
  },
  methods: {
    formatToolTip(data) {
      this.columns.forEach(item => {
        if (this.selectQuota === item.columnTitle) {
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
    //   let self = this;
    //   self.totalData = [];
    //   let todayTotal = self.obj.collect.today[type];
    //   let yesterdayTotal = self.obj.collect.yesterday[type];
    //   let sevTotal = self.obj.collect['7avg'][type];
    //   let lastDayTotal = self.obj.collect['extraDate'][type];
    //   todayTotal = this.formatToolTip(todayTotal);
    //   yesterdayTotal = this.formatToolTip(yesterdayTotal);
    //   sevTotal = this.formatToolTip(sevTotal);
    //   lastDayTotal = this.formatToolTip(lastDayTotal);
    //   self.totalData.push(todayTotal, yesterdayTotal, sevTotal, lastDayTotal);
    // },
    selectDimensionChange() {
      // this.getTotalData(this.selectQuota);
      this.getResourcesDate(this.obj, this.selectQuota);
    }
  }
};
</script>
<style lang="less" scoped>

</style>

