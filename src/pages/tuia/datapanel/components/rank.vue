<template>
  <d-modal  effect="fade" :show.sync="show" width="1150" class="uptypemodal"  :on-close="close">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="uprank-block-search cf top-rank-type-wrap">
          <div class="cf">
            <div class="form-filter-group cf">
              <p class="filter-label fl filter-label-rank">对象：</p>
              <span class="uptypemodal-text">广告</span>
            </div>
            <div class="form-filter-group cf">
              <p class="filter-label fl filter-label-rank">指标：</p>
              <span class="uptypemodal-text">广告剩余预算</span>
            </div>
          </div>
          <div class="form-filter-group cf form-filter-group-rank-date">
            <p class="filter-label fl filter-label-rank" >日期：</p>
            <datepicker :value.sync="params.date" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
          </div>
          <div class="form-filter-group cf">
            <p class="filter-label fl filter-label-rank">时段：</p>
            <d-select :options.sync="selectTimeNodeArr" :value.sync="params.durationTime"></d-select>
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
                {{_fixNum(data.basic.currentResidueBudget, 2)}}
              </td>
              <td>
                {{_fixNum(data.basic.compareResidueBudget, 2)}}
              </td>
              <td v-if="_fixNum(data.basic.variation).indexOf('-') === 0" class="down-green">
                {{_fixNum(data.basic.variation, 2)}}
              </td>
              <td v-else class="up-red">
                {{_fixNum(data.basic.variation, 2)}}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="top-type">
            <div class="up-type" :class="{'active': upType}" @click="changeType(1)">涨幅TOP</div>
            <div class="down-type" :class="{'active': downType}"  @click="changeType(2)">跌幅TOP</div>
        </div>
        <div class="rule-list uprank-rule-list">
            <table class="recommend-list mt10">
            <thead>
              <tr class="tr-header">
                <template v-for="column in columns">
                  <th>{{column.title}}</th>
                </template>
              </tr>
            </thead>
            <tbody v-if="data && data.length !== 0">
              <tr class="tr-items" v-for="(index, item) in rankTopData.currentTable" track-by="$index">
                <template v-for="column in columns">
                    <template v-if="column.render">
                      <td>
                        {{column.render(item[column.dataIndex])}}
                      </td>
                    </template>
                    <template v-else>
                      <td>{{item[column.dataIndex]}}</td>
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
   <template slot="modal-footer">
      <div class="modal-footer">
      </div>
    </template>
  </d-modal>
</template>

<script>
import MessageBox from 'components/basic/MessageBox';
import { formatDate } from 'components/utils/dateUtils';
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';

const columns = [
  {
    title: '广告ID',
    dataIndex: 'advertId'
  },
  {
    title: '  广告名称',
    dataIndex: 'advertName'
  },
  {
    title: '广告主ID',
    dataIndex: 'accountId'
  },
  {
    title: '广告主名称',
    dataIndex: 'accountName'
  },
  {
    title: '当前时段值',
    dataIndex: 'currentResidueBudget',
    render: (text) => {
      return _fixNum(text, 2);
    }
  },
  {
    title: '对比时段值',
    dataIndex: 'compareResidueBudget',
    render: (text) => {
      return _fixNum(text, 2);
    }
  },
  {
    title: '变化值',
    dataIndex: 'variation',
    render: (text) => {
      return _fixNum(text, 2);
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
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  ready() {
    this.timeNodeFomat();
    this.getRule();
  },
  data() {
    return {
      data: {
        showModal: true,
        basic: {
          currentResidueBudget: '',
          compareResidueBudge: '',
          variation: ''
        }
      },
      columns: columns,
      ruleTypeArr: ruleTypeArr,
      selectTimeNodeArr: [],
      upType: true,
      downType: false,
      params: {
        durationTime: '',
        rule: 2,
        type: 1,
        date: this._getYesDay(formatDate(new Date()))
      },
      // 涨跌板table分页
      rankTopData: {
        currentTable: [],
        total: 0,
        pageNum: 1,
        pageSize: 8
      }
    };
  },
  watch: {
    'params.date': function() {
      if (this.params.date !== this._getYesDay(formatDate(new Date()))) {
        this.selectTimeNodeArr = selectTimeNodeArr;
      } else {
        this.selectTimeNodeArr = [];
        this.timeNodeFomat();
      }
    }
  },
  methods: {
    close() {
      this.show = false;
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
      this.getRule();
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
      this.getRule();
    },
    getRule() {
      this.loadshow = true;
      this.$http.get('/tuia/budget/balance', {params: this.params}).then((res) => {
        res = res.json();
        if (res.success) {
          this.data = res.data;
          this.getPage();
          this.loadshow = false;
        } else {
          this.loadshow = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadshow = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    _fixNum(num, long) {
      return _fixNum(num, long);
    },
    getPrecent(num) {
      return getPrecent(num);
    },
    // 分页
    onPageChange(page) {
      this.rankTopData.pageNum = page;
      this.getPage();
    },
    getPage() {
      this.rankTopData.total = this.data.table.length;
      let start = (this.rankTopData.pageNum - 1) * this.rankTopData.pageSize;
      let end = start + this.rankTopData.pageSize;
      this.rankTopData.currentTable = this.data.table.slice(start, end);
    }
  }
};
</script>
<style lang="less" scoped>
.uptypemodal {
  .uptypemodal-text {
    display: inline-block;
    margin-top: 8px;
    margin-right: 40px;
  }
  .loading {
    height: 700px;
    border-radius: 5px;
  }
  .rank-name-warp {
    position: absolute;
    top: 28px;
    left: 680px;
    font-size: 16px;
    font-weight: bold;
    color: #444;
    margin-top: 4px;
  }
  .top-rank-type-wrap {
    padding: 0;
    .form-filter-group-rank-date {
      .iconhandle {
        right: 43px !important;
        &.datepicker-nextBtn {
          right: 0px !important;
        }
      }
    }
    .filter-label-rank {
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 46px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
    }
    .filter-label-80 {
      width: 80px;
    }
    .top-rank-type {
      display: inline-block;
      border:1px solid #ccc;
      font-size: 0;
      span {
        display: inline-block;
        width: 72px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        background-color: #efefef;
        border-right: 1px solid #ccc;
        cursor: pointer;
        &:last-child {
          border-right: none;
        }
        &.active {
          color: #ef6b3b;
          background: #fff;
        }
      }
      &.top-rank-time {
        float: left;
        margin-right: 24px;
        span {
          width: 84px;
          &:nth-child(2) {
            border-right: none;
          }
        }
      }
    }
  }
  .modal-dialog {
    height: 560px !important;
  }
  .modal-title {
    margin-bottom: 6px;
  }
  .modal-content {
    padding-left:10px;
    padding-right: 10px;
    height: 700px;
  }
  .select-group {
    width: 200px;
    margin-right: 30px;
  }
  .search {
    margin-right: 10px;
  }
}
.inline{
  display: inline-block;
  vertical-align: middle;
}
.form-filter-group {
  margin-bottom: 18px;
  float: left;
  .filter-label{
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 80px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .filter-label-rank {
      width: 50px !important;
  }
  .form-control {
    width: 260px;
    margin-right: 30px;
  }
  .datepicker-input {
    width: 160px !important;
  }
}
.add-rule {
  margin: 10px 20px;
  padding: 10px 20px;
  text-align: center;
  border: 1px dashed #d8d8d8;
  cursor: pointer; 
}
.top-type {
  position: absolute; 
  display: inline-block;
  font-size: 0px;
  left: 850px;
  top: 166px;
  .up-type {
    display: inline-block;
    font-size: 14px;
    width: 120px;
    height: 34px;
    line-height: 36px;
    color: #444;
    border: 1px solid #ccc;
    border-right: none;    
    border-radius: 100px 0 0 100px;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: #ff5b5b;
      border: 1px solid #ff5b5b;
    }
    &.active {
      color: #fff;
      background-color:#ff5b5b;
      border: 1px solid #ff5b5b;
    }
  }
  .down-type {
    display: inline-block;
    width: 120px;
    height: 34px;
    line-height: 36px;
    text-align: center;
    border: 1px solid #ccc;
    border-left: none;
    color: #444;
    border-radius: 0px 100px 100px 0;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      color: #fff;
      background-color:#2ac993;
      border: 1px solid #2ac993;
    }
    &.active {
      color: #fff;
      background-color:#2ac993;
      border: 1px solid #2ac993;
    }
  }
}
.rule-list {
  padding: 0px 0px 10px 0px;
  text-align: left;
  .rule-item {
    span {
      padding-right: 20px;
    }
  }
  .row-noresult {
    padding: 10px 0 10px;
  }
}
.uprank-rule-list {
  .tr-header {
    th {
      text-align: right;
      padding-right: 20px;
      &:nth-child(1) {
        text-align: left;
        padding-right: 0px;
      }
      &:nth-child(2) {
        text-align: right;
        padding-right: 12px;
      }
    }
  }
  .tr-items {
    td {
      text-align: right;
      padding-right: 20px;
      padding-top: 10px;
      padding-bottom: 10px;
      &:nth-child(1) {
        text-align: left;
        padding-right: 0px;
      }
    }
  }
}
.uprank-block-search {
  width: 100%;
  margin-top: 10px; 
  .d-button + .d-button {
    margin-left: 0px;
  }
  .select-menu {
    max-height: 300px !important;
  }
}
.icon-positon {
  position: relative;
  font-size: 14px;
}
.summary {
  height: 77px;
  width: 60%;
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
</style>
