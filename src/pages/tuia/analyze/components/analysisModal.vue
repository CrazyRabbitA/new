<template>
  <div>
    <d-modal effect="fade" width="900" :show.sync="show" :slot-id="slotId" class="analysis-modal">
      <template slot="modal-body">
        <h2>{{slotName}}</h2>
        <div class="cycle">
          <div class="cycle-title">分析周期</div>
          <div class="cycle-con">
            <div @click="activeClick(1)" :class="['cycle-item', dateTagsType === 1? 'active' : '']">按日</div>
            <div @click="activeClick(2)" :class="['cycle-item', dateTagsType === 2? 'active' : '']">按周</div>
          </div>
        </div>
        <div class="date">
          <div class="date-title">分析日期</div>
          <div class="date-con">
            <datepicker v-if="dateTagsType===1" :value.sync="analysisTime.date" formats="yyyy-MM-dd" :disabled-date="disabledDate"></datepicker>
            <daterangepicker v-if="dateTagsType===2" :start.sync="analysisTime.startDate" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="analysisTime.endDate" :disabled-date="disabledDate" width="190px"></daterangepicker>
          </div>
          <div class="date-btn" :class="analysisTimeClass === 0? 'date-btn-active' : ''" v-if="dateTagsType===2">
            <div class="date-btn-text" @click="lastWeek">上一自然周</div>
          </div>
        </div>
        <div class="date">
          <div class="date-title">对比日期</div>
          <div class="date-con">
            <daterangepicker v-if="dateTagsType===1" :start.sync="compareTime.startDate" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="compareTime.endDate" :disabled-date="disabledDate" width="190px"></daterangepicker>
            <daterangepicker v-if="dateTagsType===2" :start.sync="compareTime2.startDate" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="compareTime2.endDate" :disabled-date="disabledDate" width="190px"></daterangepicker>
          </div>
          <div class="date-btn" v-if="dateTagsType===1" :class="compareTimeClass === 0? 'date-btn-active' : ''">
            <div class="date-btn-text" @click="sevenDay">七日均值</div>
          </div>
          <div class="date-btn" v-if="dateTagsType===2" :class="compareTimeClass2 === 0? 'date-btn-active' : ''">
            <div class="date-btn-text"  @click="adjoinWeek">相邻自然周</div>
          </div>
          <div class="search-btn">
            <d-button class="searchfilter" size="large" type="warning" @click="searchData" >查询</d-button>
          </div>
        </div>
        <div class="total">
          <div class="total-title">
            <div class="item">分析日期消耗</div>
            <div class="item">对比日期消耗</div>
            <div class="item">变化值</div>
            <div class="item">变化率</div>
          </div>
          <div class="total-con">
            <div class="item">{{_fixNum(basicData.currentValue)}}</div>
            <div class="item">{{_fixNum(basicData.contrastValue)}}</div>
            <div class="item" :class="{ 'green': basicData.effectValue < 0, 'red': basicData.effectValue > 0 }">{{_fixNum(basicData.effectValue)}}</div>
            <div class="item" :class="{ 'green': basicData.ratio < 0, 'red': basicData.ratio > 0 }">{{getPrecent(basicData.ratio)}}</div>
          </div>
        </div>
        <div>
          <table class="table-wrap recommend-list mt10">
            <thead>
              <tr class="tr-header">
                <template v-for="column in columns1">
                  <th v-if="column.key === 'effectValue'">{{column.title}}
                    <d-tooltip content="影响值为正，指标对消耗影响为正影响；影响值为负，指标对消耗影响为负影响。" type="disable">
                      <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                    </d-tooltip>
                  </th>
                  <th v-if="column.key === 'ratio'">{{column.title}}
                    <d-tooltip content="影响系数正负分别代表正影响和负影响，百分数越大则对消耗的影响越大。" type="disable">
                      <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                    </d-tooltip>
                  </th>
                  <th v-if="column.key !== 'ratio' && column.key !== 'effectValue'" :class="column.key === 'key'?'text-left': ''">{{column.title}}</th>
                </template>
              </tr>
            </thead>
            <tbody v-if="data1 && data1.length !== 0">
              <tr class="tr-items" v-for="(index, item) in data1" track-by="$index">
                <template v-for="column in columns1">
                  <template v-if="column.render && item[column.key]">
                    <td :class="column.key === 'key'?'text-left': ''">
                      <div v-if="column.key === 'effectValue' || column.key === 'ratio'" :class="{ 'green': item[column.key] < 0, 'red': item[column.key] > 0 }">{{column.render(item[column.key])}}</div>
                      <div v-else>
                        <span v-if="item.key === '广告位CTR（UV）' || item.key === '参与率' || item.key === '广告曝光成功率' || item.key === '广告点击率'">{{getPrecent(item[column.key])}}</span>
                        <span v-else>{{column.render(item[column.key])}}</span>
                      </div>
                    </td>
                  </template>
                  <template v-else>
                    <td :class="column.key === 'key'?'text-left': ''">
                      <div>{{item[column.key]}}</div>
                    </td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template slot="modal-footer">
        <div class="modal-footer">
        </div>
      </template>
    </d-modal>
    <loading :show="loadingRouteData"></loading>
  </div>
</template>

<script>
import Vue from 'vue';
import MessageBox from 'components/basic/MessageBox';
import coerceBoolean from 'components/utils/coerceBoolean.js';
import dateUtil from 'components/utils/getCurDate';
import Tooltip from 'iview/src/components/tooltip';
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
Vue.component('Tooltip', Tooltip);

export default {
  props: {
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    slotId: {},
    dateTagsType: {}
  },
  data() {
    return {
      loadingRouteData: false,
      analysisTime: {
        date: '',
        startDate: '',
        endDate: ''
      },
      compareTime: {
        startDate: '',
        endDate: ''
      },
      compareTime2: {
        startDate: '',
        endDate: ''
      },
      columns1: [
        {
          title: '指标',
          key: 'key'
        },
        {
          title: '分析日数值',
          key: 'currentValue',
          render: (row) => {
            return _fixNum(row);
          }
        },
        {
          title: '对比日数值',
          key: 'contrastValue',
          render: (row) => {
            return _fixNum(row);
          }
        },
        {
          title: '影响值',
          key: 'effectValue',
          render: (row) => {
            return _fixNum(row);
          }
        },
        {
          title: '影响系数',
          key: 'ratio',
          render(row) {
            if (!row) {
              return '';
            }
            let n = getPrecent(row);
            return n;
          }
        }
      ],
      data1: [],
      cycleTitle: [
        {
          title: '按日',
          key: 'day',
          active: true
        },
        {
          title: '按周',
          key: 'week',
          active: false
        }
      ],
      basicData: {},
      infoData: {},
      analysisTimeClass: 1,
      compareTimeClass: 1,
      compareTimeClass2: 1
    };
  },
  computed: {
    params() {
      let analyseTime = '';
      let compareDate = '';
      if (this.dateTagsType === 2) {
        analyseTime = `${this.analysisTime.startDate},${this.analysisTime.endDate}`;
        compareDate = `${this.compareTime2.startDate},${this.compareTime2.endDate}`;
      } else {
        analyseTime = this.analysisTime.date;
        compareDate = `${this.compareTime.startDate},${this.compareTime.endDate}`;
      }
      const data = {
        compareDate: compareDate,
        date: analyseTime,
        dateType: this.dateTagsType,
        slotId: this.slotId
      };
      return data;
    },
    slotName() {
      if (Object.keys(this.infoData).length > 0) {
        if (this.infoData.slotName && this.infoData.slotId) {
          return `广告位名称：${this.infoData.slotName}(${this.infoData.slotId})`;
        } else {
          return `广告位名称：${this.infoData.slotName}`;
        }
      }
      return '大盘';
    }
  },
  watch: {
    compareTime: {
      handler: function(val, oldVal) {
        if (val.startDate !== this.getOrderDate(8) || val.endDate !== this.getOrderDate(2)) {
          this.compareTimeClass = 0;
        }
      },
      deep: true
    },
    compareTime2: {
      handler: function(val, oldVal) {
        const myDate = new Date();
        const week = myDate.getDay();
        if (val.startDate !== this.getOrderDate(6 + week + 7) || val.endDate !== this.getOrderDate(week + 7)) {
          this.compareTimeClass2 = 0;
        }
      },
      deep: true
    },
    analysisTime: {
      handler: function(val, oldVal) {
        const myDate = new Date();
        const week = myDate.getDay();
        if (val.startDate !== this.getOrderDate(6 + week) || val.endDate !== this.getOrderDate(week)) {
          this.analysisTimeClass = 0;
        }
      },
      deep: true
    }
  },
  ready() {
    // this.initData();
  },
  methods: {
    initData() {
      const me = this;
      const myDate = new Date();
      const week = myDate.getDay();
      this.analysisTime = {
        date: me.getOrderDate(1),
        startDate: me.getOrderDate(6 + week),
        endDate: me.getOrderDate(week)
      };
      this.compareTime = {
        startDate: me.getOrderDate(8),
        endDate: me.getOrderDate(2)
      };
      this.compareTime2 = {
        startDate: me.getOrderDate(6 + week + 7),
        endDate: me.getOrderDate(week + 7)
      };
      this.getData();
    },
    activeClick(id) {
      const me = this;
      this.dateTagsType = id;
      if (id === 1) {
        this.analysisTime = {
          date: me.getOrderDate(1),
          startDate: me.getOrderDate(7),
          endDate: me.getOrderDate(1)
        };
        this.compareTime = {
          startDate: me.getOrderDate(8),
          endDate: me.getOrderDate(2)
        };
        this.analysisTimeClass = 1;
        this.compareTimeClass = 1;
      } else {
        const myDate = new Date();
        const week = myDate.getDay();
        this.analysisTime = {
          date: me.getOrderDate(1),
          startDate: me.getOrderDate(6 + week),
          endDate: me.getOrderDate(week)
        };
        this.compareTime2 = {
          startDate: me.getOrderDate(6 + week + 7),
          endDate: me.getOrderDate(week + 7)
        };
        this.analysisTimeClass = 1;
        this.compareTimeClass = 1;
      }
    },
    /**
     * 订单时间设置
     */
    getOrderDate(offset) {
      var myDate = new Date();
      myDate.setDate(myDate.getDate() - offset);
      return dateUtil({
        date: myDate
      });
    },
    disabledDate(date) {
      let now = new Date();
      return date.getTime() > now.getTime();
    },
    getData() {
      this.loadingRouteData = true;
      this.$http.post('/slot/analyse', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.loadingRouteData = false;
          let data = res.data;
          this.basicData = data.basic;
          this.infoData = data.info;
          let arr = [];
          const setName = (obj, name) => {
            if (Object.keys(obj).length > 0) {
              obj.key = name;
              arr.push(obj);
            }
          };
          setName(data.sdkUv, '广告位访问UV');
          setName(data.actExposeUv, '广告位曝光UV');
          setName(data.ctr, '广告位CTR（UV）');
          setName(data.advertParticipateRate, '参与率');
          setName(data.dupliParticipateRate, '复参数');
          setName(data.advertExposeRate, '广告曝光成功率');
          setName(data.advertClickRate, '广告点击率');
          setName(data.advertClickPrice, '广告点击单价');
          this.data1 = arr;
        } else {
          this.loadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
      });
    },
    sevenDay() {
      const me = this;
      this.compareTime = {
        startDate: me.getOrderDate(8),
        endDate: me.getOrderDate(2)
      };
      this.compareTimeClass = 1;
    },
    adjoinWeek() {
      const me = this;
      const myDate = new Date();
      const week = myDate.getDay();
      this.compareTime2 = {
        startDate: me.getOrderDate(6 + week + 7),
        endDate: me.getOrderDate(week + 7)
      };
      this.compareTimeClass2 = 1;
    },
    lastWeek() {
      const me = this;
      const myDate = new Date();
      const week = myDate.getDay();
      this.analysisTime = {
        date: me.getOrderDate(1),
        startDate: me.getOrderDate(6 + week),
        endDate: me.getOrderDate(week)
      };
      this.analysisTimeClass = 1;
    },
    searchData() {
      this.getData();
    },
    _fixNum(num) {
      return _fixNum(num);
    },
    getPrecent(num) {
      return getPrecent(num);
    },
    analysisTimeChange() {
    }
  }

};
</script>

<style lang="less">
.analysis-modal {
  .green {
    color: #2ac993;
  }
  .red {
    color: red;
  }
  h2 {
    position: absolute;
    display: inline-block;
    font-size: 22px;
    height: 50px;
    line-height: 50px;
    left: 300px;
    top: 14px;
    text-align: center
  }
  .search-btn {
    float: right;
  }
  .ques-icon {
    margin-left: 10px;
    display: inline-block;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
    background-color: #000;
    border-radius: 8px;
    font-style: normal;
    cursor: pointer;
  }
  .table-wrap {
    .tr-header th {
      position: relative;
      text-align: right;
      padding-right: 70px;
    }
    .tr-items{
      td{
        text-align: right;
        padding-right: 70px;
      }
    }
    .tr-header,.tr-items{
      .text-left{
        text-align: left;
        padding-right: 10px;
      }
    }
  }
  .total {
    padding: 20px 10px;
    .total-title,
    .total-con {
      width: 100%;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      color: #444;
      .item {
        float: left;
        width: 25%;
        text-align: left;
        font-weight: bold;
      }
    }
    .total-con .item {
      font-size: 24px;
      font-weight: normal;
    }
  }
  .modal-content {
    padding: 0 20px;
    width: 100%;
  }
  .cycle,
  .date {
    height: 50px;
  }
  .cycle-title,
  .date-title {
    float: left;
    margin-right: 10px;
    height: 34px;
    line-height: 34px;
    font-weight: bold;
  }
  .cycle-con,
  .date-con {
    float: left;
  }
  .date-btn {
    float: left;
    margin-left: 20px;
    padding: 0 10px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    color: #fff;
    background-color: #ef6b3b;
    cursor: pointer;
  }
  .date-btn-active {
    color: #ef6b3b;
    background-color: #f7f6f2;
    color: #444;
    cursor: pointer;
    border: 1px solid #e3e3e3;
  }
  .cycle-item {
    float: left;
    background-color: #f7f6f2;
    height: 34px;
    line-height: 34px;
    padding: 0 24px;
    font-size: 14px;
    border: 1px solid #e3e3e3;
    cursor: pointer;
  }
  .active {
    background-color: #ef6b3b;
    color: #fff;
    border: 1px solid #ef6b3b;
  }
}
</style>


