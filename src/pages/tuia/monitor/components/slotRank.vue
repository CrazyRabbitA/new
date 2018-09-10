<template>
  <div class="modal-body">
    <div class="uprank-block-search cf">
      <div class="form-filter-group cf form-filter-group-rank-date">
        <p class="filter-label fl filter-label-rank" >日期：</p>
        <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
      </div>
      <div class="form-filter-group cf">
        <p class="filter-label fl filter-label-rank">时段：</p>
        <d-select :options.sync="selectTimeNodeArr" :value.sync="params.durationTime"></d-select>
      </div>
      <div class="form-filter-group cf form-filter-group-top-quota">
        <p class="filter-label fl filter-label-s">指标：</p>
        <d-select :options.sync="quotaArr" :value.sync="params.quota" @select="selectQuota"></d-select>
      </div>
      <div class="rank-name-warp" v-if="isShowTitle">
        <span class="name">{{title}}：</span>
        <span class="value">{{name}}({{id}})</span>
      </div>
      <div class="top-rank-type top-rank-time">
        <span :class="{'active': params.filterTime === 1 ? true : false}" @click="timeChange(1)">仅当前时段</span>
        <span :class="{'active': params.filterTime === 2 ? true : false}" @click="timeChange(2)">当日累计</span>
      </div>
      <div class="form-filter-group cf">
        <p class="filter-label fl filter-label-80">对比对象：</p>
        <d-select :options.sync="ruleTypeArr" :value.sync="params.rule"></d-select>
      </div>
      <div class="cf">
        <d-button class="searchfilter fr" size="large" type="warning" @click="search">查询</d-button>
      </div>
    </div>
    <table class="recommend-list mt10 summary">
      <thead>
        <tr class="tr-header-summary">
          <th>当前时段值</th>
          <th>对比时段值</th>
          <th>变化值</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr-items-summary">
          <td>
            <template v-if="currentQuota === 23 || currentQuota === 17 || currentQuota === 20 || currentQuota === 21 || currentQuota === 16 || currentQuota === 24">
              {{getPrecent(data.basic.currentValue)}}
            </template>
            <template v-else>
              <template v-if="currentQuota < 15 ">
                {{_fixNum(data.basic.currentValue, 0)}}
              </template>
              <template v-else>
                {{data.basic.currentValue}}
              </template>   
            </template>
          </td>
          <td>
            <template v-if="currentQuota === 23 || currentQuota === 17 || currentQuota === 20 || currentQuota === 21 || currentQuota === 16 || currentQuota === 24">
              {{getPrecent(data.basic.contrastValue)}}
            </template>
            <template v-else>
              <template v-if="currentQuota < 15 ">
                {{_fixNum(data.basic.contrastValue, 0)}}
              </template>
              <template v-else>
                {{data.basic.contrastValue}}
              </template>   
            </template>
          </td>
          <td v-if="_fixNum(data.basic.diffValue).indexOf('-') === 0" class="down-green">
            <template v-if="currentQuota === 23 || currentQuota === 17 || currentQuota === 20 || currentQuota === 21 || currentQuota === 16 || currentQuota === 24">
              {{getPrecent(data.basic.diffValue)}}
            </template>
            <template v-else>
              <template v-if="currentQuota < 15 ">
                {{_fixNum(data.basic.diffValue, 0)}}
              </template>
              <template v-else>
                {{data.basic.diffValue}}
              </template> 
            </template>
          </td>
          <td v-else class="up-red">
            <template v-if="currentQuota === 23 || currentQuota === 17 || currentQuota === 20 || currentQuota === 21 || currentQuota === 16 || currentQuota === 24">
              {{getPrecent(data.basic.diffValue)}}
            </template>
            <template v-else>
              <template v-if="currentQuota < 15 ">
                {{_fixNum(data.basic.diffValue, 0)}}
              </template>
              <template v-else>
                {{data.basic.diffValue}}
              </template> 
            </template>
          </td>
        </tr>
     </tbody>
    </table>
    <div class="top-type" v-if="isShowChangeRankType">
      <div class="up-type" :class="{'active': upType}" @click="changeType(1)">涨幅TOP</div>
      <div class="down-type":class="{'active': downType}"  @click="changeType(2)">跌幅TOP</div>
    </div>
    <div class="rule-list uprank-rule-list">
      <table class="recommend-list mt10">
        <thead>
          <tr class="tr-header">
            <template v-for="column in columns">
              <th v-if="column.dataIndex === 'ratio' && !isShowChangeRankType">影响系数
                <d-tooltip content="影响系数越大，当前维度对大盘波动影响越大" type="disable">
                  <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                </d-tooltip>
              </th>
              <th v-else>{{column.title}}</th>
            </template>
          </tr>
        </thead>
        <tbody v-if="data && data.length !== 0">
          <tr class="tr-items" v-for="(index, item) in rankTopData.currentTable" track-by="$index">
            <template v-for="column in columns">
              <template v-if="column.render">
                <td v-if="(currentQuota === 23 || currentQuota === 17 || currentQuota === 20 || currentQuota === 21 || currentQuota === 16 || currentQuota === 24) && (column.dataIndex === 'currentValue' || column.dataIndex === 'contrastValue'|| column.dataIndex === 'variation')">{{getPrecent(item[column.dataIndex])}}</td>
                <td v-else>
                   <template v-if="currentQuota < 15 && column.dataIndex !== 'ratio'">
                     <template v-if="currentQuota !== 28">
                      {{_fixNum(item[column.dataIndex], 0)}}
                    </template>
                    <template v-else>
                      {{_fixNum(item[column.dataIndex], 2)}}
                    </template>
                  </template>
                  <template v-else>
                    {{column.render(item[column.dataIndex])}}
                  </template>
                </td>
              </template>
              <template v-else>
                <td v-if="column.dataIndex === 'slotId'">
                  <a v-if="gotoUrl" v-link="{ path: gotoUrl + getItemUrl('getActId', 'activityId', item)+ '/' + getItemUrl('getAppId', 'appId', item) + '/' + getItemUrl('getSlotId', 'slotId', item) + '/' + item.sourceType}" target="_blank">{{item[column.dataIndex]}}</a>
                  <a v-else v-link="{ path: '/monitor/adslotDimension/' + item.slotId }" target="_blank">{{item[column.dataIndex]}}</a>
                </td>
                <td v-else>{{item[column.dataIndex]}}</td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
      <tableempty v-if="!loadshow && (data && data.table && data.table.length === 0)"></tableempty>
      <d-pagination :total="rankTopData.total" :current-page="rankTopData.pageNum" :page-size="rankTopData.pageSize" @change="onPageChange" ></d-pagination>
    </div>
  </div>
</template>

<script>
// import MessageBox from 'components/basic/MessageBox';
import { formatDate } from 'components/utils/dateUtils';
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import ajaxRankMixins from './ajaxRankMixins';

const columns = [
  {
    title: '广告位ID',
    dataIndex: 'slotId'
  },
  {
    title: '广告位名称',
    dataIndex: 'slotName'
  },
  {
    title: '当前时段值',
    dataIndex: 'currentValue',
    render: (text) => {
      return _fixNum(text);
    }
  },
  {
    title: '对比时段值',
    dataIndex: 'contrastValue',
    render: (text) => {
      return _fixNum(text);
    }
  },
  {
    title: '变化值',
    dataIndex: 'variation',
    render: (text) => {
      return _fixNum(text);
    }
  },
  {
    title: '变化率',
    dataIndex: 'ratio',
    render: (text) => {
      if (text === Infinity || text === 'Infinity') {
        return '∞';
      } else {
        return getPrecent(text);
      }
    }
  }
];
const ruleTypeArr = [
  {
    label: '与昨日同时段比',
    id: 1
  },
  {
    label: '与上一时段比',
    id: 2
  },
  {
    label: '七日平均',
    id: 3
  },
  {
    label: '上周同比同时段',
    id: 4
  }
];
const ruleTypeArrTotal = [
  {
    label: '与昨日同时段比',
    id: 1
  },
  {
    label: '七日平均',
    id: 3
  },
  {
    label: '上周同比同时段',
    id: 4
  }
];
const quotaArr = [
  {
    label: '广告位请求成功pv',
    id: 1,
    point: 'actSucResponseCount'
  },
  {
    label: '广告位曝光pv',
    id: 2,
    point: 'actExposeCount'
  },
  {
    label: '广告位曝光uv',
    id: 26,
    point: 'actExposeUv'
  },
  {
    label: '广告位点击pv',
    id: 3,
    point: 'actClickCount'
  },
  {
    label: '广告位点击uv',
    id: 4,
    point: 'actClickUv'
  },
  {
    label: '广告位点击率',
    id: 16,
    point: 'advertClickRate'
  },
  {
    label: '广告位访问pv',
    id: 5,
    point: 'sdkPv'
  },
  {
    label: '广告位访问uv',
    id: 6,
    point: 'sdkUv'
  },
  {
    label: '广告位CTR（UV）',
    id: 27,
    point: 'ctr'
  },
  {
    label: '活动请求pv',
    id: 7,
    point: 'actRequestCount'
  },
  {
    label: '活动请求uv',
    id: 8,
    point: 'actRequestUv'
  },
  {
    label: '活动参与pv',
    id: 9,
    point: 'participateCount'
  },
  {
    label: '活动参与uv',
    id: 10,
    point: 'participateUv'
  },
  {
    label: '广告位参与率',
    id: 24,
    point: 'actParticipateRate'
  },
  {
    label: '参与率',
    id: 17,
    point: 'participateRate'
  },
  {
    label: '复参数',
    id: 18,
    point: 'dupliParticipateRate'
  },
  {
    label: '每UV发券',
    id: 19,
    point: 'launchPerSdkUv'
  },
  {
    label: '活动广告券请求pv',
    id: 11,
    point: 'advertRequestCount'
  },
  {
    label: '请求成功率',
    id: 20,
    point: 'requestParticipateRate'
  },
  {
    label: '发券成功率',
    id: 21,
    point: 'launchRequestRate'
  },
  {
    label: '活动广告发券量',
    id: 12,
    point: 'launchCount'
  },
  {
    label: '广告券曝光pv',
    id: 13,
    point: 'advertExposureCount'
  },
  {
    label: '广告券点击pv',
    id: 14,
    point: 'advertClickCount'
  },
  {
    label: '每UV券点击',
    id: 22,
    point: 'clickPerSdk'
  },
  {
    label: '广告券点击率',
    id: 23,
    point: 'clickExposureRate'
  },
  {
    label: '每UV收益',
    id: 25,
    point: 'advertFeePerSdkUv'
  },
  {
    label: '点击单价',
    id: 28,
    point: 'clickPrice'
  },
  {
    label: '广告消耗',
    id: 15,
    point: 'advertFee'
  }
];
const selectTimeNodeArr = [
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
  mixins: [ajaxRankMixins],
  props: {
    onChange: {
      type: Function,
      default: () => {}
    },
    quotaType: {
      type: [String, Number]
    },
    selectDay: {
      type: String,
      default: ''
    },
    loadshow: {
      type: Boolean,
      default: false
    },
    slotId: {
      type: String,
      default: ''
    },
    appId: {
      type: String,
      default: ''
    },
    actId: {
      type: String,
      default: ''
    },
    sourceType: {
      type: Number,
      default: 0
    }
  },
  ready() {
    this.quotaArr.forEach((item, index) => {
      if (item.point === this.quotaType) {
        this.params.quota = item.id;
        this.currentQuota = item.id;
        this.quotaName = item.label;
      }
    });
    if (this.params.quota > 15 && this.params.quota !== 26) {
      this.isShowChangeRankType = false;
    } else {
      this.isShowChangeRankType = true;
    }
    if (this.actId || this.appId || this.slotId) {
      this.params.analyse = 2;
    }
    this.timeNodeFomat();
    this.getRule('slot');
  },
  data() {
    return {
      data: {
        basic: {
          diffValue: '',
          contrastValue: '',
          currentValue: ''
        },
        info: {}
      },
      columns: columns,
      ruleTypeArr: ruleTypeArrTotal,
      quotaArr: quotaArr,
      quotaName: '广告消耗',
      currentQuota: 15,
      selectTimeNodeArr: [],
      isShowChangeRankType: true,
      upType: true,
      downType: false,
      params: {
        sourceType: this.sourceType,
        activityId: this.actId,
        slotId: this.slotId,
        appId: this.appId,
        analyse: 0,
        filterTime: 2,
        durationTime: '',
        quota: 15,
        rule: 1,
        type: 1,
        extraDate: this._getYesDay(formatDate(new Date()))
      }
    };
  },
  watch: {
    'params.extraDate': function() {
      if (this.params.extraDate !== this._getYesDay(formatDate(new Date()))) {
        this.selectTimeNodeArr = selectTimeNodeArr;
      } else {
        this.selectTimeNodeArr = [];
        this.timeNodeFomat();
      }
    }
  },
  methods: {
    disabledDate(date) {
      var now = new Date();
      return date.getTime() >= now.getTime();
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr);
      return formatDate(yes);
    },
    search() {
      this.getRule('slot');
    },
    timeNodeFomat() {
      let hours = new Date().getHours();
      let mins = new Date().getMinutes();
      let node = mins > 30 ? 1 : 0;
      let sumItem = hours * 2 + node;
      let timeArr = [].concat(selectTimeNodeArr);
      this.selectTimeNodeArr = timeArr.splice(48 - sumItem);
      // 默认选中最后一个时段
      if (mins > 30) {
        if (mins - 30 > 10) {
          this.params.durationTime = this.selectTimeNodeArr[0].id;
        } else {
          this.params.durationTime = this.selectTimeNodeArr[1].id;
        }
      } else {
        if (mins > 10) {
          this.params.durationTime = this.selectTimeNodeArr[0].id;
        } else {
          this.params.durationTime = this.selectTimeNodeArr[1].id;
        }
      }
    },
    changeType(type) {
      if (type === 1) {
        this.upType = true;
        this.downType = false;
      } else {
        this.upType = false;
        this.downType = true;
      }
      this.params.type = type;
      this.getRule('slot');
    },
    selectQuota(v) {
      this.quotaName = v.label;
      if (this.params.quota > 15 && this.params.quota !== 26) {
        this.isShowChangeRankType = false;
      } else {
        this.isShowChangeRankType = true;
      }
      this.getRule('slot');
    },
    timeChange(type) {
      if (type === 2) {
        this.ruleTypeArr = ruleTypeArrTotal;
        if (this.params.rule === 2) {
          this.params.rule = 1;
        }
      } else {
        this.ruleTypeArr = ruleTypeArr;
      }
      this.params.filterTime = type;
    },
    _fixNum(num) {
      return _fixNum(num);
    },
    getPrecent(num) {
      return getPrecent(num);
    }
  }
};
</script>
