<template>
  <div class="panel-wrapper">
    <pagetitle  title="核心数据看板" :sub-title="newtime"></pagetitle>
    <div class="search-wrapper">
      <daterangepicker :error-show.sync="errorShow" :start.sync="params.date" :end.sync="params.endDate" :range="30"></daterangepicker>
      <span class="reset" @click="reset">
        <i class="iconhandle" >&#xe609;</i>
      </span>
      <div class="select-wrapper">
        <div class="input-item">
          <d-select :options.sync="selectOpt" @select="selval"  :value.sync = 'selectval' ></d-select>
        </div>
        <div v-if="selectval === '2' " class="input-item">
          <input type="text" class="form-control input-type" v-model = "params.appId" placeholder="请输入媒体ID" />
        </div>
        <div v-if="selectval === '3' " class="input-item">
          <input type="text" class="form-control input-type" v-model = "params.slotId" placeholder="请输入广告位ID" />
        </div>
        <d-button class="searchfilter" size="large" type="warning" @click="search" >查询</d-button>
      </div>
    </div>
    <h2 v-show="appName" style="font-size:24px;margin:10px 0">{{appName}}</h2>
    <!-- 文字图列表 -->
    <div class="core-wrapper">
      <wordchart :time = "coredataTime" :url = 'url' :params = "params" :size = "size" :datas = "coredata"></wordchart>
    </div>
    <!-- 媒体信息 -->
    <div class="media-wrapper"  >
      <div class="media-item" v-for="(index,item) in mediaList" :key="index">
        <barchart
          v-if="item.type==='bar_chart'"
          :params = 'params'
          :ids="item.id"
          :url = "urlmedia"
          :datas="mediaprop[item.id]"
          :propparams = "propparams"
          ></barchart>
        <linechart
          v-if="item.type==='line_chart'"
          :params = 'params'
          :ids="item.id"
          :url="urlmedia"
          :propparams = "propparams"
          :datas="mediaprop[item.id]"></linechart>
        <piechart
          v-if="item.type==='pie_chart'"
          :params = 'params'
          :url="urlmedia"
          :is-solid = 'false'
          :ids = "item.id"
          :propparams = "propparams"
          :datas = "mediaprop[item.id]"></piechart>
      </div>
    </div>
    <!-- 广告 -->
    <div class="advert-wrapper">
      <div class="media-item" v-for="(index,item) in topadList" :key="index">
        <barchart
          :params = 'params'
          :ids="item.id"
          :url = "urlka"
          v-if="item.type==='bar_chart'"
          :propkey="item.propkey"
          :datas="adprop[item.id]"
          :propparams = "propparams"
          ></barchart>
        <linechart
          v-if="item.type==='line_chart'"
          :params = 'params'
          :ids="item.id"
          :url="urlka"
          :propkey="item.propkey"
          :propparams = "propparams"
          :datas="adprop[item.id]"></linechart>
      </div>
    </div>
    <!-- 流量 -->
    <div class="flow-wrapper">
      <div class="media-item" v-for="(index,item) in flowList" :key="index">
        <piechart
          v-if="item.id !== 'systerm'"
          :params = 'params'
          :url="urlflow"
          :is-solid = 'false'
          :ids = "item.id"
          :propkey = "item.propkey"
          :propparams = "propparams"
          :datas = "flowprop[item.id]"></piechart>
          <piechart
            v-else
            :propkey = "item.propkey"
            :params = 'params'
            :url="urlflow"
            :is-solid = 'false'
            :ids = "item.id"
            :propparams = "propparams"
            :datas = "flowprop[item.id]"></piechart>
      </div>
    </div>
  </div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils.js';
import totalparams from './mixins/params.js';
import linechart from 'containers/linechart/index';
import barchart from 'containers/barchart/index';
import piechart from 'containers/piechart/index';
import wordchart from 'containers/wordchart/index';
import MessageBox from 'components/basic/MessageBox';
const selectOpt = [
  {
    id: '1',
    label: '大盘',
    val: 'panel'
  }
  // {
  //   id: '2',
  //   label: '单个媒体',
  //   val: 'appId'
  // },
  // {
  //   id: '3',
  //   label: '单个广告位',
  //   val: 'slotId'
  // }
];
// 媒体信息
const mediaList = [
  {
    id: 'mediainfo',
    label: 'KA媒体',
    type: 'bar_chart'
  },
  {
    id: 'agentconsume',
    label: '代理/直客消耗占比',
    type: 'pie_chart'
  }, {
    id: 'mediaconsume',
    label: '媒体行业消耗',
    type: 'line_chart'
  }
];
// top广告
const topadList = [
  {
    id: 'topad',
    label: 'KA广告主',
    type: 'bar_chart',
    propkey: 'consume_total'
  },
  {
    id: 'adconsume',
    label: 'KA广告行业',
    type: 'line_chart',
    propkey: 'consume_total'
  }
];
// 流量
const flowList = [
  {
    id: 'equip',
    label: '设备价值分布-发券',
    type: 'pie_chart',
    propkey: 'launch_pv'
  },
  {
    id: 'district',
    label: '地域流量分布',
    type: 'pie_chart',
    propkey: 'launch_count'
  },
  {
    id: 'phonebrand',
    label: '手机品牌分配-发券',
    type: 'pie_chart',
    propkey: 'launch_pv'
  },
  {
    id: 'systerm',
    label: '操作系统',
    type: 'pie_chart',
    propkey: 'launch_num'
  }
];
import { formatDate } from 'components/utils/dateUtils';
export default {
  components: { wordchart, linechart, barchart, piechart },
  data() {
    return {
      selectval: '1',
      selectOpt: selectOpt,
      mediaList: mediaList,
      topadList: topadList,
      flowList: flowList,
      size: 'sm',
      params: {
        // date: this._getYesDay(formatDate(new Date())),
        // endDate: this._getYesDay(formatDate(new Date())),
        date: '',
        endDate: '',
        appId: '',
        slotId: ''
      },
      mediaparams: totalparams.mediaparams,
      advertparams: totalparams.advertparams,
      flowparams: totalparams.flowparams,
      coredata: [],
      url: '',
      urlmedia: '',
      urlka: '',
      urlflow: '',
      mediaprop: {
        mediainfo: {
          kanbanType: ''
        },
        agentconsume: {
          kanbanType: ''
        },
        mediaconsume: {
          kanbanType: ''
        }
      },
      adprop: {
        topad: {
          kanbanType: ''
        },
        adconsume: {
          kanbanType: ''
        }
      },
      flowprop: {
        equip: {
          kanbanType: ''
        },
        district: {
          kanbanType: ''
        },
        phonebrand: {
          kanbanType: ''
        },
        syeterm: {
          kanbanType: ''
        }
      },
      appName: '',
      slotName: '',
      coredataTime: {},
      mediaTime: {},
      advertTime: {},
      flowTime: {},
      propparams: {}
    };
  },
  methods: {
    selval(val) {
    },
    reset() {
      this.initdata();
    },
    getchartData(params) {
      this.$http.post('/customizekb/kanban/chart', params).then((res) => {
        res = JSON.parse(res.body);
        if (res.success) {
          this.propData = res.data;
        };
      });
    },
    getmediaData(params) {
      this.$http.post('/customizekb/mediakanban/', {paraList: params}).then((res) => {
        res = JSON.parse(res.body);
        if (res.success) {
          this.$set('mediaprop', res.data);
          this.propparams = {
            id: res.data.agentconsume.chartQuery.chartQuery.id,
            slotid: this.params.slotId,
            appid: this.params.appId,
            starttime: this.params.date,
            endtime: this.params.endDate,
            appName: this.appName,
            slotName: this.slotName
          };
        };
      });
    },
    getadvertData(params) {
      this.$http.post('/customizekb/advertkanban/', {paraList: params}).then((res) => {
        res = JSON.parse(res.body);
        if (res.success) {
          this.$set('adprop', res.data);
          this.propparams = {
            slotid: this.params.slotId,
            appid: this.params.appId,
            starttime: this.params.date,
            endtime: this.params.endDate,
            appName: this.appName,
            slotName: this.slotName
          };
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
          return;
        };
      });
    },
    getflowData(params) {
      this.$http.post('/customizekb/traffickanban/', {paraList: params}).then((res) => {
        res = JSON.parse(res.body);
        if (res.success) {
          this.$set('flowprop', res.data);
          this.propparams = {
            slotid: this.params.slotId,
            appid: this.params.appId,
            starttime: this.params.date,
            endtime: this.params.endDate,
            appName: this.appName,
            slotName: this.slotName
          };
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
          return;
        };
      });
    },
    getCoreData(params) {
      this.$http.post('/customizekb/coreDataValue', params).then((res) => {
        res = JSON.parse(res.body);
        if (!res.success) {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
          return;
        }
        // 判断是媒体还是广告
        if (this.selectval === '2') {
          this.appName = res.data.info.name;
          this.slotName = '';
        } else if (this.selectval === '3') {
          this.slotName = res.data.info.name;
          this.appName = '';
        }
        this.coredataTime = res.data.time;
        let {values, keys} = Object;
        let param = `appid=${this.params.appId}&slotid=${this.params.slotId}&appName=${this.appName}&date=${res.data.time.date}&endDate=${res.data.time.endDate}`;
        // 获取medeiName
        // 跳转
        this.url = window.location.origin + window.location.pathname + '#!/analyze/mediaoffline/?' + param;
        let datas = res.data.data;
        let arrs = [];
         // 数值重新计算重组
        datas.forEach((ele, index) => {
          let key = keys(ele)[0];
          let val = values(ele)[0];
          val.id = key;
          // 百分数
          if (key === 'plpPlc' || key === 'launchSuccessRate' || key === 'doubleplpPlc' || key === 'plpClickRate' || key === 'advertClickRate'
          ) {
            val.data = getPrecent(val.data);
            // 整数
          } else if (key === 'efClickCount' || key === 'launchCount' || key === 'sdkUv') {
            val.data = _fixNum(val.data, 0);
          } else {
            // 小数
            val.data = key === 'adConsume' ? _fixNum(val.data) : _fixNum(val.data, 3);
          }
          // 同比环比
          if (val.comparedSame || val.comparedSame === 0.0) {
            if (val.comparedSame > 0) {
              val.comparedSame = '+' + getPrecent(val.comparedSame);
            };
            if (val.comparedSame < 0) {
              val.comparedSame = getPrecent(val.comparedSame);
            };
            if (val.comparedSame === 0) {
              val.comparedSame = '0';
            };
            if (val.comparedSame === 'infinity') {
              val.comparedSame = '+∞';
            };
          }
          if (val.sequential || val.sequential === 0.0) {
            if (val.sequential > 0) {
              val.sequential = '+' + getPrecent(val.sequential);
            };
            if (val.sequential < 0) {
              val.sequential = getPrecent(val.sequential);
            };
            if (val.sequential === 0) {
              val.sequential = '0';
            };
            if (val.sequential === 'infinity') {
              val.sequential = '+∞';
            };
          }
          arrs.push(val);
        });
        this.coredata = arrs;
        // this.coredata
        // 小窗口
        if (this.size === 'sm') {
          if (!arrs.length % 4 === 0) {
            let arr = new Array(4 - arrs.length % 4);
            this.coredata.push(...arr);
          }
        }
        // 中窗口
        if (this.size === 'mid') {
          if (!arrs.length % 2 === 0) {
            let arr = new Array(2 - arrs.length % 2);
            this.coredata.push(...arr);
          }
        };
      });
    },
    search() {
      // 核心指标
      if (this.selectval === '1') {
        this.params.slotId = '';
        this.params.appId = '';
      };
      // 媒体
      if (this.selectval === '2') {
        this.params.slotId = '';
      };
      // 广告位
      if (this.selectval === '3') {
        this.params.appId = '';
      };
      // this.initdata();
      this.getCoreData(this.params);
      // 媒体
      this.mediaparams.forEach((ele) => {
        ele.search.startDate = this.params.date;
        ele.search.endDate = this.params.endDate;
        ele.search.app_id = this.params.appId;
        ele.search.slot_id = this.params.slotId;
      });
      // top广告
      this.advertparams.forEach((ele) => {
        ele.search.startDate = this.params.date;
        ele.search.endDate = this.params.endDate;
        ele.search.app_id = this.params.appId;
        ele.search.slot_id = this.params.slotId;
      });
      // 流量
      this.flowparams.forEach((ele) => {
        ele.search.startDate = this.params.date;
        ele.search.endDate = this.params.endDate;
        ele.search.app_id = this.params.appId;
        ele.search.slot_id = this.params.slotId;
      });
      setTimeout(() => {
        this.getmediaData(this.mediaparams);
        this.getadvertData(this.advertparams);
        this.getflowData(this.flowparams);
      }, 100);
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(yes);
    },
    initdata() {
       // 媒体
      this.mediaparams.forEach((ele) => {
        ele.search.startDate = this.params.date;
        ele.search.endDate = this.params.endDate;
        ele.search.app_id = this.params.appId;
        ele.search.slot_id = this.params.slotId;
      });
      // top广告
      this.advertparams.forEach((ele) => {
        ele.search.startDate = this.params.date;
        ele.search.endDate = this.params.endDate;
        ele.search.app_id = this.params.appId;
        ele.search.slot_id = this.params.slotId;
      });
      // 流量
      this.flowparams.forEach((ele) => {
        ele.search.startDate = this.params.date;
        ele.search.endDate = this.params.endDate;
        ele.search.app_id = this.params.appId;
        ele.search.slot_id = this.params.slotId;
      });
      // 时间重置
      this.params.date = '';
      this.params.endDate = '';
      // 下拉框重置;
      this.selectval = '1';
      //  appId: '',
      //   slotId: ''
      this.slotId = '';
      this.appId = '';
      this.getCoreData(this.params);
      setTimeout(() => {
        this.getmediaData(this.mediaparams);
        this.getadvertData(this.advertparams);
        this.getflowData(this.flowparams);
      }, 100);
    }
  },
  ready() {
    window.location.href = window.location.href.split('?')[0] + '?dd_orientation=landscape';
    this.initdata();
  }

};
</script>
<style lang="less" scoped>
  .main{
    background-color: #fff;
    padding: 20px;
    margin: 20px;
  }
  .panel-wrapper{
    .reset{
      margin-left:20px;
      cursor:pointer;
      display: inline-block;
      // padding:10px;
      width:22px;
      height:22px;
      text-align: center;
      line-height: 22px;
      background: #ff795c;
      border-radius:50%;
      color:#fff;

    }
    .iconhandle{
      font-size:12px;
    }
    .search-wrapper{
      margin-top:20px;
      .select-group{
        width:145px;
      }
      .select-wrapper{
        margin-top:20px;
        height:60px;
        .input-item{
          float:left;
          margin-right:10px;
          .input-type{
            width:150px;
          }
        }
      }
    }
    .media-wrapper,.advert-wrapper{
      .media-item{
        overflow-x: scroll;
      }
    }
    .flow-wrapper{
      display: flex;
       flex-wrap:wrap;
        justify-content: space-between;
        align-content: flex-start;
      .media-item{
        flex:0 1 45%;
        overflow-x: scroll;

      }
    }
  }
</style>

