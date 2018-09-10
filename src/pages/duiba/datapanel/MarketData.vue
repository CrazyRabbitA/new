<template>
   <div class="marketdata-main">
     <div class="marketdata-chart-area">
       <div class="search-area cf">
         <daterangepicker :error-show.sync="errorShow" :start.sync="chartParams.startDate" :end.sync="chartParams.endDate" :disabled-date="disabledDate" :range="30"></daterangepicker>
         <div class="serch-btn">
           <d-button class="searchfilter" size="large" type="primary" @click="getLineDataList">查询</d-button>
         </div>
       </div>
       <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange"></d-select>
       <h2 class="chart-title">{{selectQuotaName}}平均值:{{avgDataValue}}</h2>
       <div id="marketDataLine" style="height:400px;width:100%;margin-top:20px;"></div>
     </div>
      <div class="search-area cf">
        <datepicker :value.sync="tableParams.date" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
        <div class="serch-btn">
          <d-button class="searchfilter" size="large" type="primary" @click="getTableDataList">查询</d-button>
        </div>
      </div>

     <div class="table-area">
        <h1 class="table-title">{{tableStartDay}}至{{tableEndDay}}大盘数据</h1>
        <table>
          <thead>
            <tr class="tr-header">
              <template v-for="colum in columns">
                <th>{{colum.title}}</th>
              </template>
            </tr>
          </thead>
          <tbody v-if="data && data.length !== 0">
            <tr class="tr-items" v-for="(index, item) in data" track-by="$index">
              <template v-for="column in columns">
                <template v-if="item.curDate === '环比增涨'">
                  <td v-if="item[column.dataIndex] === '环比增涨'">{{item[column.dataIndex]}}</td>
                  <td v-else>{{parseFloat((item[column.dataIndex].toFixed(4) * 100).toPrecision(12)) + '%'}}</td>
                </template>
                <template v-else>
                  <td v-if="column.render">{{column.render(item[column.dataIndex])}}</td>
                  <td v-else>{{item[column.dataIndex]}}</td>
                </template>
              </template>
            </tr>  
          </tbody>
        </table>
        <tableempty v-if="!$loadingRouteData && (data && data.length === 0)"></tableempty>
      <div>
   </div>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
import { formatDate } from 'components/utils/dateUtils';
import cheatMarketDataMixin from './mixins/cheatMarketDataMixin.js';
import marketDataMixin from './mixins/marketDataMixin.js';
const columns = [
  {
    title: '日期',
    dataIndex: 'curDate'
  },
  {
    title: '平台总UV',
    dataIndex: 'platformUv',
    render: text => {
      return _fixNum(text);
    }
  },
  {
    title: '活动参与uv',
    dataIndex: 'participateUv',
    render: text => {
      return _fixNum(text);
    }
  },
  {
    title: '积分商城活动曝光',
    dataIndex: 'exposurePv',
    render: text => {
      return _fixNum(text);
    }
  },
  {
    title: '总请求次数',
    dataIndex: 'participatePv',
    render: text => {
      return _fixNum(text);
    }
  },
  {
    title: '活动总付费券',
    dataIndex: 'launchCount',
    render: text => {
      return _fixNum(text);
    }
  },
  {
    title: '发券成功率',
    dataIndex: 'launchSuccessRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '消耗金额',
    dataIndex: 'consumeTotal',
    render: text => {
      return _fixNum(text);
    }
  },
  {
    title: 'ctr',
    dataIndex: 'ctr',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  }
];
const quotaArr = [
  {
    label: '平台总UV',
    id: 'platformUv'
  },
  {
    label: '活动参与uv',
    id: 'participateUv'
  },
  {
    label: '积分商城活动曝光',
    id: 'exposurePv'
  },
  {
    label: '总请求次数',
    id: 'participatePv'
  },
  {
    label: '活动总付费券',
    id: 'launchCount'
  },
  {
    label: '发券成功率',
    id: 'launchSuccessRate'
  },
  {
    label: '消耗金额',
    id: 'consumeTotal'
  },
  {
    label: 'ctr',
    id: 'ctr'
  }
];
export default {
  mixins: [cheatMarketDataMixin, marketDataMixin],
  ready() {
    this.getTableDataList();
    this.getLineDataList();
  },
  data() {
    return {
      quotaArr: quotaArr,
      columns: columns,
      selectQuota: 'platformUv',
      selectQuotaName: '平台总UV',
      chartParams: {
        startDate: this._getYesDay(formatDate(new Date()), 7),
        endDate: this._getYesDay(formatDate(new Date()), 1)
      },
      tableParams: {
        date: this._getYesDay(formatDate(new Date()), 1)
      },
      data: [],
      tableStartDay: '-',
      tableEndDay: '-',
      lineData: {},
      avgData: {},
      avgDataValue: ''
    };
  },
  methods: {
    disabledDate(date) {
      var now = new Date();
      return date.getTime() >= now.getTime();
    },
    getLineDataList() {
      this.$http.get(`/duiba/dashboard/line/chart?startDate=${this.chartParams.startDate}&endDate=${this.chartParams.endDate}`, {}
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.lineData = res.data.point;
          this.avgData = res.data.avg;
          this.selectQuotaChange();
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getTableDataList() {
      this.$loadingRouteData = true;
      this.$http.get(`/duiba/dashboard/collect?date=${this.tableParams.date}`, {}
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.$loadingRouteData = false;
          // 构造Table
          this.data = [];
          res.data.beforeWeek.forEach((item) => {
            this.data.push(item);
          });
          res.data.thisWeek.forEach((item) => {
            this.data.push(item);
          });
          res.data.thisWeekCollect.curDate = '本周汇总';
          this.data.push(res.data.thisWeekCollect);
          res.data.otherWeekCollect.curDate = '上周汇总';
          this.data.push(res.data.otherWeekCollect);
          res.data.ringRatio.curDate = '环比增涨';
          this.data.push(res.data.ringRatio);
          // 日期区间
          this.tableStartDay = res.data.beforeWeek[0].curDate;
          this.tableEndDay = res.data.thisWeek[res.data.thisWeek.length - 1].curDate;
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
    getQuotaName() {
      quotaArr.forEach(item => {
        if (item.id === this.selectQuota) {
          this.selectQuotaName = item.label;
        }
      });
    },
    getAvgDataValue() {
      if (this.selectQuota === 'launchSuccessRate' || this.selectQuota === 'ctr') {
        this.avgDataValue = parseFloat((this.avgData[this.selectQuota].toFixed(4) * 100).toPrecision(12)) + '%';
      } else if (this.selectQuota === 'consumeTotal') {
        this.avgDataValue = _fixNum(this.avgData[this.selectQuota].toFixed(2));
      } else {
        this.avgDataValue = _fixNum(this.avgData[this.selectQuota]);
      }
    },
    selectQuotaChange() {
      this.getQuotaName();
      this.getAvgDataValue();
      this.getResourcesDate(this.lineData, this.selectQuota, this.selectQuotaName);
    },
    _getYesDay(dateStr, n) {
      let yes = new Date(dateStr) - 1000 * 60 * 60 * 24 * n;
      return formatDate(yes);
    }
  }
};
</script>
<style lang="less">
  .main {
    padding: 20px;
  }
  .marketdata-main {
    background-color: #fff;
    padding: 20px;
    .form-filter-group-classes {
      margin-right: 40px;
    }
    .search-area {
      padding: 60px 0 20px 0;
      .form-filter-group {
        margin-bottom: 18px;
        float: left;
        .filter-label {
          font-size: 14px;
          font-weight: bold;
          color: #444;
          width: 84px;
          text-align: right;
          display: inline-block;
          vertical-align: top;
          margin-top: 10px;
        }
        .filter-label-big {
          width: 92px;
        }
        .form-control {
          width: 136px;
          margin-right: 10px;
        }
        .datepicker-input {
          width: 160px !important;
        }
        .iconhandle {
          right: 26px !important;
        }
      }
      .serch-btn {
        float: right;
      }
    }
    .table-title {
      font-size: 20px;
      font-weight: 700;
      color: #444;
      text-align: center;
      padding: 20px 0;
      .download {
        color: #657180;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .chart-title {
      font-size: 20px;
      font-weight: 700;
      color: #444;
      text-align: center;
      padding: 20px 0;
    }
  }
</style>


