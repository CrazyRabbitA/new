<template>
  <div>
    <pagetitle title="用户路径分析"></pagetitle>
    <time-select :time-obj.sync="timeRange" :button-time="buttonTime"></time-select>
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">媒体ID：</p>
        <auto-input placeholder="请输入媒体ID" :input-class="'form-control fl'"  :result-list="appIdList" :value.sync="params.appId"  @on-click="mediaClick" @on-change="appIdChange"></auto-input>
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">媒体名称：</p>
        <auto-input placeholder="请输入媒体名称" :input-class="'form-control fl'" :result-list="appNameList" :value.sync="params.appName"  @on-click="mediaClick" @on-change="appNameChange"></auto-input>
      </div>
    </div>
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">广告位ID：</p>
        <input :class="'form-control fl advertId'" placeholder="请输入广告位ID" v-model="params.slotId" >
      </div>
      <d-button class="searchfilter" size="large" type="warning" @click="getChartData" >查询</d-button>
    </div>
    <d3-sequences :chart-data="chartData" :detail-data="detailData" ></d3-sequences>
    <loading :show="$loadingRouteData"></loading>
  </div>
</template>
<script>
import timeSelect from './components/selectTime';
import autoInput from '../monitor/components/autoInput';
import MessageBox from 'components/basic/MessageBox';

import d3Sequences from './components/d3Sequences.vue';

export default {
  components: {
    timeSelect,
    autoInput,
    MessageBox,
    d3Sequences
  },
  data() {
    return {
      timeRange: {
        startDate: '',
        endDate: ''
      },
      params: {
        appId: '',
        appName: '',
        slotId: ''
      },
      appIdList: [],
      appNameList: [],
      chartData: undefined,
      detailData: undefined
    };
  },
  methods: {
    getChartData() {
      this.$loadingRouteData = true;
      this.$http.get('/slot/chain/user', {
        params: Object.assign({}, this.params, {
          startDate: this.timeRange.startDate,
          endDate: this.timeRange.endDate
        })
      }).then((res) => {
        this.$loadingRouteData = false;

        const json = res.json();
        if (json.success) {
          const data = json.data;

          let chartData = [];
          if (data) {
            data && data.chart.map(el => {
              for (var key in el) {
                chartData.push([key, el[key]]);
              }
            });
          } else {
            MessageBox({
              title: '没有数据',
              type: 'error'
            });
          }
          this.chartData = chartData;
          this.detailData = data ? data.detail : undefined;
        } else {
          MessageBox({
            title: json.desc,
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
    mediaClick(value) {
      this.params.appId = value.key;
      this.params.appName = value.value;
      this.getChartData();
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
    appNameChange() {
      if (!this.params.appName) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/app', { appName: this.params.appName
      }).then((res) => {
        res = res.json();
        this.appNameList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.appNameList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    }
  },
  ready() {
    this.getChartData();
  }
};
</script>

<style lang="less" scoped>
.page-title{
  padding-top: 10px;
}
.form-filter-group {
  margin-bottom: 18px;
  margin-right: 10px;
  float: left;
  &:last-child{
    margin-right: 0;
  }
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
    width: 150px;
    display: inline-block;
    margin-right: 10px;
    &.advertId{
      width: 300px;
    }
  }
  .datepicker-input {
    width: 160px !important;
  }
  .iconhandle {
    right: 26px !important;
  }
}
</style>
