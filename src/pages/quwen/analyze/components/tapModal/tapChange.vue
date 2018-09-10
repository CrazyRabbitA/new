<template>
  <div class="funnel-change">
    <h2>维度：</h2>
    <div class="tap-list">
      <div class="tap-item" :class="{ active: item.isActive}" v-for="item in backTapList" :key="item.name" @click="tapChange(item)">{{item.name}}</div>
    </div>
    <div class="item-wrapper cf" v-if="showAppVersions">
      <h2>版本：</h2>
      <div class='item-list'>
        <span  @click='showModal'>+</span>
        <template v-for="(index,item) in datatol.appVersions">
          <span v-if="item.isActive">{{item.name}}<i @click="del(item,'versions')" class="icondelete">&#xe635;</i></span>
        </template>
      </div>
    </div>
    <div class="item-wrapper cf" v-if="showAppSources">
      <h2>渠道：</h2>
      <div class='item-list'>
        <span @click='showModal'>+</span>
        <template v-for="(index,item) in datatol.appSources">
          <span v-if="item.isActive" >{{item.name}}<i @click="del(item,'suorces')" class="icondelete">&#xe635;</i></span>
        </template>
      </div>
    </div>
    <component :is="currentView" :show="showSelectModal" :datatol.sync="datatol" :type="type" :sources.sync="showAppSources" :versions.sync="showAppVersions" :fn="fn"></component>
  </div>
</template>
<script>
import selectModal from './selectModal';
import { deepCopy } from 'components/utils/cheatDataUtils.js';

export default {
  components: {
    selectModal
  },
  props: {
    tapList: {
      type: Array,
      default: []
    },
    datatol: {
      type: Object,
      default: () => {}
    },
    fn: {
      type: Function,
      default: null
    }
  },
  ready() {
    this.backTapList = deepCopy(this.tapList);
  },
  data() {
    return {
      showSelectModal: false,
      showAppVersions: false,
      showAppSources: false,
      currentView: '',
      backTapList: [],
      type: 0,
      params: {

      }
    };
  },
  methods: {
    fomateSelect() {
      this.datatol.appVersions.forEach((item) => {
        item.isActive = false;
      });
      this.datatol.appSources.forEach((item) => {
        item.isActive = false;
      });
      this.showAppVersions = false;
      this.showAppSources = false;
    },
    tapChange(select) {
      // 如果当前选项未被选中
      if (select.isActive === false) {
        this.type = select.type;
        this.backTapList.forEach((item) => {
          if (item.name === select.name) {
            item.isActive = true;
          } else {
            item.isActive = false;
          }
        });
        this.fomateSelect();
      }
      if (select.name === '大盘') {
        this.fn();
        return;
      }
      this.showModal();
    },
    showModal() {
      this.currentView = '';
      this.$nextTick(() => {
        this.currentView = 'selectModal';
        this.showSelectModal = true;
      });
    },
    del(item, type) {
      item.isActive = false;
      if (type === 'suorces') {
        this.showAppSources = false;
        this.datatol.appSources.forEach((item) => {
          if (item.isActive) {
            this.showAppSources = true;
          }
        });
      } else {
        this.showAppVersions = false;
        this.datatol.appVersions.forEach((item) => {
          if (item.isActive) {
            this.showAppVersions = true;
          }
        });
      }
      this.fn();
    }
  }
};
</script>

<style lang="less" scoped>
 .funnel-change {
    text-align: left;
    margin-top: 20px;
    h2 {
      display: inline-block;
    }
    .tap-list {
      font-size: 0px;
      display: inline-block;
      .tap-item {
        font-size: 16px;
        display: inline-block;
        border: 1px solid #999;
        border-left: none;
        padding: 4px 16px;
        cursor: pointer;
        &:nth-child(1) {
          border-left: 1px solid #999;
        }
        &.active {
          background-color: #FFC715;
          color: #fff;
        }
      }
    }
    .item-list{
      span{margin-bottom:10px};
      width: 100%;
    }
    .item-wrapper {
      margin-top: 20px;
      min-height: 30px;
      margin-top: 20px;
      h2 {
        float: left;
        line-height: 28px;
      }
      div {
        font-size: 0px;
        span {
          &:nth-of-type(1) {
            padding: 5px 10px;
          }
          font-size: 18px;
          background-color: rgba(64, 158, 255, 0.1);
          color: #409eff;
          border: 1px solid rgba(64, 158, 255, 0.2);
          display: inline-block;
          padding: 5px 5px;
          border-radius: 5px;
          margin-left: 5px;
          cursor: pointer;
          i {
            font-size: 18px;
          }
        }
      }
    }
  }
</style>
