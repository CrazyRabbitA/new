<template>
  <div class="media-offline-warp">
    <pagetitle class="media-offline-title" title="媒体历史数据"></pagetitle>
    <time-select :time-obj.sync="timeObj" :date-tags-type.sync="dateTagsType" :button-time="buttonTime"></time-select>
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">媒体ID：</p>
        <auto-input :input-class="'form-control fl'"  :result-list="appIdList" :value.sync="params.appId"  @on-click="mediaClick" @on-change="appIdChange"></auto-input>
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">媒体名称：</p>
        <auto-input :input-class="'form-control fl'" :result-list="appNameList" :value.sync="params.appName"  @on-click="mediaClick" @on-change="appNameChange"></auto-input>
      </div>
      <d-button class="searchfilter" size="large" type="warning" @click="getDataList" >查询</d-button>
      </div>
      <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">广告位ID：</p>
        <auto-input :input-class="'form-control fl'"  :result-list="slotIdList" :value.sync="params.slotId"  @on-click="slotClick" @on-change="slotIdChange"></auto-input>
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">广告位名称：</p>
        <auto-input :input-class="'form-control fl'" :result-list="slotNameList" :value.sync="params.slotName"  @on-click="slotClick" @on-change="slotNameChange"></auto-input>
      </div>
    </div>
    <div class="media-offline-chart">
      <div class="filter-area">
        <span class="quota">指标:</span>
        <ul>
          <template v-for="item in quotas" track-by="$index">
            <li @click="changeQuota(item.id, item.title)" :class="{active: isActive(item.id)}">{{item.title}}</li>
          </template>
          <li @click="showQuota()">其他  <i class="iconhandle">&#xe618;</i></li>
          <li @click="downTable" class="download"><i class="iconhandle mr2">&#xe606;</i>导出</li>
          <li @click="analysisShow" class="analysis"><i class="iconnav analysis-icon mr2">&#xe6ba;</i>分析</li>
        </ul>
      </div>
     <offline-chart :line-id="'offline'" :quotas="checkList" :chart-data="data" v-ref:offline ></offline-chart>
    </div>
    <loading :show="$loadingRouteData"></loading>
    <analysis-modal :show.sync="isShowAnalysisModal" :date-tags-type="dateTagsType" :slot-id="params.slotId" v-ref:analysis></analysis-modal>
    <quota-modal :show.sync="isShowQuotaModal" :check-list="checkList" :on-ok="dispatchLine"></quota-modal>
  </div>
</template>
<script>
import timeSelect from './components/timeSelect';
import autoInput from '../monitor/components/autoInput';
import quotaModal from './components/quotaModal';
import MessageBox from 'components/basic/MessageBox';
import offlineChart from './components/offlineChart';
import analysisModal from './components/analysisModal';
const quotas = [
  {
    title: '广告消耗',
    id: 'adConsume'
  },
  {
    title: '广告位点击率',
    id: 'actClickRate'
  },
  {
    title: '广告位访问UV',
    id: 'sdkUv'
  },
  {
    title: '每UV发券',
    id: 'launchPerUv'
  },
  {
    title: '每UV券点击',
    id: 'clickPerUv'
  },
  {
    title: '广告券发券量',
    id: 'launchCount'
  }
];
export default {
  components: {
    timeSelect,
    autoInput,
    quotaModal,
    offlineChart,
    analysisModal
  },
  route: {
    data(transition) {
      if (
        (this.$route.params.appid || this.$route.query.appid) &&
        this.$route.params.appid !== '0'
      ) {
        this.params.appId = this.$route.query.appid || this.$route.params.appid;
      }
      if (
        (this.$route.params.slotid || this.$route.query.slotid) &&
        this.$route.params.slotid !== '0'
      ) {
        this.params.slotId =
          this.$route.query.slotid || this.$route.params.slotid;
      }
      if (this.$route.query.appName) {
        this.params.appName = this.$route.query.appName;
      }
      this.getDataList(transition).then(() => {
        if (this.$route.query.id && this.$route.query.name) {
          if (this.$route.query.id === 'adConsume') {
            return;
          }
          this.changeQuota(this.$route.query.id, this.$route.query.name);
        }
      });
    }
  },
  data() {
    return {
      data: {},
      appIdList: [],
      appNameList: [],
      slotIdList: [],
      slotNameList: [],
      checkList: ['adConsume'],
      timeObj: {
        startDate: '',
        endDate: ''
      },
      dateTagsType: 1,
      params: {
        appId: '',
        appName: '',
        slotId: '',
        slotName: '',
        dateType: 1
      },
      quotas: quotas,
      isShowAnalysisModal: false,
      analysisTime: {},
      compareTime: {},
      isShowQuotaModal: false,
      buttonTime: true
    };
  },
  methods: {
    downTable() {
      let goLink = `/media/data/download?slotId=${
        this.params.slotId
      }&slotName=${this.params.slotName}&appName=${this.params.appName}&appId=${
        this.params.appId
      }&date=${this.timeObj.startDate}&endDate=${this.timeObj.endDate}`;
      window.open(goLink);
    },
    analysisShow() {
      this.isShowAnalysisModal = true;
      this.$refs.analysis.initData();
    },
    appIdChange() {
      if (!this.params.appId) {
        this.appIdList = [];
        return;
      }
      this.$http
        .post('/media/app', {
          appId: this.params.appId
        })
        .then(
          res => {
            res = res.json();
            this.appIdList = [];
            if (res.success) {
              res.data.forEach(item => {
                this.appIdList.push({
                  key: item.id,
                  value: item.name
                });
              });
            }
          },
          res => {}
        );
    },
    appNameChange() {
      if (!this.params.appName) {
        this.appIdList = [];
        return;
      }
      this.$http
        .post('/media/app', {
          appName: this.params.appName
        })
        .then(
          res => {
            res = res.json();
            this.appNameList = [];
            if (res.success) {
              res.data.forEach(item => {
                this.appNameList.push({
                  key: item.id,
                  value: item.name
                });
              });
            }
          },
          res => {}
        );
    },
    slotIdChange() {
      if (!this.params.slotId) {
        this.appIdList = [];
        return;
      }
      this.$http
        .post('/media/slot', {
          slotId: this.params.slotId
        })
        .then(
          res => {
            res = res.json();
            this.slotIdList = [];
            if (res.success) {
              res.data.forEach(item => {
                this.slotIdList.push({
                  key: item.id,
                  value: item.name
                });
              });
            }
          },
          res => {}
        );
    },
    slotNameChange() {
      if (!this.params.slotName) {
        this.appIdList = [];
        return;
      }
      this.$http
        .post('/media/slot', {
          slotName: this.params.slotName
        })
        .then(
          res => {
            res = res.json();
            this.slotNameList = [];
            if (res.success) {
              res.data.forEach(item => {
                this.slotNameList.push({
                  key: item.id,
                  value: item.name
                });
              });
            }
          },
          res => {}
        );
    },
    mediaClick(value) {
      this.params.appId = value.key;
      this.params.appName = value.value;
      this.getDataList();
    },
    slotClick(value) {
      this.params.slotId = value.key;
      this.params.slotName = value.value;
      this.getDataList();
    },
    getDataList() {
      const promise = new Promise((resolve, reject) => {
        this.hassuccess = true;
        this.$loadingRouteData = true;
        this.params.dateType = this.dateTagsType;
        this.$http
          .post('/media/data', {
            appId: this.params.appId,
            appName: this.params.appName,
            slotId: this.params.slotId,
            slotName: this.params.slotName,
            date: this.timeObj.startDate,
            endDate: this.timeObj.endDate,
            dateType: this.params.dateType
          })
          .then(
            res => {
              this.$loadingRouteData = false;
              res = res.json();
              this.slotNameList = [];
              if (res.success) {
                this.data = res.data;
                this.dispatchLine();
                resolve();
              } else {
                MessageBox({
                  title: res.desc,
                  type: 'error'
                });
              }
            },
            res => {
              this.$loadingRouteData = false;
              MessageBox({
                title: '网络错误！',
                type: 'error'
              });
            }
          );
      });
      return promise;
    },
    isActive(id) {
      let notHas = false;
      this.checkList.forEach(item => {
        if (item === id) {
          notHas = true;
        }
      });
      return notHas;
    },
    changeQuota(id, title) {
      let notHas = true;
      let curIndex = 0;
      this.checkList.forEach((item, index) => {
        if (item === id) {
          notHas = false;
          curIndex = index;
        }
      });
      // 判断有没有超过2个
      if (
        (this.checkList.length === 2 || this.checkList.length > 2) &&
        notHas
      ) {
        this.checkList.splice(0, 1);
      }
      // 选 与 不选
      if (notHas) {
        this.checkList.push(id);
      } else {
        this.checkList.splice(curIndex, 1);
      }

      this.isActive(id);
      // render图表
      this.dispatchLine();
    },
    showQuota() {
      this.isShowQuotaModal = true;
    },
    dispatchLine() {
      this.isShowQuotaModal = false;
      if (this.isEmptyObject(this.data)) {
        MessageBox({
          title: '广告位/媒体当前时段无数据！',
          type: 'error'
        });
        return false;
      }
      // 判断必须选中1个
      if (this.checkList.length === 0) {
        MessageBox({
          title: '对不起，最少选择一个指标！',
          type: 'error'
        });
        return false;
      }
      this.$refs.offline.getResourcesDate(this.data, this.checkList);
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>
<style lang="less">
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  .media-offline-warp {
    position: relative;
    .media-offline-title {
      border-bottom: 0px;
    }
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      .filter-label {
        font-size: 14px;
        font-weight: bold;
        color: #444;
        width: 84px;
        text-align: left;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        &.long {
          width: 120px;
          text-align: left;
        }
      }
      .form-control {
        width: 120px;
        display: inline-block;
        margin-right: 10px;
      }
      .datepicker-input {
        width: 160px !important;
      }
      .iconhandle {
        right: 26px !important;
      }
    }
    .media-offline-chart {
      margin-top: 80px;
      .filter-area {
        font-size: 0px;
        ul {
          font-size: 0px;
          display: inline-block;
          border-right: 0px solid #e3e3e3;
        }
        .download {
          margin-left: 20px;
          background-color: #fff;
          border: 0px;
          color: #657180 !important;
        }
        .analysis {
          border: none;
          background-color: #fff;
          .analysis-icon {
            font-size: 12px;
          }
        }
        li {
          display: inline-block;
          border: 1px solid #e3e3e3;
          background-color: #f7f6f2;
          border-right: none;
          height: 34px;
          line-height: 34px;
          padding: 0 14px;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #ef6b3b;
          }
          &.active {
            background-color: #ef6b3b;
            color: #fff;
            border: 1px solid #ef6b3b;
          }
          &:nth-child(7) {
            border-right: 1px solid #e3e3e3;
          }
          .iconhandle {
            font-size: 14px;
          }
        }
        .quota {
          font-size: 14px;
          font-weight: bold;
          color: #444;
          width: 84px;
          text-align: left;
          display: inline-block;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>


