<template>
  <div class="adv-cost-top-content">
    <pagetitle class="adv-cost-title" title="广告实时数据" :sub-title="newtime"></pagetitle>
    <div class="form-filter-group">
      <p class="filter-label fl  filter-label-adv">广告ID：</p>
      <auto-input :input-class="'form-control fl'"  :result-list="advIdList" :value.sync="params.advertId"  @on-change="advIdChange" @on-click="handleClick"></auto-input>
    </div>
    <div class="form-filter-group">
      <p class="filter-label fl  filter-label-adv">广告名称：</p>
      <auto-input :input-class="'form-control fl'" :result-list="advtNameList" :value.sync="params.name"  @on-change="advNameChange" @on-click="handleClick"></auto-input>
    </div>
    <div class="serch-btn">
      <d-button class="searchfilter" size="large" type="warning" @click="fetchData" >查询</d-button>
    </div>
  </div>
  <div class="adv-cost-chart-content">
    <pagetitle class="adv-cost-plan-title" title="广告计划信息" :sub-title="'&nbsp;&nbsp;&nbsp;广告ID：' + data.advert.id + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称：' + data.advert.advertName"></pagetitle>
    <div class="adv-cost-form-strategy">
      查看对象：
      <div class="radio-group">
        <label for="" class="radio-label">
          <input type="radio" name="strategy" class="radio-control strategy-radio"  v-model="strategycheck" value="1"/>
              广告计划数据
        </label>
      </div>
      <div class="radio-group">
        <label for="" name="strategy" class="radio-label">
          <input type="radio" class="radio-control strategy-radio" name="strategy" v-model="strategycheck" value="0"/>
              定向配置数据
        </label>
      </div>
    </div>
    <div class="adv-cost-form-strategy-item">
      <div class="select-strategy-group" v-if="!isCantSelect">
         <template v-for="item in data.package">
           <div v-if="item.isActive" class="select-item active" @click="selectPackage(item.id, item.advertId)">{{item.packageName}}({{item.id}})</div>
           <div v-else class="select-item" @click="selectPackage(item.id, item.advertId)">{{item.packageName}}({{item.id}})</div>
         </template>
      </div>
    </div>
    <div class="chart-option">
      <h2 class="alarm" @click="showAlarmModal"><i class="iconnav">&#xe6c9;</i> 警报</h2>
      <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange" v-show="totalData.length > 0"></d-select>
    </div>
    <div id="advRealtimeCheat" style="height:300px;width:auto; margin-top: 40px"></div>
  </di>
  <loading :show="realTimeLoading"></loading>
  <component :is="currentView" :alarmmodal="alarmModalCfg" :show.sync="alarmModalCfg.show"></component>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import advRealTimeMixins from './mixins/advRealTimeMixins.js';
  import cheatAdvRealTimeMixins from './mixins/cheatAdvRealTimeMixins.js';
  import autoInput from './components/autoInput';
  import { formatDate } from 'components/utils/dateUtils';
  import alarmCfgModal from './components/alarmCfg';
  const quotaArr = [
    {
      label: '广告发券量',
      id: 'launchCount'
    }, {
      label: '广告券曝光量',
      id: 'exposureCount'
    }, {
      label: '广告券点击量',
      id: 'clickCount'
    }, {
      label: '广告券计费点击量',
      id: 'efClickCount'
    }, {
      label: '计费点击UV',
      id: 'efClickUv'
    }, {
      label: '点击率',
      id: 'clickRate'
    }, {
      label: '消耗',
      id: 'consumeTotal'
    }, {
      label: '落地页访问PV',
      id: 'visitPv'
    }, {
      label: '落地页访问UV',
      id: 'visitUv'
    }, {
      label: '落地页转化PV',
      id: 'effectPv'
    }, {
      label: '落地页转化UV',
      id: 'effectUv'
    }, {
      label: 'CVR',
      id: 'cvr'
    }, {
      label: '计费点击均价',
      id: 'chargeClickAvg'
    }, {
      label: '转化成本',
      id: 'effectCost'
    }];

  export default {
    mixins: [advRealTimeMixins, cheatAdvRealTimeMixins],
    components: { autoInput, alarmCfgModal },
    route: {
      data(transition) {
        if (this.$route.params.id) {
          this.params.advertId = this.$route.params.id;
          this.fetchData();
        }
      }
    },
    data() {
      return {
        timeNum: +new Date(),
        realTimeLoading: false,
        strategycheck: '1',
        packageId: '',
        isCantSelect: true,
        // 广告id结果框
        advIdList: [],
        advtNameList: [],
        totalData: [],
        alarmModalCfg: {},
        currentView: '',
        params: {
          advertId: '',
          name: ''
        },
        quotaArr: quotaArr,
        selectQuota: 'launchCount',
        data: {
          advert: {
            id: '',
            advertName: ''
          }
        },
        dataLine: {}
      };
    },
    watch: {
      strategycheck: function(newValue, oldValue) {
        if (newValue === '0') {
          this.isCantSelect = false;
        } else {
          this.isCantSelect = true;
        }
        if (this.data.advertId) {
          this.getAdvcostDate(this.data.line, this.isCantSelect);
        }
      }
    },
    ready() {
      setInterval(() => { this.timeNum += 1000; }, 1000);
    },
    computed: {
      newtime() {
        let date = new Date(this.timeNum);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return year + '年' + this.formatstr(month) + '月' + this.formatstr(day) + '日 ' + this.formatstr(h) + ':' + this.formatstr(m) + ':' + this.formatstr(s);
      }
    },
    methods: {
      formatstr(num) {
        return num > 9 ? num : ('0' + num);
      },
      _getYesDay(dateStr) {
        let yes = new Date(dateStr) - 1000 * 60 * 60 * 24;
        return formatDate(yes);
      },
      disabledDate(date) {
        var now = new Date();
        return date.getTime() >= now.getTime() - 24 * 60 * 1000 * 60;
      },
      fetchData() {
        this.strategycheck = '1';
        this.getDataList();
      },
      advIdChange(e) {
        if (!this.params.advertId) {
          this.advIdList = [];
          return;
        }
        this.$http.get(`/ads/id?advertId=${this.params.advertId}`, {
        }).then((res) => {
          res = res.json();
          this.advIdList = [];
          if (res.success) {
            res.data.forEach((item) => {
              this.advIdList.push({
                key: item.id,
                value: item.name
              });
            });
          }
        }, (res) => {
        });
      },
      advNameChange(e) {
        if (!this.params.name) {
          this.advtNameList = [];
          return;
        }
        this.$http.get(`/ads/name?name=${this.params.name}`, {
        }).then((res) => {
          res = res.json();
          this.advtNameList = [];
          if (res.success) {
            res.data.forEach((item) => {
              this.advtNameList.push({
                key: item.id,
                value: item.name
              });
            });
          }
        }, (res) => {
        });
      },
      handleClick(value) {
        this.params.advertId = value.key;
        this.params.name = value.value;
        this.fetchData();
      },
      getDataList() {
        if (!this.params.advertId) {
          MessageBox({
            title: '请输入广告Id',
            type: 'error'
          });
          return;
        }
        this.realTimeLoading = true;
        let params = {
          advertId: this.params.advertId
        };
        this.$http.get('/poackage/ads/loading/page/collect', {
          params: params
        }).then((res) => {
          res = res.json();
          if (res.success) {
            this.realTimeLoading = false;
            res.data.package.forEach((item) => {
              item.isActive = false;
            });
            this.$set('data', res.data);
            this.$set('dataLine', res.data);
            this.getTotalData(this.selectQuota);
            this.getResourcesDate(this.dataLine, this.selectQuota);
          } else {
            this.realTimeLoading = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          this.realTimeLoading = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      selectQuotaChange() {
        this.getTotalData(this.selectQuota);
        this.getResourcesDate(this.dataLine, this.selectQuota);
      },
      selectPackage(advertPackageId, advertId) {
        this.packageId = advertPackageId;
        this.data.package.forEach((item) => {
          item.isActive = this.packageId === item.id;
        });
        let params = {
          advertPackageId: advertPackageId,
          advertId: advertId
        };
        this.$http.get('/poackage/ads/loading/page', {
          params: params
        }).then((res) => {
          res = res.json();
          if (res.success) {
            this.$set('dataLine', res.data);
            this.getTotalData(this.selectQuota);
            this.getResourcesDate(this.dataLine, this.selectQuota);
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          this.realTimeLoading = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      getTotalData(type) {
        let self = this;
        self.totalData = [];
        if (self.selectQuota === 'clickRate' || self.selectQuota === 'cvr') {
          let todayTotal = self.data.collect.today[type];
          let yesterdayTotal = self.data.collect.yesterday[type];
          let sevTotal = self.data.collect['7avg'][type];
          let lastDayTotal = self.data.collect['lastDay'][type];
          todayTotal = parseFloat((todayTotal * 100).toPrecision(12)) + '%';
          yesterdayTotal = parseFloat((yesterdayTotal * 100).toPrecision(12)) + '%';
          sevTotal = parseFloat((sevTotal * 100).toPrecision(12)) + '%';
          lastDayTotal = parseFloat((lastDayTotal * 100).toPrecision(12)) + '%';
          self.totalData.push(todayTotal, yesterdayTotal, sevTotal, lastDayTotal);
        } else {
          self.totalData.push(self._fixNum(self.data.collect.today[type]), self._fixNum(self.data.collect.yesterday[type]), self._fixNum(self.data.collect['7avg'][type]), self._fixNum(self.data.collect['lastDay'][type]));
        }
      },
      showAlarmModal() {
        this.alarmModalCfg = {
          dimensionType: 6,
          showInput: {
            activity: false,
            slot: true,
            app: false
          },
          quota: this.selectQuota,
          slotId: this.data.advert.id,
          quotaArr: this.quotaArr,
          show: true
        };
        this.currentView = 'alarmCfgModal';
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
.adv-cost-top-content {
  background-color: #fff;
  border-radius: 5px;
  height: 112px;
  .adv-cost-title {
    border-bottom: none;
    padding: 20px;
    h2.has-sub-title {
      font-weight: bold;
      font-size:16px;
      color:#444444;
    }
    .iconhandle {
      display: none;
    }
    .sub-title {
      font-size:14px;
      color:#444444;
      font-weight: normal;
      margin-right: 9px;
    }
  }
  .serch-btn {
    .searchfilter {
      height: 33px;
    }
  }
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
  .filter-label-adv {
    width: 79px !important;
    text-align: right !important;
  }
  .form-control {
    width: 200px;
    margin-right: 30px;
  }
}
.adv-cost-form-strategy {
    .radio-group {
      display: inline-block;
    }
  }
  .adv-cost-form-strategy-item {
    .select-strategy-group {
      width: 100%;
      padding-left: 80px;
      padding-right: 200px;
      .select-item {
          display: inline-block;
          height: 30px;
          line-height: 16px;
          margin: 8px 8px 0 8px;
          font-size: 14px;
          text-align: center;
          padding: 7px;
          border: 1px solid #a2a0a0;
          border-radius: 2px;
          cursor: pointer;
          &.active {
            background: #ff795c;
            border: 1px solid #ff795c;
            color: #fff;
          }
      }
    }
  }
.adv-cost-chart-content {
  background-color: #fff;
  border-radius: 5px;
  margin-top: 15px;
  padding: 20px;
  .adv-cost-plan-title {
    padding:0 0 20px 0;
    display: block;
    border-bottom: 1px dashed #e1e1e1;
    h2.has-sub-title {
      font-weight: bold;
      font-size:16px;
      color:#444444;
    }
    .iconhandle {
      display: none;
    }
    .sub-title {
      font-size:14px;
      color:#444444;
      font-weight: normal;
      margin-right: 9px;
    }
  }
  .total-data {
    position: absolute;
    top: 204px;
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
  .alarm {
    position: absolute;
    top: 222px;
    right: 40px;
    cursor: pointer;
    color: #657180;
    line-height: 1;
    font-weight: normal;
    &:hover {
      color: #ef6b3b;
    }
  }
  .chart-option {
    .select-group {
      top: 40px;
      .select-menu {
        max-height: 350px;
      }
    }
  }
}
</style>
