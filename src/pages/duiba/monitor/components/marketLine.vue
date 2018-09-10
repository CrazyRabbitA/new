<template>
  <div class="resources-line-area">
    <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange"></d-select>
    <div class="total-data">
        <h2>汇总</h2>
        <p><span class="point a"></span> 今日： {{totalData[0]}}</p>
        <p><span class="point b"></span> 昨日：{{totalData[1]}}</p>
        <p><span class="point c"></span> 历史七日： {{totalData[2]}}</p>
        <p><span class="point d"></span> 额外日期：{{totalData[3]}}</p>
    </div>
    <div :id="lineId" style="height:400px;width:100%;margin-top:100px;"></div>
  </div>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import cheatMarketMixins from '../mixins/cheatMarketMixins';
import marketMixins from '../mixins/marketMixins';
const quotaArr = [
  {
    label: '曝光pv',
    id: 'exposurePv'
  },
  {
    label: '曝光uv',
    id: 'exposureUv'
  },
  {
    label: '活动访问pv',
    id: 'accessPv'
  },
  {
    label: '活动访问uv',
    id: 'accessUv'
  },
  {
    label: '活动参与PV',
    id: 'participatePv'
  },
  {
    label: '活动参与UV',
    id: 'participateUv'
  },
  {
    label: '活动参与度',
    id: 'participatePercent'
  },
  {
    label: '付费券量',
    id: 'payCoupon'
  },
  {
    label: '付费券发券成功率',
    id: 'payCouponPercent'
  },
  {
    label: '福袋点击率',
    id: 'bagClickPercent'
  },
  {
    label: '复参(请求效率)',
    id: 'requestPercent'
  },
  {
    label: '消耗',
    id: 'consumeTotal'
  }
];
export default {
  mixins: [cheatMarketMixins, marketMixins],
  props: {
    resourcesData: {
      type: Object,
      default: () => {}
    },
    lineId: String,
    collectLine: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      quotaArr: quotaArr,
      selectQuota: 'exposurePv',
      totalData: []
    };
  },
  methods: {
    selectQuotaChange() {
      this.getResourcesDate(this.resourcesData, this.selectQuota);
      setTimeout(() => {
        this.getTotalCollectArr();
      }, 0);
    },
    getTotalCollectArr() {
      this.totalData = [];
      if (this.selectQuota === 'participatePercent' || this.selectQuota === 'payCouponPercent' || this.selectQuota === 'bagClickPercent') {
        this.totalData.push(this.collectLine.today[this.selectQuota]);
        this.totalData.push(this.collectLine.yesterday[this.selectQuota]);
        this.totalData.push(this.collectLine['7avg'][this.selectQuota]);
        this.totalData.push(this.collectLine.lastday[this.selectQuota]);
        this.totalData.forEach((item, index) => {
          this.totalData[index] = parseFloat((item * 100).toPrecision(12)).toFixed(2) + '%';
        });
      } else if (this.selectQuota === 'requestPercent') {
        this.totalData.push(_fixNum(this.collectLine.today[this.selectQuota], 1));
        this.totalData.push(_fixNum(this.collectLine.yesterday[this.selectQuota], 1));
        this.totalData.push(_fixNum(this.collectLine['7avg'][this.selectQuota], 1));
        this.totalData.push(_fixNum(this.collectLine.lastday[this.selectQuota], 1));
      } else {
        this.totalData.push(_fixNum(this.collectLine.today[this.selectQuota], 0));
        this.totalData.push(_fixNum(this.collectLine.yesterday[this.selectQuota], 0));
        this.totalData.push(_fixNum(this.collectLine['7avg'][this.selectQuota], 0));
        this.totalData.push(_fixNum(this.collectLine.lastday[this.selectQuota], 0));
      }
    }
  }
};
</script>
<style lang="less" scoped>
 .total-data {
    position: absolute;
    top: 1;
    padding: 20px;
    right: 100px;
    font-size: 12px;
    color: #657180;
    p {
      padding: 5px 0;
    }
    h2 {
      text-align: center;
      padding: 0 0 6px 0;
    }
    .point {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100%;
    }
    .a {
      background-color: #a4e0dd;
    }
    .b {
      background-color: #ffc3c3;
    }
    .c {
      background-color: #a9cef3;
    }
    .d {
      background-color: #ffc61a;
    }
  }
</style>