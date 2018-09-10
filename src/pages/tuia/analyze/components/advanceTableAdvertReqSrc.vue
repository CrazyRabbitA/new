<template>
<div>
  <div class="advance-table">
    <table class="recommend-list mt10">
        <thead>
          <tr class="tr-header">
            <th>媒体来源</th>
            <th>分析时段值</th>
            <th>对比时段值</th>
            <th>变化值</th>
            <th>占比
               <d-tooltip content="当前维度变化值占总变化值的占比"  type="disable">
                  <a class="iconhandle icon-positon">&#xe649;</a>
                </d-tooltip>
            </th>
          </tr>
        </thead>
        <tbody v-if="showTable">
          <tr class="tr-items" v-for="(index, item) in backList" :key="index">
           <td>
             {{!item.source ? '' : item.source === 1 ? '推啊' : '兑吧'}}
           </td>
            <td>
              {{fixNum(item.currentValue, 0)}}
            </td>
            <td>
               {{fixNum(item.contrastValue, 0)}}
            </td>
            <td>
               {{fixNum(item.variation, 0)}}
            </td>
            <td>
               {{item.proportion !== null ? getPrecent(item.proportion) : '∞'}}
            </td>
          </tr>
        </tbody>
      </table>
      <tableempty v-if="!showTable"></tableempty>
  </div>
</div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
export default {
  props: {
    list: {
      type: Array,
      default: null
    },
    url: {
      type: Object,
      default: null
    }
  },
  watch: {
    list() {
      if (this.list && this.list.length > 0) {
        this.showTable = true;
        this.totalList = this.list.length;
        this.onPageChange(1);
      }
    }
  },
  ready() {
    if (this.list && this.list.length > 0) {
      this.showTable = true;
      this.totalList = this.list.length;
      this.onPageChange(1);
    }
  },
  data() {
    return {
      backList: [],
      showTable: false,
      totalList: 0,
      pageNum: 1,
      pageSize: 10,
      currentUrl: '',
      time: '',
      // 分析中心-媒体离线数据
      offlineUrl: '/analyze/mediaoffline',
      // 实时监控-媒体维度
      onlineUrlApp: '/monitor/mediadimension',
      // 实时监控-广告位维度
      onlineUrlSlot: '/monitor/adslotDimension',
      // 实时监控-广告实时监控
      onlineUrlAdv: '/monitor/advRealTime'
    };
  },
  methods: {
    fixNum: _fixNum,
    getPrecent: getPrecent,
    concatUrl(params) {
      return params;
    },
    onPageChange(page) {
      this.pageNum = page;
      this.getPage();
    },
    getPage() {
      let start = (this.pageNum - 1) * this.pageSize;
      let end = start + 10;
      this.backList = this.list.slice(start, end);
    }
  }
};
</script>
<style lang="less" scoped>
  .tr-header th {
    position: relative;
    text-align: left;
    padding-right: 70px;
  }
  .tr-header,.tr-items{
    .text-left{
      text-align: left;
      padding-right: 10px;
    }
  }
.advance-table {
    .recommend-list{
    width: 100%;
   border-radius:2px;
    margin-bottom: 20px;
    th {
      min-width:120px;
      white-space: nowrap;
      }
    td {
      div {
        text-align: center;
      }
    }
    .td-title {
      border: none;
      vertical-align: middle;
      text-align: center;
    }
    .num {
      width: 80%;
      text-align: right;
      margin: auto;
      transform: translateX(-20%);
    }
  }
}

</style>