<template>
  <div class="analyze-funnel">
    <div class="chart-warp">
      <div class="title-warp cf">
        <h2>{{title}}</h2>
        <div class="tap-list">
          <div class="tap-item" :class="{'active': type === 'funnel'}" @click="changeType('funnel')">漏斗图</div>
          <div class="tap-item" :class="{'active': type !== 'funnel'}" @click="changeType('trend')">趋势图</div>
        </div>
      </div>
      <tap-change :tap-list="tapArr" :datatol.sync="datatol" :fn="getChartList"></tap-change>
      <div class="date-warp">
        <h2>日期：</h2>
        <daterangepicker :start.sync="params.startDate" :end.sync="params.endDate" :disabled-date="disabledDate" :range="30"></daterangepicker>
      </div>
      <div :id="chartId" style="height:440px;width:100%;margin-top:20px;"></div>
  </div>
</template>
<script>
import tapChange from './tapModal/tapChange.vue';
import { formatDate } from 'components/utils/dateUtils';
import funnelChartMixins from '../mixins/funnelChartMixins';
import chartMixins from '../mixins/chartMixins';
const tapArr = [
  { name: '大盘', isActive: true, type: 0 },
  { name: '版本', isActive: false, type: 1 },
  { name: '渠道', isActive: false, type: 2 },
  { name: '版本+渠道', isActive: false, type: 3 }
];
export default {
  mixins: [funnelChartMixins, chartMixins],
  components: {
    tapChange
  },
  props: {
    chartId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    isNew: {
      type: Boolean,
      default: ''
    },
    datatol: {
      type: Object,
      default: () => {}
    },
    fn: {
      type: Function,
      default: null
    }
  },
  ready() {
    this.getChartList();
  },
  data() {
    return {
      tapArr: tapArr,
      type: 'funnel',
      params: {
        userType: 1,
        startDate: this.getYesDay(new Date(), 8),
        endDate: this.getYesDay(new Date(), 1)
      },
      data: {}
    };
  },
  watch: {
    isNew: function() {
      // 如果是新用户
      if (this.isNew) {
        this.params.userType = 1;
      } else {
        this.params.userType = 2;
      }
      this.getChartList();
    },
    'params.startDate': function() {
      this.getChartList();
    },
    'params.endDate': function() {
      this.getChartList();
    }
  },
  methods: {
    getYesDay(dateStr, day) {
      let yes = new Date(dateStr) - 1000 * 60 * 60 * 24 * day;
      return formatDate(yes);
    },
    changeType(type) {
      this.type = type;
      this.getchartDate(this.data, type);
    },
    // 请求图表数据
    getChartList() {
      let appSources = [];
      let appVersions = [];
      this.datatol.appSources.forEach(item => {
        if (item.isActive) {
          appSources.push(item.name);
        }
      });
      this.datatol.appVersions.forEach(item => {
        if (item.isActive) {
          appVersions.push(item.name);
        }
      });
      let params = {
        appSources: appSources,
        appVersions: appVersions,
        startDate: this.params.startDate,
        endDate: this.params.endDate,
        userType: this.params.userType
      };
      this.$http.post('/quwen/analysis/funnelplotdata', params).then(res => {
        res = res.json();
        this.data = res.data;
        this.getchartDate(this.data, this.type);
      });
      if (this.fn) {
        this.fn();
      }
    },
    /**
     * 时间禁选今天以后的时间
     */
    disabledDate: function(date) {
      var now = new Date();
      return date.getTime() > (now.getTime() - 60 * 60 * 24 * 1000);
    },
    getchartDate(data, chartType) {
      this.getDate(data, chartType);
    }
  }
};
</script>
<style lang="less">
.analyze-funnel {
  .chart-warp {
    .title-warp {
      text-align: left;
      h2 {
        display: inline-block;
      }
      .tap-list {
        font-size: 0px;
        float: right;
        .tap-item {
          font-size: 16px;
          display: inline-block;
          border: 1px solid #999;
          border-left: none;
          padding: 4px 16px;
          cursor: pointer;
          &:nth-child(1) {
            border-left: 1px solid #999;
          }
          &.active {
            background-color: #ffc715;
            color: #fff;
          }
        }
      }
    }
    .date-warp {
      margin-top: 20px;
      text-align: left;
      h2 {
        display: inline-block;
      }
      .datepicker-input {
        width: 140px !important;
      }
    }
  }
}
</style>
