<template>
  <div class="dashboard">
    <cfg-board  :chart-list.sync="chartList" :dash-borads.sync="dashBorads" :get-chart-list="getChartList" :get-dash-borads="getDashBorads" :get-current-borad="getCurrentBorad" :current-borad.sync="currentBorad" :biz="biz"></cfg-board>
    <div class="chart-warp" v-if="chartList.length > 0">
      <template v-for="(index, item) in chartList">
        <div class="chart-warp-list" :id="'q' + item.chartQueryId">
          <table-view :id.sync="item.chartQueryId" :is-not-dash-board="isNotDashBoard"></table-view>
        <div>
      </template>
    </div>
    <loading :show="!isNotDashBoard"></loading>
    <div class="iconnav go-top" @click="goTop">&#xe6d0;</div>
  </div>
</template>
<script>
import cfgBoard from './cfgBoard';
import tableView from './tableView';
import MessageBox from 'components/basic/MessageBox';

export default {
  components: {
    cfgBoard,
    tableView
  },
  ready() {
    this.getDashBorads();
    setTimeout(() => {
      this.isNotDashBoard = true;
    }, 2000);
  },
  props: {
    biz: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isNotDashBoard: false,
      currentBorad: {},
      dashBorads: [],
      dashBorad: {},
      chartList: []
    };
  },
  methods: {
    getDashBorads(index) {
      this.$http.get(`/chart/dashboards?biz=${this.biz}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            if (res.data.length === 0) {
              this.dashBorads = [];
              this.chartList = [];
              return;
            }
            // 构造选择
            res.data.forEach((item) => {
              item.isSelect = false;
              if (item.isDefault === true) {
                item.isSelect = true;
              }
            });
            this.dashBorads = res.data;
            this.getChartList(index);
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
    // params index 显示看板
    getCurrentBorad(index) {
      let id = '';
      this.isShowCurrent = false;
      if (index) {
        this.dashBorads.forEach(item => {
          if (item.id === index) {
            id = item.id;
            this.currentBorad = item;
            item.isSelect = true;
            this.currentBorad.getDashBorads = this.getDashBorads;
            this.currentBorad.dashBorads = this.dashBorads;
          } else {
            item.isSelect = false;
          }
        });
      } else {
        this.dashBorads.forEach(item => {
          if (item.isSelect) {
            id = item.id;
            this.currentBorad = item;
            this.currentBorad.getDashBorads = this.getDashBorads;
            this.currentBorad.dashBorads = this.dashBorads;
          }
        });
        // 如果没有默认看板
        if (id === '') {
          this.dashBorads[0].isSelect = true;
          id = this.dashBorads[0].id;
          this.currentBorad = this.dashBorads[0];
          this.currentBorad.getDashBorads = this.getDashBorads;
        }
      }
      return id;
    },
    getChartList(dashboradId) {
      this.isNotDashBoard = false;
      let id = '';
      // if (typeof (dashboradId) !== 'undefined') {
      //   id = dashboradId;
      // } else {
      id = this.getCurrentBorad(dashboradId);
      // }
      this.$http.get(`/chart/dashboard?id=${id}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            this.dashBorad = res.data;
            // 构造中图表
            res.data.chartList.forEach((item, index) => {
              item.isCurrentChart = false;
              if (index === 0) {
                item.isCurrentChart = true;
              }
            });
            this.chartList = res.data.chartList;
            setTimeout(() => {
              this.isNotDashBoard = true;
            }, 1000);
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
    goTop() {
      document.documentElement.scrollTop = 0;
    }
  }
};
</script>
<style lang="less" scoped>
.chart-warp-list {
  border: 1px solid #000;
  margin: 20px 0px;
  padding: 0px 20px 10px 20px;
}
.go-top {
  position: fixed;
  bottom: 30px;
  right: 40px;
  z-index: 1001;
  font-size: 40px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
}
.form-filter-group .iconhandle {
  right: 26px !important;
}
/* 样式 */
.table-warp {
  margin-top: 20px;
  padding: 52px 0;
  .ivu-table-cell {
    text-align: right;
  }
  .ivu-table td, .ivu-table th {
    text-align: right;
  }
}
.form-filter-group {
  margin-bottom: 18px;
  float: left;
  &.w310 {
    width: 310px !important;
  }
  .filter-label-add {
    padding: 0 6px;
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 120px !important;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .form-control-input {
    width: 160px !important;
    margin-right: 30px;
  }
  .datepicker-input {
    width: 160px !important;
  }
  .iconhandle {
    right: 26px !important;
  }
  .select-group {
    width: 160px !important;
    margin-right: 30px;
  }
}
.sql-search-btn {
  float: right;
}
.download {
  color: #657180;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top: 8px;
  &:hover {
    color: #ef6b3b !important;
  }
}
.field-warp {
  padding-top: 40px;
}
</style>

