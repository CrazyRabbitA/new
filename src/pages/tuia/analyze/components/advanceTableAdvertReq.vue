<template>
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
            <th>变化值</th>
            <th>占比
               <d-tooltip content="当前媒体广告券请求量变化值/广告券请求量总变化值"  type="disable">
                  <a class="iconhandle icon-positon">&#xe649;</a>
                </d-tooltip>
            </th>
          </tr>
        </thead>
        <tbody v-if="showTable">
          <tr class="tr-items" v-for="(index, item) in backList" :key="index">
            <template v-for="(index, _item) in columns">
              <td :key="index" v-if="index === 0">
                <template v-if="item.source === 2">
                   {{item[_item.dataIndex]}}
                </template>
                <template v-if="!url.isOnline && item.source === 1">
                  <a v-link="{ path: currentUrl + concatUrl('/' + item[_item.dataIndex] + '/' + 0 + time)}" target="_blank">{{item[_item.dataIndex]}}</a>
                </template>
                <template v-if="url.isOnline && item.source === 1">
                   <a v-link="{ path: currentUrl + '/' + item[_item.dataIndex] }" target="_blank">{{item[_item.dataIndex]}}</a>
                </template>
              </td>
              <td :key="index" v-else>
                <span v-if = "index ===2"> {{!item.source ? '' : item.source === 1 ? '推啊' : '兑吧'}}</span>
                <span v-else>{{item[_item.dataIndex]}}</span>
              </td>
            </template>
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
  ready() {
    if (this.list && this.list.length > 0) {
      this.showTable = true;
      this.totalList = this.list.length;
      this.onPageChange(1);
      this.getUrl();
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
