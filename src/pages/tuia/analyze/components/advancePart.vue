<template>
  <div class="advance-part">
    <div class="advance-warp">
      <p class="advance-tip">分析对象：</p>
      <div class="type advance-tip">{{type}}</div>
      <div class="name-id advance-tip" v-if="obj.info&&obj.info.name">{{obj.info.name}}（{{obj.info.id}}）</div>
    </div>
    <div class="advance-warp" >
      <p class="advance-tip">消耗波动主要影响指标是：</p>
      <template v-if="obj.quotaList.length > 0">
        <div class="advance-quota" v-for="item in obj.quotaList">{{getQuota(item)}}</div>
      </template>
      <template v-else>
          <div class="advance-quota">无指标</div>
      </template>
    </div>
    <div class="advance-total-warp ">
      <p class="advance-tip advance-tip-title">具体数值：</p>
      <advance-table :list.sync="totalList1" :columns.sync="columns1"></advance-table>
    </div>
  </div>
</template>
<script>
import advanceTable from './advanceTable';
import { _fixNum, getPrecent, safeGet } from 'components/utils/cheatDataUtils';
const qutaType = {
  advertRequestCount: '广告券请求量',
  sdkUv: '广告位访问UV',
  arcPsu: '每UV券请求',
  lcParc: '发券成功率',
  plpPlc: '付费券占比',
  acPplp: '付费券arpu值'
};

const columns1 = [
  {
    title: '指标',
    dataIndex: 'id'
  }
];
export default {
  components: {
    advanceTable
  },
  props: {
    dimension: {
      type: Number,
      default: 1
    },
    obj: {
      type: Object,
      default: null
    },
    url: {
      type: Object,
      default: null
    }
  },
  watch: {
    dimension: function() {
      this.initData();
    }
  },
  ready() {
    this.initData();
  },
  data() {
    return {
      totalList1: [],
      columns1: columns1
    };
  },
  computed: {
    type: function() {
      const objMap = {
        1: '推啊媒体大盘（外采）',
        4: '广告大盘（兑吧+推啊）',
        2: '单媒体',
        3: '单广告位'
      };
      const key = safeGet(['info', 'dimension'], this.obj, 4);
      return objMap[key];
    }
  },
  methods: {
    getQuota(item) {
      return qutaType[item];
    },
    initData() {
      if (this.obj.quotaList) {
        this.obj.lcParc.id = '发券成功率';
        this.obj.plpPlc.id = '付费券占比';
        this.obj.acPplp.id = '付费券arpu值';
        if (this.dimension === 4) {
          this.obj.advertRequestCount.id = '广告券请求量';
       // 广告券请求量
          this.obj.advertRequestCount.value = _fixNum(this.obj.advertRequestCount.value, 0);
          this.obj.advertRequestCount.compValue = _fixNum(this.obj.advertRequestCount.compValue, 0);
          this.obj.advertRequestCount.afValue = _fixNum(this.obj.advertRequestCount.afValue, 2);
          this.obj.advertRequestCount.afModulus = getPrecent(this.obj.advertRequestCount.afModulus);
        } else {
          this.obj.sdkUv.id = '广告位访问UV';
          this.obj.arcPsu.id = '每UV券请求';
        // 广告位访问UV
          this.obj.sdkUv.value = _fixNum(this.obj.sdkUv.value, 0);
          this.obj.sdkUv.compValue = _fixNum(this.obj.sdkUv.compValue, 0);
          this.obj.sdkUv.afValue = _fixNum(this.obj.sdkUv.afValue, 2);
          this.obj.sdkUv.afModulus = getPrecent(this.obj.sdkUv.afModulus);
       // 每UV券请求
          this.obj.arcPsu.value = _fixNum(this.obj.arcPsu.value, 4);
          this.obj.arcPsu.compValue = _fixNum(this.obj.arcPsu.compValue, 4);
          this.obj.arcPsu.afValue = _fixNum(this.obj.arcPsu.afValue);
          this.obj.arcPsu.afModulus = getPrecent(this.obj.arcPsu.afModulus);
        }
      // 发券成功率
        this.obj.lcParc.value = getPrecent(this.obj.lcParc.value);
        this.obj.lcParc.compValue = getPrecent(this.obj.lcParc.compValue);
        this.obj.lcParc.afValue = _fixNum(this.obj.lcParc.afValue);
        this.obj.lcParc.afModulus = getPrecent(this.obj.lcParc.afModulus);
      // 付费券占比
        this.obj.plpPlc.value = getPrecent(this.obj.plpPlc.value);
        this.obj.plpPlc.compValue = getPrecent(this.obj.plpPlc.compValue);
        this.obj.plpPlc.afValue = _fixNum(this.obj.plpPlc.afValue);
        this.obj.plpPlc.afModulus = getPrecent(this.obj.plpPlc.afModulus);
      // 付费券arpu值
        this.obj.acPplp.value = _fixNum(this.obj.acPplp.value, 4);
        this.obj.acPplp.compValue = _fixNum(this.obj.acPplp.compValue, 4);
        this.obj.acPplp.afValue = _fixNum(this.obj.acPplp.afValue, 2);
        this.obj.acPplp.afModulus = getPrecent(this.obj.acPplp.afModulus);
      // totalList1
        this.totalList1 = this.dimension === 4 ? [
          this.obj.advertRequestCount,
          this.obj.lcParc,
          this.obj.plpPlc,
          this.obj.acPplp
        ] : [
          this.obj.sdkUv,
          this.obj.arcPsu,
          this.obj.lcParc,
          this.obj.plpPlc,
          this.obj.acPplp
        ];
      }
    }
  }
};
</script>
<style lang="less" scoped>
.advance-part {
  .advance-tip {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    color: #444;
  }
  .advance-tip-title {
    margin: 30px 0 10px 0;
  }
  .advance-quota {
    display: inline-block;
    color: #fff;
    background-color: #ff795c;
    border-radius: 2px;
    padding: 4px 6px;
    margin: 0 10px;
  }
  .advance-warp {
    padding: 10px 0;
    .name-id {
      color: #9a9797;
      padding: 0px 10px;
    }
    .type {
      padding: 0 10px;
    }
    div {
      display: inline-block;
    }
  }
}
</style>
