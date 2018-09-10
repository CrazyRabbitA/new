<template>
  <d-modal  effect="fade" :title="'TOP榜单：'" :show.sync="show" width="900" class="top-modal" :on-ok="submit" :on-close="close">
    <template slot="modal-body">
      <div class="load-show">
        <loading :show="loadshow"></loading>
      </div>
      <div class="top-top-type-wrap">
        <p class="filter-label-top">对象：</p>
        <div class="top-top-type">
          <span class="app-type" :class="{'active': appTopType}" @click="getCurrenttop('appTop')" v-if="author('/monitor/top/appTop')">媒体</span>
          <span class="app-type" :class="{'active': advTopType}" @click="getCurrenttop('advTop')" v-if="author('/monitor/top/advTop')">广告</span>
          <span class="slot-type" :class="{'active': slotTopType}" @click="getCurrenttop('slotTop')" v-if="author('/monitor/top/slotTop')">广告位</span>
          <span class="act-type" :class="{'active': actTopType}" @click="getCurrenttop('actTop')" v-if="author('/monitor/top/actTop')">活动</span>
        </div>
      </div>
      <template v-if="currentTop === 'appTop' && author('/monitor/top/appTop')">
        <app-top :quota-type="quotaType" :select-day="selectDay" :loadshow.sync="loadshow"></app-top>
      </template>
      <template v-if="currentTop === 'advTop' && author('/monitor/top/advTop')">
        <adv-top :quota-type="quotaType" :select-day="selectDay" :loadshow.sync="loadshow"></adv-top>
      </template>
      <template v-if="currentTop === 'slotTop' && author('/monitor/top/slotTop')">
        <slot-top :quota-type="quotaType" :select-day="selectDay" :loadshow.sync="loadshow"></slot-top>
      </template>
      <template v-if="currentTop === 'actTop' && author('/monitor/top/actTop')">
        <act-top :quota-type="quotaType" :select-day="selectDay" :loadshow.sync="loadshow"></act-top>
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
import getAuthority from 'components/utils/authority';
import appTop from './appTop';
import slotTop from './slotTop';
import actTop from './actTop';
import advTop from './advTop';

export default {
  components: { appTop, slotTop, actTop, advTop },
  props: {
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
    topType: {
      type: String,
      default: 'appTop'
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  ready() {
    this.getCurrenttop(this.topType);
  },
  data() {
    return {
      currentTop: '',
      appTopType: true,
      slotTopType: false,
      actTopType: false,
      advTopType: false,
      loadshow: false
    };
  },
  methods: {
    getCurrenttop(type) {
      this.currentTop = type;
      if (type === 'appTop') {
        this.appTopType = true;
        this.advTopType = false;
        this.slotTopType = false;
        this.actTopType = false;
      }
      if (type === 'advTop') {
        this.appTopType = false;
        this.advTopType = true;
        this.slotTopType = false;
        this.actTopType = false;
      }
      if (type === 'slotTop') {
        this.appTopType = false;
        this.advTopType = false;
        this.slotTopType = true;
        this.actTopType = false;
      }
      if (type === 'actTop') {
        this.appTopType = false;
        this.advTopType = false;
        this.slotTopType = false;
        this.actTopType = true;
      }
    },
    author(url) {
      return getAuthority(url);
    }
  }
};
</script>
<style lang="less">
.top-modal {
  .loading {
    height: 650px;
    border-radius: 5px;
  }
  .row-noresult {
    padding: 50px 0 186px;
  }
  .top-top-type-wrap {
    padding: 10px 20px;
    width: 100%;
    display: inline-block;
    .filter-label-top {
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 46px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
    }
    .top-top-type {
      display: inline-block;
      border:1px solid #ccc;
      font-size: 0;
      border-right: none;
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
        &.active {
          color: #ef6b3b;
          background: #fff;
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
    height: 654.81px;
    .load-show {
      .loading {
        height: 654.81px;
        border-radius: 5px;
      }
    }
  }
}
</style>
