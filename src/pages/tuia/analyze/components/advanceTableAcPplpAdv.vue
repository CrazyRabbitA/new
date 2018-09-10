<template>
<!-- 付费券占比 -->
<div>
  <div class="advance-table">
    <table class="recommend-list mt10">
      <thead>
        <tr class="tr-header">
          <template v-for="(index, item) in columns">
            <th :key="index">{{item.title}}</th>
          </template>
          <th>分析时段值</th>
          <th>对比时段值</th>
          <th>影响值</th>
          <th>影响系数</th>
        </tr>
      </thead>
      <tbody v-if="showTable">
        <tr class="tr-items" v-for="(index, item) in backList" :key="index">
          <template v-for="(index, _item) in columns">
            <td :key="index" v-if="index === 0 && item.permisson">
              <template v-if="_item.title === '媒体ID' && !url.isOnline">
                <a v-link="{ path: currentUrl + concatUrl('/' + item[_item.dataIndex] + '/' + 0 + time)}" target="_blank">{{item[_item.dataIndex]}}</a>
              </template>
              <template v-if="_item.title === '广告位ID' && !url.isOnline">
                <a v-link="{ path: currentUrl + concatUrl('/' + 0 + '/' + item[_item.dataIndex] + time)}" target="_blank">{{item[_item.dataIndex]}}</a>
              </template>
              <template v-if="_item.title === '广告ID' && !url.isOnline">
                <span>{{item[_item.dataIndex]}}</span>
              </template>
              <template v-if="url.isOnline">
                  <a v-link="{ path: currentUrl + '/' + item[_item.dataIndex] }" target="_blank">{{item[_item.dataIndex]}}</a>
              </template>
            </td>
            <td :key="index" v-else>
              <span v-if = "index === 3 ">{{!item.chargeType ? '' : item.chargeType == 1 ? 'CPC' : 'CPA'}}</span>
              <span v-else>{{item[_item.dataIndex]}}</span>
            </td>
          </template>
          <td>
            {{fixNum(item.currentValue, 4)}}（{{item.quota11}}/{{item.quota21}}）
          </td>
          <td>
            {{fixNum(item.contrastValue, 4)}}（{{item.quota12}}/{{item.quota22}}）
          </td>
          <td>
            {{fixNum(item.afValue, 4)}}
          </td>
          <td>
            {{getPrecent(item.afModulus)}}
          </td>
        </tr>
      </tbody>
    </table>
    <tableempty v-if="!showTable"></tableempty>
  </div>
  <div>
  <d-pagination v-if="showTable" :total="totalList" :current-page="pageNum" :page-size="pageSize" @change="onPageChange" ></d-pagination>
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
    columns: {
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
        this.getUrl();
      }
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
    getUrl() {
      if (this.url.isOnline) {
        if (this.columns[0].title === '广告位ID') {
          this.currentUrl = this.onlineUrlSlot;
        }
        if (this.columns[0].title === '广告ID') {
          this.currentUrl = this.onlineUrlAdv;
        }
        if (this.columns[0].title === '媒体ID') {
          this.currentUrl = this.onlineUrlApp;
        }
      } else {
        this.currentUrl = this.offlineUrl;
        this.time = '/' + (this.url.startDate || 0) + '/' + (this.url.endDate || 0);
      }
    },
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
.advance-table {
   overflow-x: auto;
  
  .recommend-list{
    width: 100%;
   border-radius:2px;
    margin-bottom: 20px;
    th {
      min-width:120px;
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
