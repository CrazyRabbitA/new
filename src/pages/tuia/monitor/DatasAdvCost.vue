<template>
  <div class="adv-cost-top-content">
    <pagetitle class="adv-cost-title" title="成本监控" :sub-title="newtime"></pagetitle>
    <div class="form-filter-group">
      <p class="filter-label fl  filter-label-adv">广告ID：</p>
      <input type="text" class="form-control fl" placeholder="请输入广告ID" v-model= "params.advertId">
    </div>
    <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="warning" @click="fetchData" >查询</d-button>
    </div>
  </div>
  <div class="adv-cost-chart-content">
    <pagetitle class="adv-cost-plan-title" title="广告计划信息" :sub-title="'&nbsp;&nbsp;&nbsp;广告ID：' + data.advertId+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称：' + data.advertName"></pagetitle>
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
              分策略数据
        </label>
      </div>
    </div>
    <div class="adv-cost-form-strategy-item">
      定向配置：
      <d-checkbox-group :value.sync="checkList" >
        <template v-for="(index,item) in data.line.advertPackage">
          <d-checkbox :name="index" @change="selectChange" :disabled="isCantSelect">{{item.packageName}}（ID：{{item.advertOpId}}）</d-checkbox>
        </template>
      </d-checkbox-group>
    </div>
    <div  id="advCostLineCheat" style="height:300px;width:auto"></div>
  </div>
  <div class="adv-cost-history-chart-content">
    <div class="adv-cost-top-content-history">
      <div class="form-filter-group">
        <p class="filter-label fl filter-label-history">历史数据：</p>
        <datepicker :value.sync="historyParams.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
      </div>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="warning" @click="getHistoryDataList" >查询</d-button>
      </div>
    </div>
    <div class="adv-cost-form-strategy">
      查看对象：
      <div class="radio-group">
        <label for="" class="radio-label">
          <input type="radio" name="strategyhistory" class="radio-control strategy-radio"  v-model="strategycheckHistory" value="1"/>
              广告计划数据
        </label>
      </div>
      <div class="radio-group">
        <label for="" name="strategy" class="radio-label">
          <input type="radio" class="radio-control strategy-radio" name="strategyhistory" v-model="strategycheckHistory" value="0"/>
              分策略数据
        </label>
      </div>
      <div class="adv-cost-form-strategy-item">
        定向配置：
        <d-checkbox-group :value.sync="checkListHistory" >
          <template v-for="(index,item) in historyData.line.advertPackage">
            <d-checkbox :name="index" @change="selectChangeHistory" :disabled="isCantSelectHistory">{{item.packageName}}（ID：{{item.advertOpId}}）</d-checkbox>
          </template>
        </d-checkbox-group>
      </div>
    </div>  
    <div id="advCostHistoryLineCheat" style="height:300px;width:auto"></div>
  </div>
  <loading :show="$loadingRouteData"></loading>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import cheatAdvcostMixins from './mixins/cheatAdvcostMixins.js';
  import advcostMixins from './mixins/advcostMixins.js';
  import cheatAdvcostHistoryMixins from './mixins/cheatAdvcostHistoryMixins.js';
  import advcostHistoryMixins from './mixins/advcostHistoryMixins.js';
  import { formatDate } from 'components/utils/dateUtils';
  export default {
    mixins: [cheatAdvcostMixins, advcostMixins, cheatAdvcostHistoryMixins, advcostHistoryMixins],
    data() {
      return {
        timeNum: +new Date(),
        $loadingRouteData: false,
        strategycheck: '1',
        strategycheckHistory: '1',
        isCantSelect: true,
        isCantSelectHistory: true,
        historyParams: {
          extraDate: this._getYesDay(formatDate(new Date()))
        },
        historyData: {
          advertId: '',
          advertName: '',
          line: {
            advertPackage: []
          }
        },
        checkListHistory: [],
        params: {
          advertId: ''
        },
        checkList: [],
        data: {
          advertId: '',
          advertName: '',
          line: {
            advertPackage: []
          }
        }
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
      },
      strategycheckHistory: function(newValue, oldValue) {
        if (newValue === '0') {
          this.isCantSelectHistory = false;
        } else {
          this.isCantSelectHistory = true;
        }
        if (this.historyData.advertId) {
          this.getAdvcostHistoryDate(this.historyData.line, this.isCantSelectHistory);
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
      disabledDate: function(date) {
        var now = new Date();
        return date.getTime() >= now.getTime() - 24 * 60 * 1000 * 60;
      },
      fetchData: function() {
        this.historyParams.extraDate = this._getYesDay(formatDate(new Date()));
        this.getDataList();
        this.getHistoryDataList();
      },
      getDataList: function(transition) {
        let params = {
          advertId: this.params.advertId,
          extraDate: formatDate(new Date())
        };
        this.$http.get('/tuia/ads/transfee', {
          params: params
        }).then((res) => {
          res = res.json();
          if (res.success) {
            this.checkList = [];
            this.$set('data', res.data);
            res.data.line.advertPackage.forEach((item, index) => {
              this.checkList.push(index);
            });
            this.getAdvcostDate(this.data.line, this.isCantSelect);
          } else {
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
      getHistoryDataList: function() {
        this.$loadingRouteData = true;
        let params = {
          advertId: this.params.advertId,
          extraDate: this.historyParams.extraDate
        };
        this.$http.get('/tuia/ads/transfee', {
          params: params
        }).then((res) => {
          res = res.json();
          if (res.success) {
            this.checkListHistory = [];
            this.$set('historyData', res.data);
            res.data.line.advertPackage.forEach((item, index) => {
              this.checkListHistory.push(index);
            });
            this.getAdvcostHistoryDate(this.historyData.line, this.isCantSelectHistory);
            this.$loadingRouteData = false;
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
      selectChange() {
        this.getAdvcostDate(this.data.line, this.isCantSelect);
      },
      selectChangeHistory() {
        this.getAdvcostHistoryDate(this.historyData.line, this.isCantSelectHistory);
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
    .checkbox-group {
      display: inline-block;
      .d-checkbox-control {
        padding-left: 18px;
        margin-right: 10px;
        .icon {
          width: 14px;
          height: 14px;
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
}

.adv-cost-history-chart-content {
  background-color: #fff;
  border-radius: 5px;
  margin-top: 15px;
  padding: 20px;
  .adv-cost-top-content-history {
    background-color: #fff;
    border-radius: 5px;
    height: 60px;
    .filter-label-history {
      width: 74px;
    }
    .datepicker {
      .iconhandle {
        right: 42px !important;
        color: #888;
      }
      &:hover .iconhandle {
        color: #444;
      }
    }
    .datepicker-popup .datepicker-ctrl span {
      right: 0 !important;
    }
  }
  .adv-cost-form-strategy {
    border-top: 1px dashed #e1e1e1;
    padding-top: 4px;
  }
  .form-filter-group {
    .datepicker-input {
      width: 160px !important;
    }
  }
}
</style>
