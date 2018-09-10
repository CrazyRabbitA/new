<template>
  <div class="advance-part">
    <p class="advance-tip advance-tip-title" v-if="obj.quotaList.length > 0">指标的变化分析如下：</p>
    <div class="advance-total-slot" v-if="showQuota('sdkUv')">
      <div class="advance-quota advance-quota-title">广告位访问UV</div>
        <template v-if="dimension === 3">
            <div class="no-less">已经到最细粒度，无法继续分析具体原因</div>
        </template>
        <template v-else>
          <advance-total-sdk-uv :obj="obj.sdkUv"></advance-total-sdk-uv>
          <p v-if="showTable('sdkUvApp')" class="advance-tip advance-tip-title">媒体维度：</p>
              <advance-table-sdk-uv v-if="showTable('sdkUvApp')" :list.sync="totalList2" :columns.sync="columns2" :url="url"> </advance-table-sdk-uv>
          <p v-if="showTable('sdkUvSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
              <advance-table-sdk-uv v-if="showTable('sdkUvSlot')" :list.sync="totalList3" :columns.sync="columns3" :url="url"> </advance-table-sdk-uv>
        </template>
    </div>
    <div class="advance-total-warp" v-if="showQuota('arcPsu')">
      <div class="advance-quota advance-quota-title">每UV券请求</div>
      <template v-if="dimension === 3">
        <div class="no-less">已经到最细粒度，无法继续分析具体原因</div>
      </template>
      <template v-else>
        <advance-total :obj="obj.arcPsu" ></advance-total>
        <p v-if="showTable('arcPsuApp')" class="advance-tip advance-tip-title">媒体维度：</p>
            <advance-table-arc-psu v-if="showTable('arcPsuApp')" :list.sync="totalList4" :columns.sync="columns2" :url="url"> </advance-table-arc-psu>
        <p v-if="showTable('arcPsuSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
          <advance-table-arc-psu v-if="showTable('arcPsuSlot')" :list.sync="totalList5" :columns.sync="columns3" :url="url"> </advance-table-arc-psu>
      </template>
    </div>
    <div class="advance-total-warp" v-if="showQuota('lcParc')">
      <div class="advance-quota advance-quota-title">发券成功率</div>
      <advance-total :obj="obj.lcParc" :is-ratio="true" :is-time-ratio = "true"></advance-total>
      <p v-if="showTable('lcParcApp')" class="advance-tip advance-tip-title">媒体维度：</p>
        <advance-table-lc-parc v-if="showTable('lcParcApp')" :list.sync="totalList6" :columns.sync="columns2" :url="url"> </advance-table-lc-parc>
      <p v-if="showTable('lcParcSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
        <advance-table-lc-parc v-if="showTable('lcParcSlot')" :list.sync="totalList7" :columns.sync="columns3" :url="url"> </advance-table-lc-parc>
      <p v-if="showTable('lcParcAdvert')" class="advance-tip advance-tip-slot">广告维度：</p>
        <advance-table-lc-parc-adv v-if="showTable('lcParcAdvert')" :list.sync="totalList8" :columns.sync="columns4" :url="url"> </advance-table-lc-parc-adv>
    </div>
    <div class="advance-total-warp" v-if="showQuota('plpPlc')">
      <div class="advance-quota advance-quota-title">付费券占比</div>
      <advance-total :obj="obj.plpPlc" :is-ratio="true" :is-time-ratio="true"></advance-total>
      <p v-if="showTable('plpPlcApp')" class="advance-tip advance-tip-title">媒体维度：</p>
          <advance-table-plp-plc v-if="showTable('plpPlcApp')" :list.sync="totalList9" :columns.sync="columns2" :url="url"> </advance-table-plp-plc>
      <p v-if="showTable('plpPlcSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
          <advance-table-plp-plc v-if="showTable('plpPlcSlot')" :list.sync="totalList10" :columns.sync="columns3" :url="url"> </advance-table-plp-plc>
      <p v-if="showTable('plpPlcAdvert')" class="advance-tip advance-tip-slot">广告维度：</p>
        <advance-table-plp-plc-adv v-if="showTable('plpPlcAdvert')" :list.sync="totalList11" :columns.sync="columns4" :url="url"> </advance-table-plp-plc-adv>
    </div>
    <div class="advance-total-warp" v-if="showQuota('acPplp')">
      <div class="advance-quota advance-quota-title">付费券arpu值</div>
      <advance-total :obj="obj.acPplp"></advance-total>
      <p v-if="showTable('acPplpApp')" class="advance-tip advance-tip-title">媒体维度：</p>
        <advance-table-ac-pplp v-if="showTable('acPplpApp')" :list.sync="totalList12" :columns.sync="columns2" :url="url"> </advance-table-ac-pplp>
      <p v-if="showTable('acPplpSlot')" class="advance-tip advance-tip-slot">广告位维度：</p>
        <advance-table-ac-pplp v-if="showTable('acPplpSlot')" :list.sync="totalList13" :columns.sync="columns3" :url="url"> </advance-table-ac-pplp>
      <p v-if="showTable('acPplpAdvert')" class="advance-tip advance-tip-slot">广告维度：</p>
        <advance-table-ac-pplp-adv v-if="showTable('acPplpAdvert')" :list.sync="totalList14" :columns.sync="columns4" :url="url">   </advance-table-ac-pplp-adv>
    </div>
  </div>
</template>
<script>
import advanceTableSdkUv from './advanceTableSdkUv';
import advanceTableArcPsu from './advanceTableArcPsu';
import advanceTableLcParc from './advanceTableLcParc';
import advanceTablePlpPlc from './advanceTablePlpPlc';
import advanceTablePlpPlcAdv from './advanceTablePlpPlcAdv';
import advanceTableAcPplp from './advanceTableAcPplp';
import advanceTableAcPplpAdv from './advanceTableAcPplpAdv';
import advanceTableLcParcAdv from './advanceTableLcParcAdv';
import advanceTotalSdkUv from './advanceTotalSdkUv';
import advanceTotal from './advanceTotal';

const columns2 = [
  {
    title: '媒体ID',
    dataIndex: 'id'
  },
  {
    title: '媒体名称',
    dataIndex: 'name'
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
const columns4 = [
  {
    title: '广告ID',
    dataIndex: 'id'
  },
  {
    title: 'AE',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'couponType'
  },
  {
    title: '计费类型',
    dataIndex: 'chargeType'
  },
  {
    title: '行业',
    dataIndex: 'advertTag'
  }
];
export default {
  components: {
    advanceTableSdkUv,
    advanceTableArcPsu,
    advanceTableLcParc,
    advanceTablePlpPlc,
    advanceTablePlpPlcAdv,
    advanceTableAcPplp,
    advanceTableAcPplpAdv,
    advanceTableLcParcAdv,
    advanceTotal,
    advanceTotalSdkUv
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
    obj: function() {
      this.initData();
    }
  },
  ready() {
    this.initData();
  },
  data() {
    return {
      totalList2: [],
      columns2: columns2,
      totalList3: [],
      columns3: columns3,
      columns4: columns4,
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
      totalList14: []
    };
  },
  methods: {
    initData() {
      if (this.obj.quotaList) {
        this.totalList2 = this.obj.sdkUvApp; // 广告位访问UV
        this.totalList3 = this.obj.sdkUvSlot;
        this.totalList4 = this.obj.arcPsuApp; // 每UV券请求
        this.totalList5 = this.obj.arcPsuSlot;
        this.totalList6 = this.obj.lcParcApp; // 发券成功率
        this.totalList7 = this.obj.lcParcSlot;
        this.totalList8 = this.obj.lcParcAdvert;
        this.totalList9 = this.obj.plpPlcApp; // 付费券占比
        this.totalList10 = this.obj.plpPlcSlot;
        this.totalList11 = this.obj.plpPlcAdvert;
        this.totalList12 = this.obj.acPplpApp; // 付费券arpu值
        this.totalList13 = this.obj.acPplpSlot;
        this.totalList14 = this.obj.acPplpAdvert;
      }
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
    margin-top: 36px;
   
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
    margin: 0px 0 10px 0;
  }
  .advance-tip-slot {
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .advance-quota {
    display: inline-block;
    color: #fff;
    background-color: #ff795c;
    border-radius: 2px;
    padding: 4px 6px;
    margin: 0 10px;
  }
  .advance-quota-title {
    margin: 10px 0;
  }
}
</style>
