<template>
  <div class="datas-newuser">
    <pagetitle class="incometitle" title="新用户主路径转化" :sub-title="newtime"></pagetitle>
    
    维度：
    <d-select :options.sync="selectArr" :value.sync="selectDimension" @select="selectDimensionChange"></d-select>
    
    <div class="chart-wrap">
      <div class="chart-item item-main">
        <div class="datepicker-wrap">
          <datepicker class="main-datepicker" :value.sync="mainStartDate" :disabled-date="disabledDate" rangeflag="true" :on-change="dateChange" placeholder="开始时间"></datepicker>
        </div>
        <div id="newuserMain" class="newuser-income-chart"></div>
      </div>
      <div class="chart-item item-other">
        <div class="add-bar-btn" @click="addbarAction" v-show="addBarBtnShow">
            <i class="iconhandle">&#xe762;</i>添加对比漏斗图
        </div>
        <div v-show="newuserCanvas2">
          <datepicker class="main-datepicker" :value.sync="mainStartDate2" :disabled-date="disabledDate" rangeflag="true" :on-change="dateChange2" placeholder="开始时间"></datepicker>
          <div id="newuserMain2" class="newuser-income-chart"></div>
        </div>
      </div>
    </div>
    <div class="search-wrap">
      <datepicker :value.sync="params.startDate" :disabled-date="disabledDate"  placeholder="开始时间"></datepicker>
      <datepicker :value.sync="params.endDate" :disabled-date="disabledDate"  placeholder="结束时间"></datepicker>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="primary" @click="getTotalData" >查询</d-button>
        <d-button class="searchfilter" size="large" type="primary" @click="outTotalData" >导出</d-button>
      </div>
    </div>
    <i-table border :columns="columns5" :data="data5" @on-sort-change="sortchange"></i-table>
    <d-pagination :total="page.totalRecords" :current-page="page.current" :page-size="page.pageSize" @change="onPageChange"></d-pagination>
  </div>
</template>

<script>
import newuserChart from './mixins/newuserChart';
import MessageBox from 'components/basic/MessageBox';
export default {
  mixins: [newuserChart],
  data() {
    return {
      selectArr: [
        {
          label: 'PV',
          id: 'pv'
        },
        {
          label: 'UV',
          id: 'uv'
        }
      ],
      params: {
        startDate: '',
        endDate: ''
      },
      page: {
        totalRecords: 0,
        current: 1,
        pageSize: 10,
        orderBy: 'curDate',
        orderType: 'asc'
      },
      rangeflag: true,
      selectDimension: 'uv',
      mainStartDate: '',
      mainStartDate2: '',
      newuserCanvas2: false,
      addBarBtnShow: true,
      collect: '',
      columns5: [
        {
          title: '日期',
          key: 'curDate'
        },
        {
          title: '广告投放',
          key: 'launch',
          sortable: 'custom'
        },
        {
          title: '广告点击',
          key: 'click',
          sortable: 'custom'
        },
        {
          title: '登录',
          key: 'login',
          sortable: 'custom'
        },
        {
          title: '进入房间',
          key: 'inroom',
          sortable: 'custom'
        },
        {
          title: '抓娃娃',
          key: 'finish',
          sortable: 'custom'
        },
        {
          title: '充值',
          key: 'charge',
          sortable: 'custom'
        }
      ],
      data5: [
      ]
    };
  },
  computed: {
    yesterdayTime() {
      let date = new Date();
      const eDate = new Date(date - 1000 * 60 * 60 * 24 * 1);
      const formatstr = (num) => {
        return num > 9 ? num : '0' + num;
      };
      let year = formatstr(eDate.getFullYear());
      let month = formatstr(eDate.getMonth() + 1);
      let day = formatstr(eDate.getDate());
      return `${year}-${month}-${day}`;
    }
  },
  methods: {
    selectDimensionChange() {
      this.getHopperList(this.mainStartDate, 'newuserMain');
      this.getHopperList(this.mainStartDate2, 'newuserMain2');
      this.getTableList();
    },
    getHopperList(time, dom) {
      const p = `extractDate=${time}&dimension=${this.selectDimension}`;
      this.$http
        .get(`/wawaji/cranegame/path/newuserpath/hopper?${p}`).then((res) => {
          res = res.json();
          if (res.success) {
            this.newuserChart(res.data.hopper, dom, 'newuser');
          }
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
    },
    getTableList() {
      const p = `startDate=${this.params.startDate}&endDate=${this.params.endDate}&dimension=${this.selectDimension}`;
      this.$http
        .get(`/wawaji/cranegame/path/newuserpath/table?${p}`).then((res) => {
          res = res.json();
          if (res.success) {
            let arr = res.data.table;
            this.collect = res.data.collect;
            arr.unshift(this.collect);
            this.data5 = arr;
            this.page.totalRecords = res.data.count;
          }
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
    },
    getTablewithpage(orderBy, orderType) {
      let p;
      if (orderBy && orderType) {
        p = {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          dimension: this.selectDimension,
          pageNum: this.page.current,
          pageSize: this.page.pageSize,
          orderBy,
          orderType
        };
      } else {
        p = {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          dimension: this.selectDimension,
          pageNum: this.page.current,
          pageSize: this.page.pageSize
        };
      }
      this.$http
        .post('/wawaji/cranegame/path/newuserpath/tablewithpage?', p).then((res) => {
          res = res.json();
          if (res.success) {
            let arr = res.data.table;
            arr.unshift(this.collect);
            this.data5 = arr;
          }
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
    },
    getTotalData() {
      this.getTableList();
    },
    outTotalData() {
      const p = `startDate=${this.params.startDate}&endDate=${this.params.endDate}&dimension=${this.selectDimension}&orderBy=curDate&orderType=asc`;
      const goLink = `/wawaji/cranegame/path/newuserpath/table/download?${p}`;
      window.open(goLink);
    },
    onPageChange(val) {
      // 当前页不发送请求
      if (val === this.page.current) {
        return;
      }
      this.page.current = val;
      this.getTablewithpage(this.page.orderBy, this.page.orderType);
    },
    sortchange(val) {
      // this.page.current = 1;
      if (val.order === 'normal') {
        this.page.orderBy = 'curDate';
        this.page.orderType = 'asc';
        this.getTablewithpage('curDate', 'asc');
      } else {
        this.page.orderBy = val.key;
        this.page.orderType = val.order;
        this.getTablewithpage(val.key, val.order);
      }
    },
    addbarAction() {
      this.newuserCanvas2 = true;
      this.addBarBtnShow = false;
      this.getHopperList(this.yesterdayTime, 'newuserMain2');
    },
    dateChange() {
      this.getHopperList(this.mainStartDate, 'newuserMain');
    },
    dateChange2() {
      this.getHopperList(this.mainStartDate2, 'newuserMain2');
    }
  },
  ready() {
    this.mainStartDate = this.yesterdayTime;
    this.mainStartDate2 = this.yesterdayTime;
    const date = new Date();
    const pDate = new Date(date - 1000 * 60 * 60 * 24 * 7);
    const eDate = new Date(date - 1000 * 60 * 60 * 24 * 1);
    const formatstr = num => {
      return num > 9 ? num : '0' + num;
    };
    this.params.endDate = `${eDate.getFullYear()}-${formatstr(eDate.getMonth() + 1)}-${formatstr(eDate.getDate())}`;
    this.params.startDate = `${pDate.getFullYear()}-${formatstr(pDate.getMonth() + 1)}-${formatstr(pDate.getDate())}`;
    this.getHopperList(this.yesterdayTime, 'newuserMain');
    this.getTableList();
  }
};
</script>

<style lang="less">
.main {
    background-color: #fff;
    padding: 20px;
    margin: 20px;
  }
.datas-newuser {
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
    margin: 20px 0;
    .serch-btn {
      float: right;
    }
  }
  .chart-wrap {
    padding: 50px 0;
    height: 600px;
    .chart-item {
      position: relative;
      width: 48%;
      height: 550px;
      border: 1px solid #eee;
    }
    .main-datepicker {
      margin: 10px;
    }
    .item-main {
      float: left;
    }
    .item-other {
      float: right;
    }
  }
  .add-bar-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    background: #29b6b0;
    border-radius: 2px;
    width: 160px;
    height: 38px;
    color: #fff;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
  }
  .del-bar-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: #ef6b3b;
    border-radius: 2px;
    width: 160px;
    height: 38px;
    color: #fff;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
  }
  .newuser-income-chart{
    width: 100%;
    height: 480px;
    p {
      padding: 100px;
      text-align: center;
    }
  }
}
</style>


