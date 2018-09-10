<template>
   <div class="time-node">
    <ul class="top">
      <li>上午</li>
      <li>下午</li>
    </ul>
    <ul class="middle list">
      <li v-for="item in cloums">{{item.id}}</li>
    </ul>
    <ul class="bottom list">
      <template v-for="item in cloums">
        <li v-show="item.active" @click="timeNodeChange(item)" class="active"></li>
        <li v-else @click="timeNodeChange(item)"></li>
      </template>
    </ul>
  </div>
</template>
<script>
import {deepCopy} from 'components/utils/cheatDataUtils.js';

const cloums = [
  {
    id: 0,
    active: false
  },
  {
    id: 1,
    active: false
  },
  {
    id: 2,
    active: false
  },
  {
    id: 3,
    active: false
  },
  {
    id: 4,
    active: false
  },
  {
    id: 5,
    active: false
  },
  {
    id: 6,
    active: false
  },
  {
    id: 7,
    active: false
  },
  {
    id: 8,
    active: false
  },
  {
    id: 9,
    active: false
  },
  {
    id: 10,
    active: false
  },
  {
    id: 11,
    active: false
  },
  {
    id: 12,
    active: false
  },
  {
    id: 13,
    active: false
  },
  {
    id: 14,
    active: false
  },
  {
    id: 15,
    active: false
  },
  {
    id: 16,
    active: false
  },
  {
    id: 17,
    active: false
  },
  {
    id: 18,
    active: false
  },
  {
    id: 19,
    active: false
  },
  {
    id: 20,
    active: false
  },
  {
    id: 21,
    active: false
  },
  {
    id: 22,
    active: false
  },
  {
    id: 23,
    active: false
  }
];
export default {
  props: {
    selectNode: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      cloums: []
    };
  },
  ready() {
    let _this = this;
    let _cloums = deepCopy(cloums);
    this.cloums = [];
    _cloums.forEach((item) => {
      _this.selectNode.forEach((_item) => {
        if (item.id === Number(_item)) { item.active = true; }
      });
    });
    _this.cloums = _cloums;
  },
  methods: {
    timeNodeChange(item) {
      item.active = !item.active;
      this.selectNode = [];
      this.cloums.forEach((x) => {
        if (x.active === true) {
          this.selectNode.push(x.id);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.time-node {
  width: 902px;
  .list {
    border: 1px solid #e1e1e1;
    border-bottom: none;
    height: 30px;
    width: 100%;
    &.bottom {
      background-color: #fff9e1;
      font-size: 0;
      li {
        cursor: pointer;
      }
    }
    li {
      display: inline-block;
      text-align: center;
      border-right: 1px solid #e1e1e1;
      width: 37.5px;
      height: 30px;
      line-height: 30px;
      &:nth-last-child(1) {
        border-right: none;
      }
      &.active {
        background-color: #ff795c;
      }
    }
    &:nth-last-child(1) {
      border-bottom: 1px solid #e1e1e1;
    }
  }
  .top {
    border: 1px solid #e1e1e1;
    border-bottom: none;
    height: 30px;
    width: 100%;
    li {
      display: inline-block;
      width: 442px;
      height: 100%;
      line-height: 30px;
      text-align: center;
      &:nth-child(1) {
        width: 450px;
        border-right: 1px  solid #e1e1e1;
      }
    }
  }
}
</style>

