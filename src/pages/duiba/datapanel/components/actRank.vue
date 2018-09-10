<template>
  <div class="apprank modal-body">
    <div class="uprank-block-search cf">

      <div class="form-filter-group cf form-filter-group-rank-date">
        <p class="filter-label fl filter-label-rank" >日期：</p>
        <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
      </div>
      <div class="form-filter-group cf">
        <p class="filter-label fl filter-label-rank">时段：</p>
        <d-select :options.sync="selectTimeNodeArr" :value.sync="params.durationTime"></d-select>
      </div>
      <div class="form-filter-group cf form-filter-group-top-quota1">
        <p class="filter-label fl filter-label-s" >来源：</p>
        <d-select :options.sync="sourceTypeArr" :value.sync="params.sourceType" @select="selectOrigin"></d-select>
      </div>
      <div class="form-filter-group cf form-filter-group-top-quota">
        <p class="filter-label fl filter-label-s" >指标：</p>
        <d-select :options.sync="quotaArr" :value.sync="params.quota" @select="selectQuota"></d-select>
      </div>
      <div class="rank-name-warp" v-if="isShowTitle">
        <span class="name">{{title}}：</span>
        <span class="value">{{name}}({{id}})</span>

      </div>
      <div class="top-rank-type top-rank-time">
        <span :class="{'active': params.timeType === 1 ? true : false}" @click="timeChange(1)">仅当前时段</span>
        <span :class="{'active': params.timeType === 2 ? true : false}" @click="timeChange(2)">当日累计</span>
      </div>
      <div class="form-filter-group cf">
        <p class="filter-label fl filter-label-80">对比对象：</p>
        <d-select :options.sync="ruleTypeArr" :value.sync="params.rule"></d-select>
      </div>
      <d-button class="searchfilter fr" size="large" type="warning" @click="search">查询</d-button>
    </div>
    <table class="recommend-list mt10 summary">
      <thead>
        <tr class="tr-header-summary">
          <th>当前时段值：</th>
          <th>对比时段值：</th>
          <th>变化值：</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr-items-summary">
          <td>
            <!-- 百分数 -->
            <template v-if="currentQuota === 205 || currentQuota === 202 || currentQuota === 204|| currentQuota === 207|| currentQuota === 208">
              {{!data.basic.currentValue ? '' : getPrecent(data.basic.currentValue)}}
            </template>
            <template v-else>
              <!-- 小数 -->
              <template v-if="currentQuota === 100 || currentQuota === 200 || currentQuota === 203">
                {{!data.basic.currentValue ? '' : _fixNum(data.basic.currentValue, 2)}}
              </template>
              <template v-else>
                {{!data.basic.currentValue ? '' :  _fixNum(data.basic.currentValue, 0)}}
              </template>
            </template>
          </td>
          <td>
            <!-- 百分数 -->
            <template v-if="currentQuota === 205 || currentQuota === 202 || currentQuota === 204|| currentQuota === 207|| currentQuota === 208">
              {{!data.basic.contrastValue ? '' : getPrecent(data.basic.contrastValue)}}
            </template>
            <template v-else>
              <!-- 小数 -->
              <template v-if="currentQuota === 100 || currentQuota === 200 || currentQuota === 203">
                {{!data.basic.contrastValue ? '' : _fixNum(data.basic.contrastValue, 2)}}
              </template>
              <template v-else>
                {{!data.basic.contrastValue ? '' : _fixNum(data.basic.contrastValue,0)}}
              </template>
            </template>
          </td>
          <td v-if="_fixNum(data.basic.diffValue).indexOf('-') === 0" class="down-green">
            <template v-if="currentQuota === 205 || currentQuota === 202 || currentQuota === 204">
              {{!data.basic.diffValue ? '' : getPrecent(data.basic.diffValue)}}
            </template>
            <template v-else>
              <template v-if="currentQuota === 100 || currentQuota === 200 || currentQuota === 203">
                {{!data.basic.diffValue ? '' : _fixNum(data.basic.diffValue, 2)}}
              </template>
              <template v-else>
                {{!data.basic.diffValue ? '' : _fixNum(data.basic.diffValue,0)}}
              </template>
            </template>
          </td>
          <td v-else class="up-red">
            <template v-if="currentQuota === 205 || currentQuota === 202 || currentQuota === 204|| currentQuota === 207|| currentQuota === 208">
              {{!data.basic.diffValue ? '' : getPrecent(data.basic.diffValue)}}
            </template>
            <template v-else>
              <template v-if="currentQuota === 100 || currentQuota === 200 || currentQuota === 203">
                {{!data.basic.diffValue ? '' : _fixNum(data.basic.diffValue, 2)}}
              </template>
              <template v-else>
                {{!data.basic.diffValue ? '' : _fixNum(data.basic.diffValue,0)}}
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="top-type" v-if="currentQuota<=200">
      <div class="up-type" :class="{'active': upType}" @click="changeType(1)">涨幅TOP</div>
      <div class="down-type" :class="{'active': downType}"  @click="changeType(2)">跌幅TOP</div>
    </div>
    <div class="rule-list uprank-rule-list">
      <table class="recommend-list mt10">
        <thead>
          <tr class="tr-header">
            <template v-for="column in columns">
              <th v-if="column.dataIndex === 'ratio' && !isShowChangeRankType">影响系数
                <d-tooltip content="影响系数越大，对总体数据的波动影响越大" type="disable">
                  <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                </d-tooltip>
              </th>
              <th v-else>{{column.title}}</th>
            </template>
          </tr>
        </thead>
        <tbody v-if="data && data.table && data.table.length !== 0">
          <tr class="tr-items" v-for="(index, item) in rankTopData.currentTable" track-by="$index">
            <template v-for="column in columns">
              <template v-if="column.render">
                <!-- <td>
                   {{column.render(item[column.dataIndex])}}
                </td> -->
                <td v-if = "currentQuota === 205 || currentQuota === 206 || currentQuota === 207 || currentQuota === 208  ">
                  {{(item[column.dataIndex] === 'Infinity' || item[column.dataIndex] === Infinity) ? '∞':
                    getPrecent(item[column.dataIndex])}}
                </td>
                 <template v-else >
                  <td v-if = "currentQuota === 101 || currentQuota === 110 ||currentQuota === 103 || currentQuota === 104 || currentQuota === 105 || currentQuota === 106 || currentQuota === 107 || currentQuota === 108">
                   {{column.render(item[column.dataIndex],0)}}
                  </td>
                  <td v-else>
                   {{column.render(item[column.dataIndex])}}
                  </td>
                </template>
                <!-- <td v-else>
                   {{column.render(item[column.dataIndex])}}
                </td> -->
              </template>
              <template v-else>
                <td v-if="column.dataIndex === 'activityId'">
                  <!-- <a v-if="gotoUrl" v-link="{ path: gotoUrl + getItemUrl('getActId', 'activityId', item)+ '/' + getItemUrl('getAppId', 'appId', item) + '/' + getItemUrl('getSlotId', 'slotId', item) + '/' + item.sourceType}" target="_blank">{{item[column.dataIndex]}}</a>
                  <a v-else v-link="{ path: '/monitor/mediadimension/' + item.appId }" target="_blank">{{item[column.dataIndex]}}</a> -->
                  <a>{{item[column.dataIndex]}}</a>
                </td>
                <td v-else>
                  {{item[column.dataIndex]}}
                </td>
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
import { formatDate } from 'components/utils/dateUtils';
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import ajaxRankMixins from './ajaxRankMixins';

const columns = [
  {
    title: '活动ID',
    dataIndex: 'activityId'
  },
  {
    title: '活动名称',
    dataIndex: 'activityTitle'
  },
  {
    title: '活动类型',
    dataIndex: 'activityCategoryName'
  },
  {
    title: '当前时段值',
    dataIndex: 'currentValue',
    render: (text, fix) => {
      return _fixNum(text, fix);
    }
  },
  {
    title: '对比时段值',
    dataIndex: 'contrastValue',
    render: (text, fix) => {
      return _fixNum(text, fix);
    }
  },
  {
    title: '变化率',
    dataIndex: 'ratio',
    render: (text) => {
      if (text === Infinity || text === 'Infinity') {
        return '∞';
        // return '无穷大';
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
    label: '广告消耗',
    id: 100
  },
  {
    label: '付费券量',
    id: 101
  },
  {
    label: '券请求',
    id: 110
  },
  {
    label: '参与uv',
    id: 103
  },
  {
    label: '访问uv',
    id: 105
  },
  {
    label: '曝光pv',
    id: 106
  },
  {
    label: '曝光uv',
    id: 107
  },
  {
    label: '券有效点击',
    id: 108
  },
  {
    label: '券曝光',
    id: 109
  },
  {
    label: '福袋点击率',
    id: 205
  },
  {
    label: '活动点击率',
    id: 207
  },
  {
    label: '参与度',
    id: 208
  }
];
const selectTimeNodeArr = [
  {
    label: '24:00',
    id: '24:00'
  },
  {
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
const sourceTypeArr = [
  {
    label: '大盘总计',
    id: -1
  }, {
    label: '积分商城',
    id: 10
  }, {
    label: '独立活动',
    id: 1
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
  data() {
    return {
      columns: columns,
      ruleTypeArr: ruleTypeArrTotal,
      isShowChangeRankType: true,
      sourceTypeArr: sourceTypeArr,
      originName: '大盘数据',
      quotaArr: quotaArr,
      quotaName: '广告消耗',
      currentQuota: 15,
      selectTimeNodeArr: [],
      upType: true,
      downType: false,
      params: {
        analyse: 3,
        durationTime: '',
        extraDate: this._getYesDay(formatDate(new Date())),
        quota: 100,
        rule: 1,
        sourceType: this.sourceType,
        timeType: 2,
        type: 1
      }
    };
  },
  ready() {
    this.timeNodeFomat();
    this.getRule('act');
  },

  methods: {
    // 来源筛选;
    selectOrigin(v) {
      this.quotaName = v.label;
      this.getRule('act');
      this.$emit('get-originid', v.id);
    },
    disabledDate(date) {
      var now = new Date();
      return date.getTime() >= now.getTime();
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr);
      return formatDate(yes);
    },
    search() {
      this.getRule('act');
    },
    timeNodeFomat() {
      let hours = new Date().getHours();
      let mins = new Date().getMinutes();
      let node = mins > 30 ? 1 : 0;
      let sumItem = hours * 2 + node;
      let timeArr = [].concat(selectTimeNodeArr);
      this.selectTimeNodeArr = timeArr.splice(48 - sumItem);
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

      this.getRule('act');
    },
    selectQuota(v) {
      this.quotaName = v.label;
      if (this.params.quota >= 200) {
        this.isShowChangeRankType = false;
      } else {
        this.isShowChangeRankType = true;
      }

      this.getRule('act');
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
      this.params.timeType = type;
    },
    _fixNum(num, long) {
      return _fixNum(num, long);
    },
    getPrecent(num) {
      return getPrecent(num);
    }
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
  }
};
</script>
<style lang="less">
.apprank{
    .uprank-rule-list .tr-items td:nth-child(3) {
        text-align: left;
        padding-right: 0px;
    }
    .uprank-rule-list .tr-header th:nth-child(3) {
        text-align: left;
        padding-right: 0px;
    }
}

</style>

