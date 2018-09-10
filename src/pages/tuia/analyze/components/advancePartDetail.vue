<template>
  <div class="advance-part">
    <div class="tab-detail"  v-if="obj.quotaList.length > 0">
      <ul class="tab-detail-wrapper">
        <li
          :class= "{ activedetail:item.eLabel === curIndex }"
          v-for="(index,item) in tabs"
          @click = "changeTab(item)"
          :key="index">{{item.label}}</li>
      </ul>
    </div>
    <div class="advance-total-warp" v-if="showQuota('advertRequestCount') && this.curIndex === 'advertRequestCount'">
      <div class="advance-quota advance-quota-title">指标变化值</div>
        <template v-if="dimension === 3">
            <div class="no-less">已经到最细粒度，无法继续分析具体原因</div>
        </template>
        <template v-else>
          <advance-total-advert-req :obj="obj.advertRequestCount"></advance-total-advert-req>
          <div class="advance-quota-title mb15">指标变化原因分析</div>
            <advance-table-advert-req-src v-if="showTable('advertRequestCountAppSource')" :list.sync="totalList3" :columns.sync="columns3" :url="url"> </advance-table-advert-req-src>
          <p v-if="showTable('advertRequestCountApp')" class="advance-tip advance-tip-title">波动TOP媒体明细：</p>
              <advance-table-advert-req v-if="showTable('advertRequestCountApp')" :list.sync="totalList2" :columns.sync="columns2" :url="url"> </advance-table-advert-req>
        </template>
    </div>
      <div class="advance-total-slot" v-if="showQuota('sdkUv') && this.curIndex === 'sdkUv'">
      <div class="advance-quota advance-quota-title">指标变化值</div>
        <template v-if="dimension === 3">
            <div class="no-less">已经到最细粒度，无法继续分析具体原因</div>
        </template>
        <template v-else>
          <advance-total-sdk-uv :obj="obj.sdkUv"></advance-total-sdk-uv>
          <div class="advance-quota-title">变化原因</div>
          <p v-if="showTable('sdkUvApp')" class="advance-tip advance-tip-trade">媒体维度：</p>
              <advance-table-sdk-uv v-if="showTable('sdkUvApp')" :list.sync="totalList1" :columns.sync="columns2" :url="url"> </advance-table-sdk-uv>
          <p v-if="showTable('sdkUvSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
              <advance-table-sdk-uv v-if="showTable('sdkUvSlot')" :list.sync="totalList3" :columns.sync="columns3" :url="url"> </advance-table-sdk-uv>
        </template>
    </div>
    <div class="advance-total-warp" v-if="showQuota('arcPsu') && this.curIndex === 'arcPsu'">
      <div class="advance-quota advance-quota-title">指标变化值</div>
      <template v-if="dimension === 3">
        <div class="no-less">已经到最细粒度，无法继续分析具体原因</div>
      </template>
      <template v-else>
        <advance-total :obj="obj.arcPsu" ></advance-total>
        <div class="advance-quota-title">变化原因</div>
        <p v-if="showTable('arcPsuApp')" class="advance-tip advance-tip-trade">媒体维度：</p>
            <advance-table-arc-psu v-if="showTable('arcPsuApp')" :list.sync="totalList4" :columns.sync="columns2" :url="url"> </advance-table-arc-psu>
        <p v-if="showTable('arcPsuSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
          <advance-table-arc-psu v-if="showTable('arcPsuSlot')" :list.sync="totalList5" :columns.sync="columns3" :url="url"> </advance-table-arc-psu>
      </template>
    </div>
    <div class="advance-total-warp" v-if="showQuota('lcParc') && this.curIndex === 'lcParc'">
      <div class="advance-quota advance-quota-title">指标变化值</div>
      <advance-total :obj="obj.lcParc" :is-ratio="true" :is-time-ratio = "true" :show-af = "true"></advance-total>
      <div class="advance-quota-title">变化原因</div>
      <p v-if="showTable('lcParcTradeAdvert')" class="advance-tip advance-tip-trade">行业维度：</p>
         <advance-table-lc-parc-trade v-if="showTable('lcParcTradeAdvert')" :list.sync="totalList15" :mark="'lcParc'" :url="url" :params="params"> </advance-table-lc-parc-trade>
      <p v-if="showTable('lcParcApp')" class="advance-tip advance-tip-title">媒体维度：</p>
        <advance-table-lc-parc v-if="showTable('lcParcApp')" :list.sync="totalList6" :columns.sync="columns2" :url="url"> </advance-table-lc-parc>
      <p v-if="showTable('lcParcSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
        <advance-table-lc-parc v-if="showTable('lcParcSlot')" :list.sync="totalList7" :columns.sync="columns3" :url="url"> </advance-table-lc-parc>
    </div>
    <div class="advance-total-warp" v-if="showQuota('plpPlc') && this.curIndex === 'plpPlc'">
      <div class="advance-quota advance-quota-title">指标变化值</div>
      <advance-total :obj="obj.plpPlc" :is-ratio="true" :is-time-ratio="true"  :show-af = "true"></advance-total>
      <div class="advance-quota-title">变化原因</div>
       <p v-if="showTable('plpPlcTradeAdvert')"  class="advance-tip advance-tip-trade">行业维度：</p>
         <advance-table-lc-parc-trade v-if="showTable('plpPlcTradeAdvert')" :list.sync="totalList16" :url="url"  :mark="'plpPlc'" :params="params"> </advance-table-lc-parc-trade>
      <p v-if="showTable('plpPlcApp')" class="advance-tip advance-tip-title">媒体维度：</p>
          <advance-table-plp-plc v-if="showTable('plpPlcApp')" :list.sync="totalList9" :columns.sync="columns2" :url="url"> </advance-table-plp-plc>
      <p v-if="showTable('plpPlcSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
          <advance-table-plp-plc v-if="showTable('plpPlcSlot')" :list.sync="totalList10" :columns.sync="columns3" :url="url"> </advance-table-plp-plc>
    </div>
    <div class="advance-total-warp" v-if="showQuota('acPplp') && this.curIndex === 'acPplp'">
      <div class="advance-quota advance-quota-title">指标变化值</div>
      <advance-total :obj="obj.acPplp" :show-af = "true"></advance-total>
      <div class="advance-quota-title">变化原因</div>
       <p v-if="showTable('acPplpTradeAdvert')" class="advance-tip advance-tip-trade">行业维度：</p>
         <advance-table-lc-parc-trade v-if="showTable('acPplpTradeAdvert')" :list.sync="totalList17" :url="url" :mark="'acPplp'" :params="params"> </advance-table-lc-parc-trade>
      <p v-if="showTable('acPplpApp')" class="advance-tip advance-tip-title">媒体维度：</p>
        <advance-table-ac-pplp v-if="showTable('acPplpApp')" :list.sync="totalList12" :columns.sync="columns2" :url="url"> </advance-table-ac-pplp>
      <p v-if="showTable('acPplpSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
        <advance-table-ac-pplp v-if="showTable('acPplpSlot')" :list.sync="totalList13" :columns.sync="columns3" :url="url"> </advance-table-ac-pplp>
    </div>
  </div>
</template>
<script>
import advanceTableAdvertReq from './advanceTableAdvertReq';
import advanceTableArcPsu from './advanceTableArcPsu';
import advanceTableLcParc from './advanceTableLcParc';
import advanceTablePlpPlc from './advanceTablePlpPlc';
import advanceTableAcPplp from './advanceTableAcPplp';
import advanceTableLcParcTrade from './advanceTableLcParcTrade';
import advanceTotalAdvertReq from './advanceTotalAdvertReq';
import advanceTableAdvertReqSrc from './advanceTableAdvertReqSrc';
import advanceTotal from './advanceTotal';
import advanceTotalSdkUv from './advanceTotalSdkUv';
import advanceTableSdkUv from './advanceTableSdkUv';

const tabs = [
  {
    label: '广告位访问UV',
    eLabel: 'sdkUv',
    key: 0
  },
  {
    label: '每UV券请求',
    eLabel: 'arcPsu',
    key: 1
  },
  {
    label: '广告券请求量',
    eLabel: 'advertRequestCount',
    key: 2
  },
  {
    label: '发券成功率',
    eLabel: 'lcParc',
    key: 3
  },
  {
    label: '付费券占比',
    eLabel: 'plpPlc',
    key: 4
  },
  {
    label: '付费券arpu值',
    eLabel: 'acPplp',
    key: 5
  }
];

const columns2 = [
  {
    title: '媒体ID',
    dataIndex: 'id'
  },
  {
    title: '媒体名称',
    dataIndex: 'name'
  },
  {
    title: '媒体来源',
    dataIndex: 'source'
  }
];
const columns3 = [
  {
    title: '广告位ID',
    dataIndex: 'id'
  },
  {
    title: '广告位名称',
    dataIndex: 'name'
  }
];
export default {
  components: {
    advanceTableAdvertReq,
    advanceTableAdvertReqSrc,
    advanceTableArcPsu,
    advanceTableLcParc,
    advanceTablePlpPlc,
    advanceTableAcPplp,
    advanceTableLcParcTrade,
    advanceTotalSdkUv,
    advanceTableSdkUv,
    advanceTotal,
    advanceTotalAdvertReq
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
    params: {
      type: Object,
      default: {}
    },
    url: {
      type: Object,
      default: null
    },
    quotaList: {
      type: Array,
      default: []
    }
  },
  ready() {
    if (this.obj.quotaList) {
      this.totalList1 = this.obj.sdkUvApp; // 广告位访问UV
      this.totalList2 = this.obj.advertRequestCountApp; // 广告券请求量
      this.totalList3 = this.obj.advertRequestCountAppSource;
      this.totalList4 = this.obj.arcPsuApp; // 每UV券请求
      this.totalList5 = this.obj.arcPsuSlot;
      this.totalList6 = this.obj.lcParcApp; // 发券成功率
      this.totalList7 = this.obj.lcParcSlot;
      this.totalList15 = this.obj.lcParcTradeAdvert; // 行业维度
      this.totalList9 = this.obj.plpPlcApp; // 付费券占比
      this.totalList10 = this.obj.plpPlcSlot;
      this.totalList16 = this.obj.plpPlcTradeAdvert; // 行业维度
      this.totalList12 = this.obj.acPplpApp; // 付费券arpu值
      this.totalList13 = this.obj.acPplpSlot;
      this.totalList17 = this.obj.acPplpTradeAdvert; // 行业维度
      // 仅仅展示勾选项
      this.tabs = this.tabs.filter((item, index) => this.obj.quotaList.indexOf(item.eLabel) !== -1);
      this.curIndex = this.tabs[0].eLabel;
    }
  },
  data() {
    return {
      tabs: tabs,
      curIndex: '',
      columns2: columns2,
      columns3: columns3,
      totalList3: [],
      totalList1: [],
      totalList2: [],
      totalList4: [],
      totalList5: [],
      totalList6: [],
      totalList7: [],
      totalList8: [],
      totalList9: [],
      totalList10: [],
      totalList11: [],
      totalList12: [],
      totalList13: [],
      totalList14: [],
      totalList15: [],
      totalList16: [],
      totalList17: []
    };
  },
  methods: {
    changeTab(item) {
      this.curIndex = item.eLabel;
    },
    showQuota(item) {
      let isShow = false;
      this.obj.quotaList.forEach(_item => {
        if (_item === item) {
          isShow = true;
        }
      });
      return isShow;
    },
    showTable(item) {
      let isShow = false;
      this.obj.splitList.forEach(_item => {
        if (_item === item) {
          isShow = true;
        }
      });
      return isShow;
    }
  }
};
</script>
<style lang="less" scoped>
.advance-part {
  .no-less {
    padding: 40px;
    text-align: center;
  }
  .advance-total-warp {
    margin-top: 22px;
  }
  .advance-total-slot {
      margin-top: 22px;
  }
  .advance-tip {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    color: #444;
  }
  .advance-tip-title {
    margin: 25px 0 3px 0;
  }
   .advance-tip-trade {
    margin: 10px 0 3px 0;
  }
  .advance-tip-slot {
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .advance-quota {
    display: inline-block;
    color: #fff;
    border-radius: 2px;
    padding: 4px 6px;
    margin: 0 10px;
  }
  .advance-quota-title {
    margin: 0 0 10px 0;
    color: #ff795c;
    font-weight: bold;
    padding-left: 10px;
    border-left: 2px solid #ff795c;
  }
  .tab-detail .tab-detail-wrapper{
    display: inline-block;
    width: 80%;
    border-bottom: 1px solid rgb(169,169,169);
   li {
    height:34px;
    line-height: 34px;
    float:left;
    padding:0 20px;
    border-right:none;
    cursor:pointer;
    &:first-child {
      padding-left: 0px;
    }
    &.activedetail{
      color: rgb(57,157,248);
      font-weight: bold;
      border-bottom: 2px solid rgb(57,157,248);
    }
  }
}
}
</style>
