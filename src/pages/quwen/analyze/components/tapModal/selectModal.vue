<template>
 <d-modal effect="fade" :show.sync="show" width="800" class="tap-modal" :on-ok="submit" :on-close="onClose">
   <template slot="modal-body">
     <div class="modal-body">
       <div class="versions app" v-if="type === 1 || type === 3">
         <h2>版本：</h2>
         <d-checkbox  @change="checkVersions" :checked="checkedVersions">全选</d-checkbox>
         <div class="select-warp">
           <ul class="list-wrapper">
             <li v-for="item in backDatatol.appVersions" class="item-warp" :class="{ active: item.isActive}" :key="item.name" @click="select(item, 'versions')">{{item.name}}</li>
           </ul>
         </div>
       </div>
       <div class="source app" v-if="type === 2 || type === 3">
         <h2>渠道：</h2>
         <d-checkbox  @change="checkSource" :checked="checkedSources">全选</d-checkbox>
         <div class="select-warp">
           <ul class="list-wrapper">
             <li v-for="item in backDatatol.appSources" class="item-warp" :class="{ active: item.isActive}" :key="item.name" @click="select(item, 'sources')">{{item.name}}</li>
           </ul>
         </div>
       </div>
     </div>
   </template>
   <div class="modal-footer" slot="modal-footer">
     <d-button class="searchfilter" size="large" type="warning" @click="onOk">确认</d-button>
     <d-button size="large" @click="close">取消</d-button>
   </div>
 </d-modal>
</template>
<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
import { deepCopy } from 'components/utils/cheatDataUtils.js';
export default {
  props: {
    show: {
      require: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    type: Number,
    sources: {
      type: Boolean,
      default: false
    },
    versions: {
      type: Boolean,
      default: false
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
  data() {
    return {
      isOk: false,
      backVersions: false,
      backSources: false,
      checkedVersions: false,
      checkedSources: false,
      backDatatol: {
        appSources: [],
        appVersions: []
      }
    };
  },
  ready() {
    this.backDatatol = deepCopy(this.datatol);
    // 全选逻辑
    this.checkedVersions = true;
    this.checkedSources = true;
    this.backDatatol.appVersions.forEach((item) => {
      if (item.isActive === false && item.name) {
        this.checkedVersions = false;
      }
    });
    this.backDatatol.appSources.forEach((item) => {
      if (item.isActive === false && item.name) {
        this.checkedSources = false;
      }
    });
    this.backVersions = this.versions;
    this.backSources = this.sources;
  },
  methods: {
    checkVersions(type) {
      if (type === true) {
        this.backDatatol.appVersions.forEach((item) => {
          if (item.name) {
            item.isActive = true;
          }
        });
        this.backVersions = true;
      } else {
        this.backDatatol.appVersions.forEach((item) => {
          item.isActive = false;
        });
        this.backVersions = false;
      }
    },
    checkSource(type) {
      if (type === true) {
        this.backDatatol.appSources.forEach((item) => {
          if (item.name) {
            item.isActive = true;
          }
          this.backSources = true;
        });
      } else {
        this.backDatatol.appSources.forEach((item) => {
          item.isActive = false;
        });
        this.backSources = false;
      }
    },
    getHeight() {
      let el = document.getElementsByClassName('funnel-area')[0];
      document.getElementsByClassName('funnel-item')[0].style.minHeight = window.getComputedStyle(el, null).height;
      document.getElementsByClassName('funnel-item')[1].style.minHeight = window.getComputedStyle(el, null).height;
    },
    select(item, type) {
      if (item.name) {
        item.isActive = !item.isActive;
      }
      if (type === 'versions' && item.isActive) {
        this.backVersions = true;
      }
      if (type === 'sources' && item.isActive) {
        this.backSources = true;
      }
    },
    close() {
      this.show = false;
    },
    onOk() {
      document.getElementsByClassName('funnel-item')[0].style.minHeight = '668px';
      document.getElementsByClassName('funnel-item')[1].style.minHeight = '668px';
      this.datatol = this.backDatatol;
      this.versions = this.backVersions;
      this.sources = this.backSources;
      setTimeout(() => {
        this.getHeight();
      }, 100);
      this.fn();
      this.show = false;
    }
  }
};
</script>
<style lang="less">
  .tap-modal {
    border: 1px solid #eee;
    .app {
      font-size: 16px;
       h2 {
        display: inline-block;
      }
      .d-checkbox-control {
        font-size: 16px;
        .icon {
          width: 14px;
          height: 14px;
        }
      }
    }
    .source {
      margin-top: 20px;
    }
    .list-wrapper {
      border: 1px solid #eee;
      border-bottom: none;
      border-right: none;
      display: inline-block;
      max-width: 596px;
      li {
        width: 119px;
        height: 30px;
        line-height: 30px;
        float: left;
        cursor: pointer;
        text-align: center;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        &.active {
          color: #fff;
          background-color: #FFC715;
        }
      }
    }
  }
</style>

