<template>
  <div>
    <pagetitle class="incometitle" title="ROI数据监控" :sub-title="newtime"></pagetitle>
    <div class="search-wrap">
      <daterangepicker :error-show.sync="errorShow" :start.sync="params.startDate":disabled-date="disabledDate" :end.sync="params.endDate" :range="30"></daterangepicker>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="primary" @click="getList">查询</d-button>
      </div>
    </div>
    <div class="slide-wrap">
      <div class="slide" v-for="(index, item) in optionList" :class="{'active': item.isActive}" @click="dataChart(index, item.key, item.name)">
        {{item.name}}
        <div class="i-annotation">{{nameDes[index]}}</div>
      </div>
    </div>

    <div id="roiMain" class="income-chart" style="height:400px;width:100%"></div>

    <div class="table-wrap">
      <div class="export-wrap">
        <d-button class="export-btn" size="large" type="primary" @click="outputTxt">导出</d-button>
      </div>
      <i-table :data="tabledata" :columns="columns1" @on-sort-change="sortchange"></i-table>
      <d-pagination :total="page.totalRecords" :current-page="page.current" :page-size="page.pageSize" @change="onPageChange"></d-pagination>
    </div>

  </div>
</template>

<script>
import roiChart from './mixins/roiChart.js';
import MessageBox from 'components/basic/MessageBox';
import { _fixNum } from 'components/utils/cheatDataUtils';
const nameDes = [
  'ROI=每激活uv充值金额/每激活uv广告消耗',
  '每激活uv广告消耗=广告消耗／当天注册uv',
  '每激活uv充值金额=充值金额／激活uv'
];
export default {
  mixins: [roiChart],
  data() {
    return {
      timeNum: +new Date(),
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
      optionList: [
        {
          name: 'RIO数据',
          key: 'roi',
          isActive: false
        },
        {
          name: '每日激活的UV广告消耗',
          key: 'consumeUv',
          isActive: false
        },
        {
          name: '每日激活的UV充值金额',
          key: 'chargeUv',
          isActive: false
        }
      ],
      columns1: [
        {
          title: '日期',
          key: 'curDate'
        },
        {
          title: 'ROI数据',
          key: 'roi',
          sortable: 'custom',
          render(row, column, index) {
            return _fixNum(row.roi);
          }
        },
        {
          title: '每日激活UV广告消耗',
          key: 'consumeUv',
          sortable: 'custom',
          render(row, column, index) {
            return _fixNum(row.consumeUv);
          }
        },
        {
          title: '每日激活UV充值金额',
          key: 'chargeUv',
          sortable: 'custom',
          render(row, column, index) {
            return _fixNum(row.chargeUv);
          }
        }
      ],
      tabledata: [
      ],
      nameDes: nameDes
    };
  },
  computed: {
    newtime: function() {
      let date = new Date(this.timeNum);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      const formatstr = num => {
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
    getList() {
      this.$http.get(`/wawaji/cranegame/roi/collect?pageSize=${this.page.pageSize}&startDate=${this.params.startDate}&endDate=${this.params.endDate}`).then(res => {
        res = res.json();
        if (res.success) {
          const data = res.data;
          this.myresultData = data;
          this.chartInit(data.linechart, 'roi', 'RIO数据');
          this.optionList[0].isActive = true;
          this.tabledata = data.table.data;
          this.page.totalRecords = data.table.count;
        }
      });
    },
    dataChart(index, key, name) {
      for (let item of this.optionList) {
        item.isActive = false;
      }
      this.optionList[index].isActive = true;
      this.chartInit(this.myresultData.linechart, key, name);
    },
    onPageChange(val) {
      // 当前页不发送请求
      if (val === this.page.current) {
        return;
      }
      this.page.current = val;

      this.getPageApp();
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
      this.$http.post('/wawaji/cranegame/roi/table', p).then(
        res => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            this.tabledata = data.table;
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
    outputTxt() {
      const p = `startDate=${this.params.startDate}&endDate=${this.params.endDate}&orderBy=curDate&orderType=asc`;
      const goLink = `/wawaji/cranegame/roi/table/download?${p}`;
      window.open(goLink);
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
    this.params.startDate = `${pDate.getFullYear()}-${formatstr(
      pDate.getMonth() + 1
    )}-${formatstr(pDate.getDate())}`;
    this.getList();
    setInterval(() => {
      this.timeNum += 1000;
    }, 1000);
  }
};
</script>


<style lang="less">
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
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
.slide-wrap {
  margin: 40px 50px 150px;
  .slide {
    position: relative;
    float: left;
    margin-right: 20px;
    width: 240px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background-color: #8494d5;
    border-radius: 0.3rem;
    color: #fff;
    cursor: pointer;
    &:hover {
      .i-annotation {
        margin-top: 10px;
        display: block;
      }
      &::after {
        display: block;
      }
    }
    &::after {
      content: '';
      border-left: 9px solid transparent;
      border-top: 9px solid #8494d5;
      border-right: 9px solid transparent;
      border-bottom: 9px solid transparent;
      position: absolute;
      display: none;
      top:58px;
      left: 100px;
    }
  }
  .active{
    background-color: #fda228;
    &::after {
      border-top: 9px solid #fda228;
    }
  }
  .i-annotation {
    position: absolute;
    line-height: 2;
    z-index: 1;
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
}

</style>

