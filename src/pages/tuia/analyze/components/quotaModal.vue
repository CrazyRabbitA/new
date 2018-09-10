<template>
 <d-modal effect="fade" :show.sync="show" width="800" class="quotamodal" :on-ok="submit" :on-close="onClose">
   <template slot="modal-body">
     <div class="modal-body">
       <div class="quota-list">
        <h1 class="qota-type">广告位数据:</h1>
        <d-checkbox-group :value.sync="checkList">
          <template v-for="(index,item) in slotArr" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.id" @change="selectChange(item.id)" >{{item.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
       </div>
       <div class="quota-list">
        <h1 class="qota-type">活动数据:</h1>
        <d-checkbox-group :value.sync="checkList">
          <template v-for="(index,item) in actArr" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.id" @change="selectChange(item.id)" >{{item.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
       </div>
       <div class="quota-list">
        <h1 class="qota-type">广告券数据:</h1>
        <d-checkbox-group :value.sync="checkList">
          <template v-for="(index,item) in advArr" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.id" @change="selectChange(item.id)" >{{item.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
       </div>
       <div class="quota-list">
        <h1 class="qota-type">收入数据:</h1>
        <d-checkbox-group :value.sync="checkList">
          <template v-for="(index,item) in profitArr" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.id" @change="selectChange(item.id)" >{{item.title}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
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
const slotArr = [
  {
    title: '广告位返回成功PV',
    id: 'actSucResponseCount'
  },
  {
    title: '广告位曝光PV',
    id: 'actExposeCount'
  },
  {
    title: '广告位曝光UV',
    id: 'actExposeUv'
  },
  {
    title: '广告位点击PV',
    id: 'actClickCount'
  },
  {
    title: '广告位点击UV',
    id: 'actClickUv'
  },
  {
    title: '广告位点击率',
    id: 'actClickRate'
  },
  {
    title: '广告位访问PV',
    id: 'sdkPv'
  },
  {
    title: '广告位访问UV',
    id: 'sdkUv'
  },
  {
    title: '广告位CTR(UV)',
    id: 'ctr'
  }
];
const actArr = [
  {
    title: '活动请求PV',
    id: 'actRequestCount'
  },
  {
    title: '活动请求UV',
    id: 'actRequestUv'
  },
  {
    title: '活动参与PV',
    id: 'participateCount'
  },
  {
    title: '活动参与UV',
    id: 'participateUv'
  },
  {
    title: '参与率',
    id: 'participateRate'
  },
  {
    title: '复参数',
    id: 'participateTimes'
  },
  {
    title: '每UV发券',
    id: 'launchPerUv'
  }
];
const advArr = [
  {
    title: '广告券请求数',
    id: 'advertRequestCount'
  },
  {
    title: '每UV券请求',
    id: 'arcPsu'
  },
  {
    title: '广告券发券量',
    id: 'launchCount'
  },
  {
    title: '付费券占比',
    id: 'plpPlc'
  },
  {
    title: '请求成功率',
    id: 'requestSuccessRate'
  },
  {
    title: '发券成功率',
    id: 'launchSuccessRate'
  },
  {
    title: '广告券曝光量',
    id: 'advertExposureCount'
  },
  {
    title: '广告劵点击量',
    id: 'efClickCount'
  },
  {
    title: '每UV券点击',
    id: 'clickPerUv'
  },
  {
    title: '广告券点击率',
    id: 'advertClickRate'
  },
  {
    title: '付费券点击率',
    id: 'plpClickRate'
  },
  {
    title: '付费券点击单价',
    id: 'plpClickPrice'
  }
];
const profitArr = [
  {
    title: '广告券点击单价',
    id: 'adClickPrice'
  },
  {
    title: '发券ARPU值',
    id: 'launchArpu'
  },
  {
    title: '付费券arpu值',
    id: 'acPplp'
  },
  {
    title: '媒体CPM',
    id: 'mediaCpm'
  },
  {
    title: 'UV单价（元)',
    id: 'uvPrice'
  },
  {
    title: '媒体UV单价（元）',
    id: 'mediaUvPrice'
  },
  {
    title: '活动点击单价',
    id: 'actClickPrice'
  },
  {
    title: '媒体点击单价',
    id: 'mediaClickPrice'
  },
  {
    title: '广告消耗',
    id: 'adConsume'
  },
  {
    title: '媒体预计分成',
    id: 'mediaExDivide'
  },
  {
    title: '媒体应得分成',
    id: 'mediaDueDivide'
  },
  {
    title: '分成比例',
    id: 'dividePercent'
  }
];
export default {
  props: {
    show: {
      require: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    checkList: {
      require: true,
      default: () => []
    },
    onOk: {
      require: true,
      type: Function
    }
  },
  data() {
    return {
      slotArr: slotArr,
      actArr: actArr,
      advArr: advArr,
      profitArr: profitArr
    };
  },
  methods: {
    selectChange(id) {
      if (this.checkList.length > 2) {
        this.checkList.splice(0, 1);
      }
    },
    close() {
      this.show = false;
    }
  }
};
</script>
<style lang="less">
.quotamodal {
  .modal-dialog {
    height: 500px !important;
  }
  .checkbox-group {
    display: inline-block;
    padding-left: 10px;
    width: 100%;
    .d-checkbox-control {
      padding-left: 18px;
      margin-right: 20px;
      .icon {
        width: 14px;
        height: 14px;
      }
    }
  }
  .quota-list {
    margin-bottom: 20px;
    .qota-type {
     font-size: 100%;
    }
    .quota-item {
      display: inline-block;
      width: 180px;
    }
  }
}
</style>

