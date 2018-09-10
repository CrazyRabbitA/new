<template>
<div class="datas-income">
  <pagetitle class="incometitle" title="大盘数据监控" :sub-title="newtime"></pagetitle>
  <div class="search-wrap">
    <daterangepicker :error-show.sync="errorShow" :start.sync="params.startDate" :disabled-date="disabledDate" :end.sync="params.endDate" :range="30"></daterangepicker>
    <div class="serch-btn">
      <d-button class="searchfilter" size="large" type="primary" @click="getTotalData" >查询</d-button>
    </div>
  </div>
  <div class="top-content">
    <div class="table-container">
      <div v-for="(index, table) in newTableList" class="table-slide" :class="{'active': table.isActive}" @click="choose(index, table.key, table.name, table.color)" :style="{color: table.color}">
        <div class="fix"></div>
        <div class="i-name">{{table.name}}</div>
        <div class="i-num" v-if="table.key !== 'dayStayRate' && table.key !== 'weekStayRate' && table.key !== 'activityUser'">{{numShow(table.key, table.num)}}</div>
        <!-- <div class="i-annotation"></div> -->
      </div>
    </div>
    <div class="total-data" v-show="dataShow">
      <div class="data-item">历史汇总
        <tooltip placement="top" content="自娃娃机上线以来的数据汇总"
         type="disable">
          <a href="javascript:void(0)" class="iconhandle disable">&#xe649;</a>
        </tooltip>：{{historyData}}</div>
      <div class="data-item">实时汇总
        <tooltip placement="top" content="当前所选时间段内的数据汇总"
         type="disable">
          <a href="javascript:void(0)" class="iconhandle disable">&#xe649;</a>
        </tooltip>
        ：{{realTimeData}}</div>
      <div class="data-item">{{totalName}}</div>
    </div>
  </div>

  <div id="main" class="income-chart" style="height:400px;width:100%"></div>

  <div class="table-wrap">
    <div class="export-wrap">
      <d-button class="export-btn" size="large" type="primary" @click="outputTxt">导出</d-button>
    </div>
    <i-table :data="tabledata" :columns= "columns1" @on-sort-change="sortchange"></i-table>
    <d-pagination :total="page.totalRecords" :current-page="page.current" :page-size="page.pageSize" @change="onPageChange"></d-pagination>
  </div>
  
  </div>
</template>

<script>
import chartsMixins from './mixins/chartsMixins';
import MessageBox from 'components/basic/MessageBox';
import Tooltip from 'components/basic/Tooltip';
import { _fixNum } from 'components/utils/cheatDataUtils';

export default {
  mixins: [chartsMixins],
  components: {
    Tooltip
  },
  data() {
    return {
      timeNum: +new Date(),
      // 表格所有数据
      newTableList: [
        {
          name: '日活跃用户',
          key: 'activityUser',
          isActive: false,
          color: '#2ac993',
          num: ''
        },
        {
          name: '次日留存',
          key: 'dayStayRate',
          isActive: false,
          color: '#ff5b5b',
          num: ''
        },
        {
          name: '周留存',
          key: 'weekStayRate',
          isActive: false,
          color: '#fe8002',
          num: ''
        },
        {
          name: '新增用户',
          key: 'newUser',
          isActive: false,
          color: '#60a4e8',
          num: ''
        },
        {
          name: '广告消耗',
          key: 'adConsume',
          isActive: false,
          color: '#ffbf55',
          num: ''
        },
        {
          name: '充值金额',
          key: 'chargeMoney',
          isActive: false,
          color: '#73cfca',
          num: ''
        },
        {
          name: '游戏币发行量',
          key: 'issueCoin',
          isActive: false,
          color: '#8291d9',
          num: ''
        }
      ],
      // 储存请求数据
      myresultData: {},
      params: {
        startDate: '',
        endDate: ''
      },
      page: {
        totalRecords: 0,
        current: 1,
        pageSize: 10
      },
      orderBy: 'curDate',
      orderType: 'asc',
      dataShow: false,
      realTimeData: '10000',
      historyData: '20000',
      columns1: [
        {
          title: '日期',
          key: 'curDate',
          sortable: false
        },
        {
          title: '新增用户',
          key: 'newUser',
          sortable: 'custom'
        },
        {
          title: '日活跃用户',
          key: 'activityUser',
          sortable: 'custom'
        },
        {
          title: '次日留存',
          key: 'dayStayRate',
          sortable: 'custom',
          render: (row, column, index) => {
            if (row.curDate === '时间段汇总') {
              return '-';
            } else {
              return parseFloat((row.dayStayRate * 100).toPrecision(12)).toFixed(2) + '%';
            }
          }
        },
        {
          title: '周留存',
          key: 'weekStayRate',
          sortable: true,
          render: (row, column, index) => {
            if (row.curDate === '时间段汇总') {
              return '-';
            } else {
              return parseFloat((row.weekStayRate * 100).toPrecision(12)).toFixed(2) + '%';
            }
          }
        },
        {
          title: '广告消耗',
          key: 'adConsume',
          sortable: true,
          render(row, column, index) {
            return _fixNum(row.adConsume);
          }
        },
        {
          title: '充值金额',
          key: 'chargeMoney',
          sortable: true,
          render(row, column, index) {
            return _fixNum(row.chargeMoney);
          }
        },
        {
          title: '游戏币发行量',
          key: 'issueCoin',
          sortable: true,
          render(row, column, index) {
            return _fixNum(row.issueCoin, 0);
          }
        }
      ],
      tabledata: [
      ],
      collect: {},
      totalName: ''
    };
  },
  route: {
    // data(transition) {
    //   this.realtime(transition);
    // }
  },
  computed: {
    newTime: function() {
      let date = new Date(this.timeNum);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      const formatstr = (num) => {
        return num > 9 ? num : '0' + num;
      };
      return (
        year +
        '年' +
        formatstr(month) +
        '月' +
        formatstr(day) +
        '日' +
        formatstr(h) +
        ':' +
        formatstr(m) +
        ':' +
        formatstr(s)
      );
    }
  },
  methods: {
    disabledDate(date) {
      var now = new Date();
      var currHour = now.getHours();
      now.setHours(0);
      date.setHours(currHour);
      return date.getTime() > now.getTime();
    },
    choose(index, key, name, color) {
      for (let item of this.newTableList) {
        item.isActive = false;
      }
      this.newTableList[index].isActive = true;
      this.updateChart(this.myresultData.linechart.realtime, key, name, color);
      if (key === 'activityUser' || key === 'dayStayRate' || key === 'weekStayRate') {
        this.dataShow = false;
      } else {
        this.dataShow = true;
        this.totalName = name;
        this.realTimeData = this.myresultData.linechart.collect.realtime[key];
        this.historyData = this.myresultData.linechart.collect.history[key];
      }
    },
    getTotalData() {
      this.$http
        .get(`/wawaji/cranegame/bigboard/collect?pageSize=${this.page.pageSize}&startDate=${this.params.startDate}&endDate=${this.params.endDate}`)
        .then(
        res => {
          res = res.json();
          if (res.success) {
            // this.chartInit();
            const data = res.data;
            this.myresultData = data;
            const realtimeTotalData = data.linechart.realtime;
            const resHistory = data.linechart.collect.history;
            const resRealtime = data.linechart.collect.realtime;
            this.newTableList[0].isActive = true;
            this.historyData = resHistory[this.newTableList[0].key];
            this.realTimeData = resRealtime[this.newTableList[0].key];
            this.newTableList.forEach(ele => {
              ele.num = resRealtime[ele.key];
            });
            this.chartInit(realtimeTotalData, 'newUser', '新增用户', '#60a4e8');
            let arr = data.table.data;
            this.collect = data.table.collect;
            arr.unshift(this.collect);
            this.tabledata = arr;
            this.page.totalRecords = data.table.count;
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
        );
    },
    outputTxt() {
      const p = `startDate=${this.params.startDate}&endDate=${this.params.endDate}&orderBy=curDate&orderType=asc`;
      const goLink = `/wawaji/cranegame/bigboard/table/download?${p}`;
      window.open(goLink);
    },
    sortchange(val) {
      if (val.order === 'normal') {
        this.orderBy = 'curDate';
        this.orderType = 'asc';
        this.getPageApp();
      } else {
        this.orderBy = val.key;
        this.orderType = val.order;
        this.getPageApp();
      }
    },
    /**
       * 分页
       */
    onPageChange(val) {
      // 当前页不发送请求
      if (val === this.page.current) {
        return;
      }
      this.page.current = val;

      this.getPageApp();
    },
    getPageApp() {
      let p = {};
      if (this.orderBy && this.orderType) {
        p = {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          pageNum: this.page.current,
          pageSize: this.page.pageSize,
          orderBy: this.orderBy,
          orderType: this.orderType
        };
      } else {
        p = {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          pageNum: this.page.current,
          pageSize: this.page.pageSize
        };
      }
      this.$http.post('/wawaji/cranegame/bigboard/table', p).then(
        res => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            this.tabledata = data.table;
            this.tabledata.unshift(this.collect);
          }
          this.$loadingRouteData = false;
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    numShow(name, num) {
      if (name === 'dayStayRate' || name === 'weekStayRate') {
        return `${num * 100} %`;
      }
      return num;
    }
  },
  ready() {
    const date = new Date();
    const pDate = new Date(date - 1000 * 60 * 60 * 24 * 7);
    const eDate = new Date(date - 1000 * 60 * 60 * 24 * 1);

    const formatstr = num => {
      return num > 9 ? num : '0' + num;
    };
    this.params.endDate = `${eDate.getFullYear()}-${formatstr(eDate.getMonth() + 1)}-${formatstr(eDate.getDate())}`;
    this.params.startDate = `${pDate.getFullYear()}-${formatstr(pDate.getMonth() + 1)}-${formatstr(pDate.getDate())}`;
    this.getTotalData();
  }
};
</script>

<style lang="less">
.main {
    background-color: #fff;
    padding: 20px;
    margin: 20px;
}
.datas-income {
  .top-content {
    overflow-x: hidden;
    margin: 40px 0 60px 0;
    padding: 10px 10px 20px 10px;
  }
  .table-container {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 50px;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 4px;
  }
  .table-slide {
    color: #fff;
    font-family: HiraginoSansGB-W3;
    font-size: 12px;
    width: 12%;
    min-width: 120px;
    height: 60px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    flex-grow: 1;
    flex-shrink: 0;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
    background-color: currentcolor;
    transition: all 0.4s linear;
    .i-annotation {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 1px 4px 0 rgba(41, 41, 41, 0.5);
      border-radius: 2px;
      padding: 6px;
      text-align: left;
      color: #666;
      font-size: 10px;
      margin-top: 4px;
      display: none;
    }
    & + .table-slide {
      margin-left: 16px;
    }
    &.active {
      box-shadow: 0 10px 20px -5px currentcolor;
      .fix:after {
        opacity: 1;
      }
    }
    &:hover {
      box-shadow: 0 10px 20px -5px currentcolor;
      .fix:after {
        opacity: 1;
      }
      .i-annotation {
        display: block;
      }
    }
    .fix {
      width: 0;
      height: 0;
      &:after {
        transition: opacity 0.4s linear;
        content: "";
        opacity: 0;
        display: block;
        position: absolute;
        z-index: 11;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top-color: currentcolor;
        left: 50%;
        bottom: -20px;
        transform: translateX(-50%);
      }
    }
    .i-name {
      margin-top: 12px;
      color: #fff;
      line-height: 1.5;
    }
    .i-num {
      margin-bottom: 12px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      line-height: 1.5;
    }
  }

  .incometitle {
    border-bottom: none;
    h2.has-sub-title {
      font-weight: bold;
      font-size: 16px;
      color: #444444;
    }
    .iconhandle {
      display: none;
    }
    .sub-title {
      font-size: 14px;
      color: #444444;
      font-weight: normal;
      margin-right: 9px;
    }
  }
  .rank-warp {
    position: relative;
    .rank {
      position: absolute;
      z-index: 1;
      top: -100px;
      right: 20px;
      cursor: pointer;
      color: #657180 !important;
      font-weight: normal;
      line-height: 1;
      &:hover {
        color: #ef6b3b;
      }
    }
    .top {
      position: absolute;
      z-index: 1;
      top: -60px;
      right: 20px;
      cursor: pointer;
      color: #657180 !important;
      font-weight: normal;
      line-height: 1;
      &:hover {
        color: #ef6b3b;
      }
    }
  }
  .income-chart {
    position: relative;
    top: -60px;
  }
  .search-wrap {
    margin-top: 20px;
    .serch-btn {
      float: right;
    }
  }
  .export-wrap {
    height: 40px;
    .export-btn {
      float: right;
    }
  }
  .total-data {
    .data-item {
      float: right;
      margin-right: 40px;
      font-size: 16px;
      .tooltip {
        font-size: 14px;
      }
    }
  }
}
</style>
