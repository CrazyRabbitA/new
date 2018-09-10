<template>
  <pagetitle title="媒体维度实时数据" class="title"></pagetitle>
  <div class="page-content dimension cf">
    <div class="cf inp-filter">
      <div class="form-filter-group cf">
        <p class="filter-label fl  filter-label-id">媒体ID：</p>
        <input type="text" class="form-control fl" placeholder="不输入ID显示全局数据" v-model= "params.appId">
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">额外日期数据：</p>
        <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
      </div>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="primary" @click="getDataList" >查询</d-button>
      </div>
    </div>
    <div class="broken-line-content">
      <div class="app-desc">
         <h2 v-if="appName">媒体名称：{{appName}}</h2>
      </div>
      <div class="title">
        <h2>折线图</h2>
        <a :href="'/tuia/app/download?appId=' + params.appId + '&extraDate=' + params.extraDate" class="download fr"><i class="iconhandle mr5">&#xe606;</i>导出</a>
      </div>
      <d-select :options.sync="selectArr" :value.sync="selectDimension" @select="selectDimensionChange"></d-select>
      <div class="total-data">
        <h2>汇总</h2>
        <p><span class="point a"></span> 今日： {{totalData[0]}}</p>
        <p><span class="point b"></span> 昨日：{{totalData[1]}}</p>
        <p><span class="point c"></span> 历史七日： {{totalData[2]}}</p>
        <p v-if="hasExtraDate"><span class="point d"></span> 额外日期：{{totalData[3]}}</p>
      </div>
      <h2 class="alarm" @click="showAlarmModal"><i class="iconnav">&#xe6c9;</i> 警报</h2>
      <h2 class="rank" @click="showRankModal"><i class="iconnav">&#xe6ac;</i> 涨跌</h2>
      <h2 class="top-media" @click="showTopModal"><i class="iconnav">&#xe6b6;</i> 榜单</h2>
      <div id="mainline" style="height:400px;width:100%;margin-top:20px;"></div>
    </div>
    <div class="bar-content">
      <div :class="{ 'bar-content-left-actived': addbar, 'bar-content-left': true }">
        <bar-chart v-if="dataIsReady" :data-list="listForbar" :is-left-chart="true" :chart-id="'leftbar'" :select-time-node.sync= "selectTimeNode" :select-day.sync="selectDay" :select-dimension.sync="selectDimensionForBar"></bar-chart>
      </div>
      <div :class="{ 'bar-content-right-actived': addbar, 'bar-content-right': true }">
        <template v-if="dataIsReady">
           <template v-if="addbar">
             <bar-chart :data-list="listForbar"  :chart-id="'rightbar'" :select-time-node= "_selectTimeNode" :select-day="_selectDay" :select-dimension="_selectDimensionForBar"></bar-chart>
             <div class="del-bar-btn" @click="delbarAction">
                 <i class="iconhandle">&#xe61d;</i>删除对比柱状图
             </div>
           </template>
           <template v-else>
               <div class="add-bar-btn" @click="addbarAction">
                 <i class="iconhandle">&#xe762;</i>添加对比柱状图
               </div>
           </template>

        </template>
      </div>
    </div>
  </div>
  <loading :show="$loadingRouteData"></loading>
  <alarm-cfg-modal v-if="isShowCfgModalAsync" :show.sync="isShowCfgModal" :alarmmodal="alarmModalCfg" :close.sync="closeAlarmModal"></alarm-cfg-modal>
  <rank-modal v-if="isShowRankModalAsync" :show.sync="isShowRankModal" :quota-type="quotaType" :select-day="params.extraDate" :app-id= "params.appId" :close.sync="closeRankModal"></rank-modal>
  <top-modal v-if="isShowTopModalAsync" :show.sync="isShowTopModal" :top-type="'appTop'" :quota-type="quotaType" :select-day="params.extraDate" :close.sync="closeTopModal"></top-modal>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import barChart from './components/barChart.vue';
  import chectMediaDimensionMixins from './mixins/chectMediaDimensionMixins.js';
  import mediaDimensionMixins from './mixins/mediaDimensionMixins.js';
  import ObjectAssign from 'object-assign';
  import alarmCfgModal from './components/alarmCfg.vue';
  import rankModal from './components/rank.vue';
  import topModal from './components/top.vue';
  import { formatDate } from 'components/utils/dateUtils';
  import {getItem, setItem} from 'components/utils/localStorage';
  const selectArr = [
    {
      label: '广告位请求成功pv',
      id: 'actSucResponseCount'
    },
    {
      label: '广告位曝光pv',
      id: 'actExposeCount'
    },
    {
      label: '广告位曝光uv',
      id: 'actExposeUv'
    },
    {
      label: '广告位点击pv',
      id: 'actClickCount'
    },
    {
      label: '广告位点击uv',
      id: 'actClickUv'
    },
    {
      label: '广告位点击率',
      id: 'advertClickRate'
    },
    {
      label: '广告位访问pv',
      id: 'sdkPv'
    },
    {
      label: '广告位访问uv',
      id: 'sdkUv'
    },
    {
      label: '广告位CTR（UV）',
      id: 'ctr'
    },
    {
      label: '活动请求pv',
      id: 'actRequestCount'
    },
    {
      label: '活动请求uv',
      id: 'actRequestUv'
    },
    {
      label: '活动参与pv',
      id: 'participateCount'
    },
    {
      label: '活动参与uv',
      id: 'participateUv'
    },
    {
      label: '广告位参与率',
      id: 'actParticipateRate'
    },
    {
      label: '参与率',
      id: 'participateRate'
    },
    {
      label: '复参数',
      id: 'dupliParticipateRate'
    },
    {
      label: '每UV发券',
      id: 'launchPerSdkUv'
    },
    {
      label: '活动广告券请求pv',
      id: 'advertRequestCount'
    },
    {
      label: '每UV券请求',
      id: 'arcPsu'
    },
    {
      label: '请求成功率',
      id: 'requestParticipateRate'
    },
    {
      label: '发券成功率',
      id: 'launchRequestRate'
    },
    {
      label: '活动广告发券量',
      id: 'launchCount'
    },
    {
      label: '付费券占比',
      id: 'plpPlc'
    },
    {
      label: '广告券曝光pv',
      id: 'advertExposureCount'
    },
    {
      label: '广告券点击pv',
      id: 'advertClickCount'
    },
    {
      label: '每UV券点击',
      id: 'clickPerSdk'
    },
    {
      label: '广告券点击率',
      id: 'clickExposureRate'
    },
    {
      label: '每uv收益',
      id: 'advertFeePerSdkUv'
    },
    {
      label: '点击单价',
      id: 'clickPrice'
    },
    {
      label: '广告消耗',
      id: 'advertFee'
    },
    {
      label: 'arpu值',
      id: 'arpu'
    },
    {
      label: '付费券arpu值',
      id: 'acPplp'
    }
  ];
  export default {
    mixins: [chectMediaDimensionMixins, mediaDimensionMixins],
    components: {
      barChart,
      alarmCfgModal,
      rankModal,
      topModal
    },
    data() {
      return {
        isShowTopModal: false,
        isShowTopModalAsync: false,
        isShowCfgModal: false,
        isShowCfgModalAsync: false,
        isShowRankModal: false,
        isShowRankModalAsync: false,
        alarmModalCfg: {},
        selectDimension: 'advertFee',
        selectArr: selectArr,
        listForLine: {},
        listForbar: {},
        dataIsReady: false,
        loadingRouteData: true,
        totalData: [],
        isNotAct: true,
        hasExtraDate: false,
        selectTimeNode: 'all',
        selectDay: 'today',
        selectDimensionForBar: 'visit',
        _selectTimeNode: '',
        _selectDay: '',
        _selectDimension: '',
        showNewListForLine: {
          today: {},
          yesterday: {},
          before7days: {}
        },
        params: {
          appId: '',
          extraDate: this._getYesDay(formatDate(new Date()))
        },
        addbar: false,
        appName: '',
        quotaType: ''
      };
    },
    route: {
      data(transition) {
        if (this.$route.params.id && this.$route.params.id !== 'undefined') {
          this.params.appId = this.$route.params.id;
        }
        if (this.$route.params.data && this.$route.params.data !== 'undefined') {
          this.params.extraDate = this.$route.params.data;
        } else {
          if (getItem('extraDate1') !== void (0)) {
            this.params.extraDate = getItem('extraDate1');
          }
        }
        this.getDataList(transition);
      }
    },
    methods: {
      saveTime() {
        setItem('extraDate1', this.params.extraDate);
      },
      _getYesDay(dateStr) {
        let yes = new Date(dateStr) - 1000 * 60 * 60 * 24 * 7;
        return formatDate(yes);
      },
      /**
       * 时间禁选
      */
      disabledDate: function(date) {
        var now = new Date();
        if (date.getTime() > (now.getTime() - 24 * 60 * 60 * 1000)) {
          return true;
        }
        if (now.getTime() > (date.getTime() + 24 * 60 * 60 * 1000 * 30)) {
          return true;
        }
      },
      getDataList: function(transition) {
        this.$loadingRouteData = true;
        this.$http.get('/tuia/app/line/chart', {
          params: this.params
        }).then((res) => {
          res = res.json();
          if (res.success) {
            this.saveTime();
            this.appName = res.data.appName;
            this.listForLine = ObjectAssign({}, res.data);
            this.listForbar = ObjectAssign({}, res.data);
            /* v-if 强制改变生命周期 避免子组件初始获取不到数据 */
            this.getLineDate(this.listForLine, this.selectDimension);
            this.$loadingRouteData = false;
            if (this.listForLine.extraDate && this.listForLine.extraDate.launchCount) {
              this.hasExtraDate = true;
            } else {
              this.hasExtraDate = false;
            }
            this.dataIsReady = true;
          } else {
            this.$loadingRouteData = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      selectDimensionChange() {
        this.getLineDate(this.listForLine, this.selectDimension);
      },
      addbarAction() {
        this.addbar = true;
        this._selectTimeNode = this.selectTimeNode;
        this._selectDay = this.selectDay;
        this._selectDimensionForBar = this.selectDimensionForBar;
      },
      delbarAction() {
        this.addbar = false;
      },
      showAlarmModal() {
        this.alarmModalCfg = {
          dimensionType: 1,
          showInput: {
            activity: false,
            slot: false,
            app: true
          },
          quota: this.selectDimension,
          quotaArr: this.selectArr,
          appId: this.params.appId
        };
        this.isShowCfgModal = true;
        this.isShowCfgModalAsync = true;
      },
      closeAlarmModal() {
        this.isShowCfgModal = false;
        setTimeout(() => {
          this.isShowCfgModalAsync = false;
        }, 500);
      },
      showRankModal() {
        this.quotaType = this.selectDimension;
        this.isShowRankModal = true;
        this.isShowRankModalAsync = true;
      },
      closeRankModal() {
        this.isShowRankModal = false;
        setTimeout(() => {
          this.isShowRankModalAsync = false;
        }, 500);
      },
      showTopModal() {
        this.quotaType = this.selectDimension;
        this.isShowTopModal = true;
        this.isShowTopModalAsync = true;
      },
      closeTopModal() {
        this.isShowTopModal = false;
        setTimeout(() => {
          this.isShowTopModalAsync = false;
        }, 500);
      }
    }
  };
</script>
<style lang="less">
  .main {
    background-color: #fff;
    padding: 20px;
    margin: 20px;
  }
  .dimension {
    .mr5 {
      margin-right: 5px;
    }
    .download {
      line-height: 1;
      color: #657180 !important;
    }
    .page-title {
      border-bottom: none;
    }
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      line-height: 1;
      .filter-label{
        font-size: 14px;
        font-weight: bold;
        color: #444;
        width: 100px;
        text-align: right;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
      }
      .filter-label-id {
        width: 62px !important;
      }
      .form-control {
        width: 200px;
        margin-right: 15px;
      }
      .datepicker-input {
        width: 160px !important;
      }
      .iconhandle {
        right: 26px !important;
      }
      .datepicker-popup .datepicker-ctrl span {
        right: 0 !important;
      }
    }
    .serch-btn {
      float: right;
      .searchfilter{
        background-color: #ef6b3b;
        border: 1px solid #ef6b3b;
      }
    }
    .broken-line-content {
      position: relative;
      .app-desc {
        position: absolute;
        padding: 20px;
        left: 48%;
        transform: translateX(-50%);
        h2 {
          text-align: center;
          padding: 5px 0;
        }
      }
      .title {
        border-top: 1px solid #dfdfdf;
        padding-top: 18px;
        padding-bottom: 14px;
        h2 {
          display: inline-block;
        }
        a {
          color: #444;
        }
        .download {
          &:hover {
            color: #ef6b3b !important;
          }
        }
      }
      .total-data {
        position: absolute;
        top: 0;
        padding: 20px;
        right: 100px;
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
      .select-menu {
        max-height: 360px;
      }
      .alarm {
        position: absolute;
        top: 60px;
        right: 0px;
        cursor: pointer;
        color:#657180 !important;
        line-height: 1;
        font-weight: normal;
        &:hover {
          color: #ef6b3b;
        }
      }
      .rank {
        position: absolute;
        z-index: 1;
        top: 104px;
        right: 0px;
        cursor: pointer;
        color:#657180 !important;
        font-weight: normal;
        line-height: 1;
        &:hover {
          color: #ef6b3b;
        }
      }
      .top-media  {
        position: absolute;
        z-index: 1;
        top: 144px;
        right: 0px;
        cursor: pointer;
        color:#657180 !important;
        font-weight: normal;
        line-height: 1;
        &:hover {
          color: #ef6b3b;
        }
      }
    }
    .select-group {
      z-index: 1;
    }
    .bar-content {
      .page-title {
        padding: 0 20px 10px;
      }
      .bar-content-left {
        float: left;
        width: 50%;
        height: 500px;
        border: 1px solid #eee;
        padding: 20px 0;
        &.bar-content-left-actived {
          border-right: 0 solid #eee;
          width: 50%;
        }
      }
      .bar-content-right {
        float: right;
        position: relative;
        width: 48%;
        height: 500px;
        border: 2px dotted #d8d8d8;
        padding: 20px 0;
        border-radius: 4px;
        .add-bar-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          background: #29b6b0;
          border-radius: 2px;
          width: 160px;
          height: 38px;
          color: #fff;
          line-height: 38px;
          text-align: center;
          cursor: pointer;
        }
        .del-bar-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          background: #ef6b3b;
          border-radius: 2px;
          width: 160px;
          height: 38px;
          color: #fff;
          line-height: 38px;
          text-align: center;
          cursor: pointer;
        }
        &.bar-content-right-actived {
          border-left: 0 solid #eee;
          border-right:1px solid #eee;
          border-top:1px solid #eee;
          border-bottom:1px solid #eee;
          width: 50%;
        }
      }
    }
  }
</style>
