<template>
  <d-modal  effect="fade" :show.sync="show" width="1150" class="uptypemodal" :class="{'uptypemodal-analyse': isAnalyse}" :on-ok="submit" :on-close="close">
    <template slot="modal-body">
      <loading :show="loadshow"></loading>
      <span class="top-rank-type-wrap">
        <p class="filter-label-rank">对象：</p>
        <div class="top-rank-type">
          <span v-if="showApp" class="app-type" :class="{'active': appRankType}" @click="getCurrentRank('appRank')">媒体</span>
          <span v-if="showSlot" class="slot-type" :class="{'active': slotRankType}" @click="getCurrentRank('slotRank')">资源位</span>
          <span v-if="showAct" class="act-type" :class="{'active': actRankType}" @click="getCurrentRank('actRank')">活动</span>
        </div>
      <template v-if="currentRank === 'appRank'">
        <app-rank  @get-originid = 'getOriginIds' 
         :quota-type="quotaType"
         :select-day="selectDay" 
         :act-id="actId" :app-id="appId" 
         :slot-id="slotId" 
         :source-type="sourceType"
         :loadshow.sync="loadshow"></app-rank>
      </template>
      <template v-if="currentRank === 'slotRank'">
        <slot-rank :quota-type="quotaType" :select-day="selectDay" :act-id="actId" :app-id="appId" :slot-id="slotId" :source-type="sourceType" :loadshow.sync="loadshow"></slot-rank>
      </template>
      <template v-if="currentRank === 'actRank'">
        <act-rank  :quota-type="quotaType" :select-day="selectDay" :act-id="actId" :app-id="appId" :slot-id="slotId" :source-type="sourceType" :loadshow.sync="loadshow"></act-rank>
      </template>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer">
      </div>
    </template>
  </d-modal>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
import appRank from './appRank';
import slotRank from './slotRank';
import actRank from './actRank';

export default {
  components: { appRank, slotRank, actRank },
  props: {
    origin: {
      type: Number,
      default: -1
    },
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    onChange: {
      type: Function,
      default: () => {}
    },
    quotaType: {
      type: [String, Number]
    },
    selectDay: {
      type: String,
      default: ''
    },
    slotId: {
      type: String,
      default: ''
    },
    appId: {
      type: String,
      default: ''
    },
    actId: {
      type: String,
      default: ''
    },
    sourceType: {
      type: Number,
      default: 0
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  ready() {
    if (this.actId || this.appId || this.slotId) {
      this.isAnalyse = true;
    }
    this.showCurrent();
    // 判断是否显示
  },
  data() {
    return {
      isAnalyse: false,
      currentRank: '',
      appRankType: true,
      advRankType: false,
      slotRankType: false,
      actRankType: false,
      loadshow: true,
      showApp: true,
      showAct: true,
      showSlot: true
    };
  },
  methods: {
    getOriginIds(val) {

    },
    showCurrent() {
      if (this.appId) {
        // 默认选中广告位
        this.appId = this.appId;
        this.showApp = false;
        this.getCurrentRank('slotRank');
        return;
      }
      if (this.slotId) {
        // 默认选中活动
        this.slotId = this.slotId;
        this.showApp = false;
        this.showSlot = false;
        this.getCurrentRank('actRank');
        return;
      }
      if (this.actId) {
        // 默认选中媒体
        this.actId = this.actId;
        this.showAct = false;
        this.getCurrentRank('appRank');
        return;
      }
      this.currentRank = 'appRank';
    },
    getCurrentRank(type) {
      this.currentRank = type;
      if (type === 'appRank') {
        this.appRankType = true;
        this.slotRankType = false;
        this.actRankType = false;
      }
      if (type === 'slotRank') {
        this.appRankType = false;
        this.slotRankType = true;
        this.actRankType = false;
      }
      if (type === 'actRank') {
        this.appRankType = false;
        this.slotRankType = false;
        this.actRankType = true;
      }
    }
  },
  watch: {

  }
};
</script>
<style lang="less">
.uptypemodal {
  .loading {
    height: 700px;
    border-radius: 5px;
  }
  .form-filter-group-top-quota1 {
    position: absolute;
    top: 28px;
    left: 400px;
    .filter-label-s {
      width: 50px;
    }
  }
  .form-filter-group-top-quota {
    position: absolute;
    top: 28px;
    left: 700px;
    .filter-label-s {
      width: 50px;
    }
  }
  .rank-name-warp {
    position: absolute;
    top: 28px;
    left: 680px;
    font-size: 16px;
    font-weight: bold;
    color: #444;
    margin-top: 4px;
  }
  .top-rank-type-wrap {
    padding: 10px 20px;
    .form-filter-group-rank-date {
      .iconhandle {
        right: 43px !important;
        &.datepicker-nextBtn {
          right: 0px !important;
        }
      }
    }
    .filter-label-rank {
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 46px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
    }
    .filter-label-80 {
      width: 80px;
    }
    .top-rank-type {
      display: inline-block;
      border:1px solid #ccc;
      font-size: 0;
      span {
        display: inline-block;
        width: 72px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        background-color: #efefef;
        border-right: 1px solid #ccc;
        cursor: pointer;
        &:last-child {
          border-right: none;
        }
        &.active {
          color: #ef6b3b;
          background: #fff;
        }
      }
      &.top-rank-time {
        float: left;
        margin-right: 24px;
        span {
          width: 84px;
          &:nth-child(2) {
            border-right: none;
          }
        }
      }
    }
  }
  .modal-dialog {
    height: 560px !important;
  }
  .modal-title {
    margin-bottom: 6px;
  }
  .modal-content {
    padding-left:10px;
    padding-right: 10px;
    height: 700px;
  }
  .select-group {
    width: 200px;
    margin-right: 30px;
  }
  .search {
    margin-right: 10px;
  }
}
.inline{
  display: inline-block;
  vertical-align: middle;
}
.form-filter-group {
  margin-bottom: 18px;
  float: left;
  .filter-label{
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 80px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .filter-label-rank {
      width: 50px !important;
  }
  .form-control {
    width: 260px;
    margin-right: 30px;
  }
  .datepicker-input {
    width: 160px !important;
  }
}
.add-rule {
  margin: 10px 20px;
  padding: 10px 20px;
  text-align: center;
  border: 1px dashed #d8d8d8;
  cursor: pointer; 
}
.top-type {
  position: absolute; 
  display: inline-block;
  font-size: 0px;
  left: 850px;
  top: 166px;
  .up-type {
    display: inline-block;
    font-size: 14px;
    width: 120px;
    height: 34px;
    line-height: 36px;
    color: #444;
    border: 1px solid #ccc;
    border-right: none;    
    border-radius: 100px 0 0 100px;
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
    border-radius: 0px 100px 100px 0;
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
.rule-list {
  padding: 0px 0px 10px 0px;
  text-align: left;
  .rule-item {
    span {
      padding-right: 20px;
    }
  }
  .row-noresult {
    padding: 10px 0 10px;
  }
}
.uprank-rule-list {
  .tr-header {
    th {
      text-align: right;
      padding-right: 70px;
      &:nth-child(1) {
        text-align: left;
        padding-right: 0px;
      }
      &:nth-child(2) {
        text-align: left;
        padding-right: 0px;
      }
    }
  }
  .tr-items {
    td {
      text-align: right;
      padding-right: 70px;
      padding-top: 10px;
      padding-bottom: 10px;
      &:nth-child(1) {
        text-align: left;
        padding-right: 0px;
      }
      &:nth-child(2) {
        text-align: left;
        padding-right: 0px;
      }
    }
  }
}
.uprank-block-search {
  width: 100%;
  margin-top: 10px; 
  .d-button + .d-button {
    margin-left: 0px;
  }
  .select-menu {
    max-height: 300px !important;
  }
}
.icon-positon {
  position: relative;
  font-size: 14px;
}
.summary {
  height: 77px;
  width: 60%;
  margin-bottom: 10px;
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
.uptypemodal-analyse {
  .form-filter-group-top-quota {
    left: 270px;
  }
}
</style>
