<template>
  <pagetitle title="活动广告位维度实时数据" class="title"></pagetitle>
  <div class="page-content dimension cf">
    <div class="cf inp-filter">
      <div class="form-filter-group cf">
        <p class="filter-label fl  filter-label-activityid">活动ID：</p>
        <input type="text" class="form-control fl form-control-act-slot" placeholder="不输入ID显示全局" v-model= "params.activityId" @blur="onBlur()">
      </div>
      <div class="form-filter-group cf">
        <p class="filter-label fl  filter-label-slotid">广告位ID：</p>
        <input type="text" class="form-control fl form-control-act-slot" placeholder="不输入ID显示全局" v-model= "params.slotId" @blur="onBlur()">
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">额外日期数据：</p>
        <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
      </div>
      <div class="form-filter-group cf form-filter-group-source-type">
        <d-select :options.sync="sourceTypeArr" :value.sync="params.sourceType" @select="sourceTypeChange()"></d-select>
      </div>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="primary" @click="getDataList">查询</d-button>
      </div>
    </div>
    <div class="broken-line-content">
      <div class="app-desc">
         <h2 v-if="activityTitle">活动名称：{{activityTitle}}</h2>
         <h2 v-if="slotName">广告位名称：{{slotName}}</h2>
      </div>
      <div class="title">
        <h2>折线图</h2>
        <a :href="'/tuia/activity/adslot/download?activityId=' + params.activityId + '&slotId=' + params.slotId + '&extraDate=' + params.extraDate + '&sourceType=' + params.sourceType" class="download fr mr2"><i class="iconhandle mr5">&#xe606;</i>导出</a>
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
      <div id="mainline" style="height:400px;width:100%;margin-top:20px;"></div>
    </div>
    <div class="bar-content">
      <div v-bind:class="{ 'bar-content-left-actived': addbar, 'bar-content-left': true }">
        <bar-chart v-if="dataIsReady" :data-list="listForbar" :is-show-sdk-uv="false" :is-left-chart="true" :chart-id="'leftbar'" :select-time-node.sync= "selectTimeNode" :select-day.sync="selectDay" :select-dimension.sync="selectDimensionForBar"></bar-chart>
      </div>
      <div v-bind:class="{ 'bar-content-right-actived': addbar, 'bar-content-right': true }">
        <template v-if="dataIsReady">
           <template v-if="addbar">
             <bar-chart :data-list="listForbar"  :chart-id="'rightbar'" :is-show-sdk-uv="false" :select-time-node= "_selectTimeNode" :select-day="_selectDay" :select-dimension="_selectDimensionForBar"></bar-chart>
             <div class="del-bar-btn" @click="delbarAction">
                 <i class="iconhandle">&#xe61d;</i>删除对比漏斗图
             </div>
           </template>
           <template v-else>
               <div class="add-bar-btn" @click="addbarAction">
                 <i class="iconhandle">&#xe762;</i>添加对比漏斗图
               </div>
           </template>
        </template>
      </div>
    </div>
  </div>
  <loading :show="$loadingRouteData"></loading>
  <alarm-cfg-modal v-if="isShowCfgModalAsync" :show.sync="isShowCfgModal" :alarmmodal="alarmModalCfg" :close.sync="closeAlarmModal" :is-can-check="false"></alarm-cfg-modal>
</template>
<script>
  import MessageBox from 'components/basic/MessageBox';
  import barChart from './components/barChart.vue';
  import chectMediaDimensionMixins from './mixins/chectMediaDimensionMixins.js';
  import mediaDimensionMixins from './mixins/mediaDimensionMixins.js';
  import ObjectAssign from 'object-assign';
  import alarmCfgModal from './components/alarmCfg.vue';
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
    }];
  const sourceTypeArr = [
    {
      label: '普通活动',
      id: 1
    },
    {
      label: '插件活动',
      id: 2
    },
    {
      label: '全部活动',
      id: 3
    }
  ];
  export default {
    mixins: [chectMediaDimensionMixins, mediaDimensionMixins],
    components: {
      barChart,
      alarmCfgModal
    },
    data() {
      return {
        isShowCfgModal: false,
        isShowCfgModalAsync: false,
        alarmModalCfg: {},
        selectDimension: 'launchCount',
        selectArr: selectArr,
        listForLine: {},
        listForbar: {},
        dataIsReady: false,
        loadingRouteData: true,
        totalData: [],
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
        sourceTypeArr: sourceTypeArr,
        isNeedChangeSourceType: true,
        params: {
          sourceType: 3,
          activityId: '',
          slotId: '',
          extraDate: this._getYesDay(formatDate(new Date()))
        },
        addbar: false,
        activityTitle: '',
        slotName: ''
      };
    },
    route: {
      data(transition) {
        if (this.$route.params.act && this.$route.params.act !== 'undefined') {
          this.params.activityId = this.$route.params.act;
        }
        if (this.$route.params.slot && this.$route.params.slot !== 'undefined') {
          this.params.slotId = this.$route.params.slot;
        }
        if (this.$route.params.type && this.$route.params.type !== 'undefined') {
          this.params.sourceType = Number(this.$route.params.type);
        }
        if (getItem('extraDate5') !== void (0)) {
          this.params.extraDate = getItem('extraDate5');
        }
        this.getDataList(transition);
      }
    },
    methods: {
      saveTime() {
        setItem('extraDate5', this.params.extraDate);
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
        this.$http.get('/tuia/activity/adslot/line/chart', {
          params: this.params
        }).then((res) => {
          res = res.json();
          if (res.success) {
            this.saveTime();
            this.slotName = res.data.slotName;
            this.activityTitle = res.data.activityTitle;
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
          dimensionType: 5,
          showInput: {
            activity: true,
            slot: true,
            app: false
          },
          quota: this.selectDimension,
          activityId: this.params.activityId,
          slotId: this.params.slotId,
          quotaArr: this.selectArr
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
      onBlur() {
        if (this.isNeedChangeSourceType) {
          this.params.sourceType = 1;
        }
      },
      sourceTypeChange() {
        this.isNeedChangeSourceType = false;
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
      .filter-label-slotid {
        width: 73px !important;
      }
      .filter-label-activityid {
        width: 63px !important;;
      }
      .form-control {
        width: 200px;
        margin-right: 15px;
        &.form-control-act-slot {
          width: 140px;
        }
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
      &.form-filter-group-source-type {
        .select-group {
          width: 104px;
        }
        .iconhandle {
          right: 10px !important;
        }
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
        right: 0;
        cursor: pointer;
        color:#657180 !important;
        line-height: 1;
        font-weight: normal;
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
          border-right: none;
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
          border-left: none;
          border-right:1px solid #eee;
          border-top:1px solid #eee;
          border-bottom:1px solid #eee;
          width: 50%;
        }
      }
    }
  }
</style>
