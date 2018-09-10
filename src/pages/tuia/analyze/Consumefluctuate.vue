<template>
  <div class="consume-fluctuate">
    <pagetitle title="消耗波动分析" class="title"></pagetitle>
      <div class="tabs">
      <ul class="tabs-wrapper">
        <li
          :class= "{ activetab:item.index === curIndex }"
          v-for="(index,item) in tabs"
          @click = "changeTab(item.index)"
          :key="index">{{item.label}}</li>
      </ul>
    </div>
    <div class="cf search-warp">
      <p class="consume-title">分析条件</p>
      <div class="form-filter-group cf nf" v-if="params.dimension === 2 || params.dimension === 3">
        <p class="filter-label fl sort" >{{params.dimension === 2 ? '媒体ID': '广告位ID'}}：</p>
         <auto-input :input-class="'form-control inline'" v-if="params.dimension === 2" placeholder="请输入媒体ID" :result-list="appIdList" :value.sync="params.appId"  @on-click="mediaClick" @on-change="appIdChange"></auto-input>
         <auto-input :input-class="'form-control inline'"  v-if="params.dimension === 3" placeholder="请输入广告位ID" :result-list="slotIdList" :value.sync="params.slotId"  @on-click="slotClick" @on-change="slotIdChange"></auto-input>
      </div>
      <div class="form-filter-group cf nf">
        <p class="filter-label fl sort">分析范围：</p>
        <div class="radio-warp">
          <span><input type="radio" name="type" v-model="params.type" value="1">实时</span>
          <span><input type="radio" name="type" v-model="params.type" value="2">离线</span>
        </div>
      </div>
      <div class="form-filter-group cf nf">
        <p class="filter-label fl sort">分析时段：</p>
        <template v-if="params.type == 1">
          <datepicker :value.sync="params.date" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>&nbsp;
          <d-select :options.sync="selectTimeNodeArr" :value.sync="params.durTime"></d-select>&nbsp;
          <div class="tap-list">
            <div class="tap-item" :class="{'active': params.filterTime === 1}" @click="changeType(1)">仅当前时段</div>
            <div class="tap-item" :class="{'active': params.filterTime === 2}" @click="changeType(2)">当日累计</div>
          </div>
        </template>
        <template v-else>
          <div class="time-picker" @click="timeRangChange">
           <daterangepicker :error-show.sync="errorShow" :disabled-date="disabledDate" :start.sync="params.startDate" :end.sync="params.endDate" :range="30"></daterangepicker>
          </div>
          <div class="time-tap-warp">
            <ul>
              <template v-for="item in taps.slice(0,2)" track-by="$index">
                <li @click="changeTime(item.action, 0)" :class="{active: item.action===curSelect}">{{item.title}}</li>
              </template>
            </ul>
          </div>
        </template>
      </div>
      <div class="form-filter-group cf">
        <p class="filter-label fl sort">对比时段：</p>
        <template v-if="params.type == 1">
          <template v-if="params.filterTime === 1">
            <d-select :options.sync="ruleArr" :value.sync="params.rule"></d-select>
          </template>
          <template v-if="params.filterTime === 2">
            <d-select :options.sync="ruleArr_" :value.sync="params.rule"></d-select>
          </template>
        </template>
        <template v-else>
          <div class="time-picker" @click="timeRangChange">
            <daterangepicker :error-show.sync="errorShow" :disabled-date="disabledDate" :start.sync="params.compStartDate" :end.sync="params.compEndDate"></daterangepicker>
          </div>
           <div class="time-tap-warp">
            <ul>
              <template v-for="item in taps" track-by="$index">
                <li @click="changeTime(item.action,1)" :class="{active: item.action===curComSelect}">{{$index === 0 ? '上一日' : item.title}}</li>
              </template>
            </ul>
          </div>
        </template>
      </div>
    </div>
    <div class="search-btn ">
      <d-button class="searchfilter" size="large" type="warning" @click="getBasic">开始分析</d-button>
    </div>
    <div class="show-total" v-if="basic.value">
      <table class="recommend-list mt10 summary">
        <thead>
          <tr class="tr-header-summary">
            <th>分析时段消耗</th>
            <th>对比时段消耗</th>
            <th>变化值</th>
            <th>变化率</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tr-items-summary">
            <td>
              {{fixNum(basic.value, 2)}}
            </td>
            <td>
               {{fixNum(basic.compValue, 2)}}
            </td>
            <td :class="basic.diff > 0 ? 'up-red': 'down-green'">
              {{fixNum(basic.diff, 2)}}
            </td>
            <td :class="basic.diffPercent > 0 ? 'up-red': 'down-green'">
              {{getPrecent(basic.diffPercent)}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="basic.value && params.dimension === 1 && isShowAnalyze">
       <media-top-app :basic="basic" @parent-method="mediaTabChange"></media-top-app>
    </div>
    <div class="consume-analyze" v-if="isShowAnalyze">
      <p class="consume-title">初步分析结论
         <d-tooltip content="大盘消耗波动分析方式：先找到造成消耗波动的主要影响指标，然后再找到指标变化的原因，最终定位出主要影响因素" type="disable" placement="right" maxwidth="none">
            <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe648;</a>
          </d-tooltip>
      </p>
      <advance-part :obj="advance" :url="url" :dimension.sync="params.dimension"></advance-part>
    </div>
    <div class="reason-analyze" v-if="isShowAnalyze">
      <p class="consume-title">指标变化原因分析
        <span class="title-tip">(请勾选想要分析的指标)
          <input type="checkbox" :name="name" autocomplete="off" :checked="checked" @click="selectAll()"/> 全选/全不选
        </span>
      </p>
      <div>
        <d-checkbox-group :value.sync="params.quotaList">
          <div v-if="params.dimension === 4">
          <template v-for="(index,item) in quotaArr" track-by="$index" >
            <div class="quota-item">
              <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
            </div>
          </template>
          </div>
          <div v-else>
           <template  v-for="(index,item) in mediaArr" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
            </div>
          </template>
          </div>


        </d-checkbox-group>
        <div class="search-btn">
          <d-button class="searchfilter" size="large" type="warning" @click="getDetail">开始分析</d-button>
          <span :class="{'c-red':true, 'fz14': true, 'ml15': true, 'cctitle': !tipShow}">(请勾选想要分析的指标)</span>
        </div>
        <loading :show="loadingRouteData"></loading>
        <advance-part-media-detail :obj.sync="detail"  :url="url" :dimension.sync="params.dimension" v-if ="showQuote && params.dimension !== 4"  :quota-list="params.quotaList" :params="params"></advance-part-media-detail>
        <advance-part-detail :obj="detail"  :url="url" :dimension.sync="params.dimension" v-if ="showQuote && params.dimension === 4"   :quota-list="params.quotaList" :params="params"></advance-part-detail>
      </div>
    </div>
  </div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import advancePart from './components/advancePart';
import advancePartDetail from './components/advancePartDetail';
import advancePartMediaDetail from './components/advancePartMediaDetail';
import checkBoxMixins from './mixins/checkBoxMixins';
import { formatDate, minusDate } from 'components/utils/dateUtils';
import MessageBox from 'components/basic/MessageBox';
import dateUtil from 'components/utils/getCurDate';
import autoInput from '../monitor/components/autoInput';
import {getItem, setItem} from 'components/utils/localStorage';
import mediaTopApp from './components/mediaTopApp';

const taps = [
  {
    title: '昨日',
    action: 1
  },
  {
    title: '过去七日均值',
    action: 7
  },
  {
    title: '上周同日',
    action: 15
  }
];
const tabs = [
  {
    label: '推啊媒体大盘（外采）',
    index: 1
  },
  {
    label: '广告大盘（兑吧+推啊）',
    index: 4
  },
  {
    label: '单媒体',
    index: 2
  },
  {
    label: '单广告位',
    index: 3
  }];
const ruleArr = [
  {
    label: '与昨日同时段',
    id: 1
  },
  {
    label: '上一时段',
    id: 2
  },
  {
    label: '过去七日同时段均值',
    id: 3
  },
  {
    label: '上周同日时段',
    id: 4
  }
];
const ruleArr_ = [
  {
    label: '与昨日同时段',
    id: 1
  },
  {
    label: '过去七日同时段均值',
    id: 3
  },
  {
    label: '上周同日时段',
    id: 4
  }
];
const durTimeArr = [
  {
    label: '24:00',
    id: '24:00'
  }, {
    label: '23:30',
    id: '23:30'
  }, {
    label: '23:00',
    id: '23:00'
  }, {
    label: '22:30',
    id: '22:30'
  }, {
    label: '22:00',
    id: '22:00'
  }, {
    label: '21:30',
    id: '21:30'
  }, {
    label: '21:00',
    id: '21:00'
  }, {
    label: '20:30',
    id: '20:30'
  }, {
    label: '20:00',
    id: '20:00'
  }, {
    label: '19:30',
    id: '19:30'
  }, {
    label: '19:00',
    id: '19:00'
  }, {
    label: '18:30',
    id: '18:30'
  }, {
    label: '18:00',
    id: '18:00'
  }, {
    label: '17:30',
    id: '17:30'
  }, {
    label: '17:00',
    id: '17:00'
  }, {
    label: '16:30',
    id: '16:30'
  }, {
    label: '16:00',
    id: '16:00'
  }, {
    label: '15:30',
    id: '15:30'
  }, {
    label: '15:00',
    id: '15:00'
  }, {
    label: '14:30',
    id: '14:30'
  }, {
    label: '14:00',
    id: '14:00'
  }, {
    label: '13:30',
    id: '13:30'
  }, {
    label: '13:00',
    id: '13:00'
  }, {
    label: '12:30',
    id: '12:30'
  }, {
    label: '12:00',
    id: '12:00'
  }, {
    label: '11:30',
    id: '11:30'
  }, {
    label: '11:00',
    id: '11:00'
  }, {
    label: '10:30',
    id: '10:30'
  }, {
    label: '10:00',
    id: '10:00'
  }, {
    label: '9:30',
    id: '09:30'
  }, {
    label: '9:00',
    id: '09:00'
  }, {
    label: '8:30',
    id: '08:30'
  }, {
    label: '8:00',
    id: '08:00'
  }, {
    label: '7:30',
    id: '07:30'
  }, {
    label: '7:00',
    id: '07:00'
  }, {
    label: '6:30',
    id: '06:30'
  }, {
    label: '6:00',
    id: '06:00'
  }, {
    label: '5:30',
    id: '05:30'
  }, {
    label: '5:00',
    id: '05:00'
  }, {
    label: '4:30',
    id: '04:30'
  }, {
    label: '4:00',
    id: '04:00'
  }, {
    label: '3:30',
    id: '03:30'
  }, {
    label: '3:00',
    id: '03:00'
  }, {
    label: '2:30',
    id: '02:30'
  }, {
    label: '2:00',
    id: '02:00'
  }, {
    label: '1:30',
    id: '01:30'
  }, {
    label: '1:00',
    id: '01:00'
  }, {
    label: '0:30',
    id: '00:30'
  }
];
export default {
  components: {
    advancePart,
    autoInput,
    advancePartDetail,
    advancePartMediaDetail,
    mediaTopApp
  },
  mixins: [ checkBoxMixins ],
  ready() {
    this.timeNodeFomat();
    if (this.$route.params.dimension && this.$route.params.dimension !== 'undefined') {
      this.params.dimension = Number(this.$route.params.dimension);
      this.curIndex = Number(this.$route.params.dimension);
      if (Number(this.$route.params.dimension) === 1) {
        this.params.rule = Number(this.$route.params.rule);
        if (this.$route.params.rule) {
          this.getBasic();
        }
      }
      if (Number(this.$route.params.dimension) === 2) {
        this.params.appId = Number(this.$route.params.id);
      }
      if (Number(this.$route.params.dimension) === 3) {
        this.params.slotId = Number(this.$route.params.id);
      }
    }
    setItem('media', null);
    setItem('slot', null);
    setItem('singleMedia', null);
    setItem('singleSlot', null);
    setItem('appId', null);
    setItem('slotId', null);
    setItem('mediaTable', null);
    setItem('slotTable', null);
    setItem('singleMediaTable', null);
    setItem('singleSlotTable', null);
  },
  data() {
    return {
      durTimeArr: durTimeArr,
      tabs: tabs,
      tipShow: false,
      ruleArr: ruleArr,
      ruleArr_: ruleArr_,
      selectName: '全选',
      checked: false,
      loadingRouteData: false,
      selectTimeNodeArr: [],
      appIdList: [],
      slotIdList: [],
      curIndex: 1,
      isshow: true,
      taps: taps,
      curSelect: 0,
      curComSelect: 0,
      buttonTime: true,
      params: {
        'dimension': 1,
        'appId': '',
        'slotId': '',
        'startDate': '',
        'endDate': '',
        'compEndDate': '',
        'compStartDate': '',
        'date': this._getYesDay(formatDate(new Date())),
        'durTime': '',
        'filterTime': 1,
        'rule': 1,
        'type': 1,
        'order': 'DESC',
        'quotaList': []
      },
      basic: {
        value: ''
      },
      isShowAnalyze: false,
      advance: {},
      detail: {},
      showQuote: false,
      url: {
        isOnline: true,
        startDate: '',
        endDate: ''
      }
    };
  },
  watch: {
    'params.type': function() {
      this.getUrl();
    },
    'params.startDate': function() {
      this.url.startDate = this.params.startDate;
      if (this.params.endDate === '') {
        this.params.endDate = this.params.startDate;
      }
      if (!this.buttonTime) {
        this.curSelect = '?';
      }
    },
    'params.compStartDate': function() {
      if (this.params.compEndDate === '') {
        this.params.compEndDate = this.params.compStartDate;
      }
      if (!this.buttonTime) {
        this.curComSelect = '?';
      }
    },
    'params.endDate': function() {
      this.url.endDate = this.params.endDate;
    },
    'params.date': function(newValue, oldValue) {
      let today = this._getYesDay(formatDate(new Date()));
      if (today !== this.params.date && oldValue === today) {
        this.selectTimeNodeArr = durTimeArr;
        this.params.durTime = '24:00';
      }
      if (newValue === today) {
        this.timeNodeFomat();
      }
    }
  },
  methods: {
    fixNum: _fixNum,
    getPrecent: getPrecent,
    getOrderDate(offset) {
      var myDate = new Date();
      myDate.setDate(myDate.getDate() - offset);
      return dateUtil({
        date: myDate
      });
    },
    mediaTabChange(id) {
      this.changeTab(2);
      this.params.appId = id;
      this.getBasic();
    },
    changeTab(index) {
      this.curIndex = index;
      this.params.dimension = index;
      this.checked = false;
      this.showQuote = false;
      this.basic.value = null;
      this.isShowAnalyze = false;
      // 切换tab时显示缓存数据
      if (getItem('media') && this.params.dimension === 1) {
        this.advance = getItem('media');
        this.basic = getItem('media').basic;
        this.isShowAnalyze = true;
        this.detail = getItem('mediaTable');
        if (getItem('mediaTable')) {
          this.params.quotaList = getItem('mediaTable').quotaList;
          this.checked = this.params.quotaList.length === 5;
        }
        this.showQuote = !!getItem('mediaTable');
      }
      if (getItem('slot') && this.params.dimension === 4) {
        this.advance = getItem('slot');
        this.basic = getItem('slot').basic;
        this.isShowAnalyze = true;
        this.detail = getItem('slotTable');
        if (getItem('slotTable')) {
          this.params.quotaList = getItem('slotTable').quotaList;
          this.checked = this.params.quotaList.length === 4;
        }
        this.showQuote = !!getItem('slotTable');
      }
      if (getItem('singleMedia') && this.params.dimension === 2) {
        this.params.appId = getItem('appId');
        this.advance = getItem('singleMedia');
        this.basic = getItem('singleMedia').basic;
        this.isShowAnalyze = true;
        this.detail = getItem('singleMediaTable');
        if (getItem('singleMediaTable')) {
          this.params.quotaList = getItem('singleMediaTable').quotaList;
          this.checked = this.params.quotaList.length === 5;
        }
        this.showQuote = !!getItem('singleMediaTable');
      }
      if (getItem('singleSlot') && this.params.dimension === 3) {
        this.params.slotId = getItem('slotId');
        this.advance = getItem('singleSlot');
        this.basic = getItem('singleSlot').basic;
        this.isShowAnalyze = true;
        this.detail = getItem('singleSlotTable');
        if (getItem('singleSlotTable')) {
          this.params.quotaList = getItem('singleSlotTable').quotaList;
          this.checked = this.params.quotaList.length === 5;
        }
        this.showQuote = !!getItem('singleSlotTable');
      }
      this.appIdList = [];
      this.slotIdList = [];
    },
    mediaClick(value) {
      this.params.appId = value.key;
      this.params.appName = value.value;
    },
    slotClick(value) {
      this.params.slotId = value.key;
      this.params.slotName = value.value;
    },
    appIdChange() {
      if (!this.params.appId) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/app', { appId: this.params.appId
      }).then((res) => {
        res = res.json();
        this.appIdList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.appIdList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    },
    slotIdChange() {
      if (!this.params.slotId) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/slot', { slotId: this.params.slotId
      }).then((res) => {
        res = res.json();
        this.slotIdList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.slotIdList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    },
    disabledDate(date) {
      var now = new Date();
      return date.getTime() >= now.getTime();
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr);
      return formatDate(yes);
    },
    // 勾造url
    getUrl() {
      let isOnline = Number(this.params.type) === 1;
      this.url.isOnline = isOnline;
    },
    changeType(filterTime) {
      this.params.rule = 1;
      this.params.filterTime = filterTime;
    },
    getBasic() {
      if (this.params.dimension === 2 && this.params.appId === '') {
        MessageBox({
          title: '请输入媒体ID',
          type: 'error'
        });
        return false;
      }
      if (this.params.dimension === 3 && this.params.slotId === '') {
        MessageBox({
          title: '请输入广告位ID',
          type: 'error'
        });
        return false;
      }
      if (Number(this.params.type) === 1 && this.params.date === '') {
        MessageBox({
          title: '请输入时间',
          type: 'error'
        });
        return false;
      }
      if (Number(this.params.type) === 2 && (this.params.startDate === '' || this.params.endDate === '' || this.params.compStartDate === '' || this.params.compEndDate === '')) {
        MessageBox({
          title: '请输入时间',
          type: 'error'
        });
        return false;
      }
      this.clearParams();
      this.isShowAnalyze = false;
      this.showQuote = false;
      this.params.quotaList = [];
      this.checked = false;
      this.selectName = '全选';
      this.$http.post('/ads/advance', this.params).then(res => {
        res = res.json();
        if (res.success) {
          this.basic = res.data.basic;
          this.advance = res.data;
          this.isShowAnalyze = true;
          // 把数据存入localStorage
          this.saveData(res.data);
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, () => {
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    clearParams() {
      if (this.params.dimension === 1) {
        this.params.appId = '';
        this.params.slotId = '';
        this.params.appName = '';
        this.params.slotName = '';
      }
      if (this.params.dimension === 2) {
        this.params.slotId = '';
        this.params.slotName = '';
      }
      if (this.params.dimension === 3) {
        this.params.appId = '';
        this.params.appName = '';
      }
      if (this.params.dimension === 4) {
        this.params.slotId = '';
        this.params.appId = '';
        this.params.slotName = '';
        this.params.appName = '';
      }
    },
    saveData(data) {
      if (this.params.dimension === 1) {
        setItem('media', data);
      } else if (this.params.dimension === 4) {
        setItem('slot', data);
      } else if (this.params.dimension === 2) {
        setItem('singleMedia', data);
        setItem('appId', data.info.id);
      } else if (this.params.dimension === 3) {
        setItem('singleSlot', data);
        setItem('slotId', data.info.id);
      }
    },
    saveTableData(data) {
      if (this.params.dimension === 1) {
        setItem('mediaTable', data);
      } else if (this.params.dimension === 4) {
        setItem('slotTable', data);
      } else if (this.params.dimension === 2) {
        setItem('singleMediaTable', data);
      } else if (this.params.dimension === 3) {
        setItem('singleSlotTable', data);
      }
    },
    selectAll() {
      this.checked = !this.checked;
      if (this.params.dimension === 4) {
        this.params.quotaList = this.checked ? ['advertRequestCount', 'lcParc', 'plpPlc', 'acPplp'] : [];
        this.selectName = this.checked ? '取消' : '全选';
      } else {
        this.params.quotaList = this.checked ? ['sdkUv', 'arcPsu', 'lcParc', 'plpPlc', 'acPplp'] : [];
        this.selectName = this.checked ? '取消' : '全选';
      }
    },
    getDetail() {
      this.loadingRouteData = true;
      this.showQuote = false;
      if (!this.params.quotaList.length) {
        this.loadingRouteData = false;
        this.tipShow = true;
        setTimeout(() => {
          this.tipShow = false;
        }, 3000);
        return false;
      };
      this.clearParams();
      this.$http.post('/ads/detail', this.params).then(res => {
        res = res.json();
        if (res.success) {
          this.detail = res.data;
          this.saveTableData(res.data);
          this.showQuote = true;
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
        this.loadingRouteData = false;
      }, () => {
        this.loadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    changeTime(offset, type) {
      const typeObj = [
        {'sDate': 'startDate', 'eDate': 'endDate', 'cur': 'curSelect'},
        {'sDate': 'compStartDate', 'eDate': 'compEndDate', 'cur': 'curComSelect'}
      ];
      if (offset === 15) {
        if (this.params.startDate && this.params.endDate) {
          this.params.compStartDate = minusDate(this.params.startDate, 7);
          this.params.compEndDate = minusDate(this.params.endDate, 7);
        } else {
          this.params[typeObj[type].sDate] = this.getOrderDate(7);
          this.params[typeObj[type].eDate] = this.getOrderDate(7);
        }
      } else {
        if (type === 1 && this.params.startDate && this.params.endDate && offset === 1) {
          this.params.compStartDate = minusDate(this.params.startDate, 1);
          this.params.compEndDate = minusDate(this.params.endDate, 1);
        } else if (type === 1 && this.params.startDate && this.params.endDate && offset === 7) {
          this.params.compStartDate = minusDate(this.params.endDate, 7);
          this.params.compEndDate = minusDate(this.params.endDate, 1);
        } else {
          this.params[typeObj[type].sDate] = this.getOrderDate(offset);
          this.params[typeObj[type].eDate] = this.getOrderDate(1);
        }
      }
      this[typeObj[type].cur] = offset;
      this.buttonTime = true;
    },
    timeRangChange() {
      this.buttonTime = false;
    },
    timeNodeFomat() {
      let hours = new Date().getHours();
      let mins = new Date().getMinutes();
      let node = mins > 30 ? 1 : 0;
      let sumItem = hours * 2 + node;
      let timeArr = [].concat(durTimeArr);
      this.selectTimeNodeArr = timeArr.splice(48 - sumItem);
      if (mins > 30) {
        if (mins - 30 > 10) {
          this.params.durTime = this.selectTimeNodeArr[0].id;
        } else {
          this.params.durTime = this.selectTimeNodeArr[1].id;
        }
      } else {
        if (mins > 10) {
          this.params.durTime = this.selectTimeNodeArr[0].id;
        } else {
          this.params.durTime = this.selectTimeNodeArr[1].id;
        }
      }
    }
  }
};
</script>
<style lang="less">
.consume-fluctuate {
  .down-green {
    color: #2ac993;
  }
  .up-red {
    color: #ff5b5b;
  }
  .cctitle {
    visibility: hidden;
  }
  .nf {
    float: none;
  }
  .page-title {
    border-bottom: none;
  }
  .tabs .tabs-wrapper{
  display: inline-block;
  li{
    height:34px;
    line-height: 34px;
    float:left;
    padding:0 20px;
    border-bottom: 1px solid rgb(169,169,169);
    border-right:none;
    cursor:pointer;
    &.activetab{
      color: #119271;
      font-weight: bold;
      border-bottom: 2px solid #119271;
    }
  }
}
  .form-filter-group {
    margin-bottom: 18px;
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
      &.sort {
        width: 72px;
      }
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
      &.inline {
        display: inline-block;
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
  .consume-title {
    color: #ff795c;
    font-weight: bold;
    padding-left: 10px;
    border-left: 2px solid #ff795c;
    margin: 20px 0px;
    .title-tip {
      font-size: 13px;
      color: #666;
      margin-left: 5px;
      font-weight: normal;
    }
    .searchfilter {
       font-size: 12px;
       width: 40px;
       margin-left: 6px;
       padding: 0px;
       height: 22px;
    }
  }
  .icon-positon {
    color:#29b6b0;
  }
  .reason-analyze {
    .consume-title {
      margin-top: 50px;
    }
    .quota-item {
      display: inline-block;
      width: 180px;
      .icon {
        font-size: 14px !important;
      }
    }
    .search-btn {
      margin-top: 20px;
    }
    .checkbox-group {
      display: inline-block;
      padding-left: 10px;
      width: 100%;
      text-align: center;
      .d-checkbox-control {
        padding-left: 18px;
        margin-right: 20px;
        .icon {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
    .time-tap-warp {
      display: inline-block;
    ul {
      display: inline-block;
      margin-left: 15px;
      border-right: 1px solid #e3e3e3;
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
    }
  }
  .time-picker {
    display: inline-block;
  }
  .tap-list {
    font-size: 0px;
    display: inline-block;
    .tap-item {
      font-size: 16px;
      display: inline-block;
      border: 1px solid #999;
      border-left: none;
      padding: 8px 16px;
      cursor: pointer;
      &:nth-child(1) {
        border-left: 1px solid #999;
      }
      &.active {
        background-color: #ff795c;
        color: #fff;
      }
    }
  }
  .radio-warp {
    padding-top: 6px;
    input {
      width: 14px;
      height: 14px;
    }
  }
  .search-btn  {
    text-align: center;
    margin-top: 15px;
    margin-bottom: 40px;
  }
  .summary {
    height: 77px;
    width: 100%;
    margin-bottom: 10px;
    th, td{
      text-align: left;
      padding-bottom: 10px;
    }
    .tr-header-summary {
      font-size:14px;
      color:#444444;
    }
    .tr-items-summary {
      color:#444444;
      font-size: 24px;
    }
    .down-green {
      color: #2ac993;
    }
    .up-red {
      color: #ff5b5b;
    }
  }
}
</style>

