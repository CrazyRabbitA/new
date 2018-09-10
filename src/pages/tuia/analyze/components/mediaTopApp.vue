<template>
  <div class="mediatop-table">
    <div class="media-top">
      <div class="up-type" :class="{'active': upType}" @click="changeType()">涨幅TOP</div>
      <div class="down-type" :class="{'active': !upType}"  @click="changeType()">跌幅TOP</div>
    </div>
    <div class="advance-table">
    <table class="recommend-list mt10">
      <thead>
        <tr class="tr-header">
            <template v-for="(index, item) in columns">
              <th :key="index">               
                 <label class="trade-warp">
                    {{item.title}}
                     <d-tooltip v-if="item.tooltip" :content="item.content" type="disable" maxwidth="none">
                      <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                    </d-tooltip>
                </label>
              </th>
            </template>
        </tr>
      </thead>
      <tbody v-if="showTable">
        <tr class="tr-items" v-for="(index, item) in topTable" :key="index">
          <template v-for="column in columns" >
            <td v-if="column.render">
               {{column.render(item[column.key], item)}}
            </td>
            <td v-else>
              <span v-if="column.key === 'id'">
                 <a @click='onClickId(item.id)'>{{item.id}}</a>
              </span>
              <span v-else>
                {{item[column.key]}}
              </span>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <tableempty v-if="!showTable"></tableempty>
  </div>
    <d-pagination :total="totalList" :current-page="pageNum" :page-size="pageSize" @change="onPageChange" ></d-pagination>
    <tableempty v-if="basic && !basic.topIncreaseApp.length && !basic.topPlummetApp.length"></tableempty>
    <div class='top-tip'>
       <p>提示：点击媒体id可查看媒体消耗波动分析的具体原因</p>
    </div>
  </div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import Tooltip from 'iview/src/components/tooltip';
Vue.component('Tooltip', Tooltip);
import Vue from 'vue';
let columns = [
  {
    title: '媒体ID',
    key: 'id',
    fixed: 'left',
    width: 80
  },
  {
    title: '媒体名称',
    key: 'appName',
    fixed: 'left',
    width: 100
  },
  {
    title: '分析时段消耗',
    key: 'currentValue',
    width: 110
  },
  {
    title: '对比时段消耗',
    key: 'contrastValue',
    width: 110
  },
  {
    title: '变化值',
    key: 'variation',
    width: 100
  },
  {
    title: '占比',
    key: 'proportion',
    width: 100,
    tooltip: true,
    content: '媒体消耗变化值/大盘消耗变化值',
    render(row, column) {
      return getPrecent(row);
    }
  },
  {
    title: '广告位访问UV影响系数',
    key: 'sdkUvAfModulus',
    width: 120,
    render(row, column) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '每UV券请求影响系数',
    key: 'arcPsuAfModulus',
    width: 115,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '发券成功率影响系数',
    key: 'lcParcAfModulus',
    width: 105,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '付费券占比影响系数',
    key: 'plpPlcAfModulus',
    width: 105,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '付费券arpu值影响系数',
    key: 'acPplpAfModulus',
    width: 120,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  }
];
export default {
  props: {
    basic: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      self: this,
      upType: true,
      topTable: [],
      totalList: 0,
      pageNum: 1,
      pageSize: 10,
      showTable: true,
      columns: columns,
      plummetTable: []
    };
  },
  computed: {
  },
  ready() {
    this.upType = this.basic.diff > 0; // 根据消耗分析变化值来区分涨幅和跌幅TOP
    this.initTable();
  },
  watch: {
    basic() {
    }
  },
  methods: {
    fixNum: _fixNum,
    getPrecent(num) {
      return getPrecent(num);
    },
    initTable() {
      const val = this.upType ? 'topIncreaseApp' : 'topPlummetApp';
      this.topTable = this.basic[val];
      this.totalList = this.topTable.length;
      this.onPageChange(1);
    },
    changeType(val) {
      this.upType = !this.upType;
      this.initTable();
    },
    onClickId(id) {
      this.$emit('parent-method', id);
    },
    onPageChange(page) {
      this.pageNum = page;
      let start = (this.pageNum - 1) * this.pageSize;
      let end = start + 10;
      this.topTable = this.upType ? this.basic.topIncreaseApp.slice(start, end) : this.basic.topPlummetApp.slice(start, end);
    }
  }
};
</script>
<style lang="less">
.mediatop-table {
  margin-bottom: 60px;
  .media-top {
    display: block;
    font-size: 0px;
    text-align: center;
    .up-type {
      display: inline-block;
      font-size: 14px;
      width: 120px;
      height: 34px;
      line-height: 36px;
      color: #444;
      border: 1px solid #ccc;
      border-right: none;    
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #fff;
        background-color: #ff5b5b;
        border: 1px solid #ff5b5b;
      }
      &.active {
        color: #fff;
        background-color:#ff5b5b;
        border: 1px solid #ff5b5b;
      }
    }
    .down-type {
      display: inline-block;
      width: 120px;
      height: 34px;
      line-height: 36px;
      text-align: center;
      border: 1px solid #ccc;
      border-left: none;
      color: #444;
      cursor: pointer;
      font-size: 14px;
      &:hover {
        color: #fff;
        background-color:#2ac993;
        border: 1px solid #2ac993;
      }
      &.active {
        color: #fff;
        background-color:#2ac993;
        border: 1px solid #2ac993;
      }
    }
  }
  .top-tip {
    margin: 15px 0;
  }
  // .popover {
  //   float: right;
  //   margin-left: 2px;
  //   position: relative;
  //   top: -2px;
  //   // border-radius: 6px;
  //   .pop-content {
  //     width: 200px;
  //     background: #eee;
  //     color: #888;
  //     display: none;
  //   }
  //   .pop-content:hover {
  //     display: block;
  //     color: red;
  //   }
  // }
}
.tooltip1 {
    // position: relative;
    float: right;
    width: 17px;
    margin-left: 3px;
}

.tooltip1 .tooltiptext {
    visibility: hidden;
    width: 200px;
    background-color: #eee;
    color: #888;
    text-align: center;
    border-radius: 6px;
    padding: 5px 5px;
    position: absolute;
    font-weight: normal;
    z-index: 1;
    // bottom: 99%;
    left: 422px;
    top:-18px;
}

.tooltip1 .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #eee transparent transparent transparent;
}

.tooltip1:hover .tooltiptext {
    visibility: visible;
}

.advance-table {
  overflow-x: auto;
  padding-top: 20px;
  .tr-header {
    line-height: 25px !important;
  }
  .recommend-list{
    width: 100%;
    border-radius:2px;
    margin-bottom: 20px;
    th {
      min-width:100px;
      position:relative;
      vertical-align: middle;
      // text-align: center;
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
    .trade-warp {
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      // text-align: center;
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