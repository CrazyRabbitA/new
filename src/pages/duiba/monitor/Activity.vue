<template>
   <div class="resources-main">
      <div class="search-area cf">
        <datepicker :value.sync="chartParams.date" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
        <div class="form-filter-group cf">
          <p class="filter-label fl filter-label-middle">活动类型：</p>
          <d-select :options.sync="actTypeArr" :value.sync="chartParams.activityType"></d-select>
        </div>
        <div class="form-filter-group cf">
          <p class="filter-label fl">活动标题：</p>
          <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "chartParams.title">
        </div>
        <div class="serch-btn serch-btn-hotspot">
          <d-button class="searchfilter" size="large" type="primary" @click="getChartList">查询</d-button>
        </div>
      </div>
     <div class="chart-area">
       <activity-line :chart-obj="chartObj" v-ref:resources :line-id="'activityLine'"></activity-line>
     </div>
     <div class="table-content">
       <div class="search-area cf">
         <div class="form-filter-group cf form-filter-group-mr10">
          <p class="filter-label fl filter-label-middle">活动类型：</p>
          <d-select :options.sync="actTypeArrs" :value.sync="params.activityType"></d-select>
        </div>
         <div class="form-filter-group cf">
           <p class="filter-label fl filter-label-big">活动标题：</p>
           <input type="text" class="form-control fl" placeholder="" v-model= "params.title">
         </div>
         <div class="form-filter-group cf">
           <p class="filter-label fl filter-label-small">appId：</p>
           <input type="text" class="form-control fl form-control-small" placeholder="" v-model= "params.appId">
         </div>
         <daterangepicker  :start.sync="params.date" :end.sync="params.endDate" :disabled-date="disabledDate" :range="30"></daterangepicker>
         <div class="serch-btn">
           <d-button class="searchfilter" size="large" type="primary" @click="getDataList">查询</d-button>
         </div>
       </div>
       <div class="table-area">
         <a href="javascript:;" @click="downTable" class="download fr"><i class="iconhandle mr2">&#xe606;</i>导出</a>
         <div class="table-warp">
          <table>
              <thead>
                <tr class="tr-header">
                  <template v-for="colum in columns">
                    <th>
                      <label class="sort-warp">
                        {{colum.title}}
                        <span class="sort-arrow" v-if="colum.sortable">
                          <i class="iconhandle sort-icon" :class="{on: params.orderType === 'asc' && colum.dataIndex === params.orderBy}" @click="handleSort(colum.dataIndex, 'asc')">&#xe617;</i>
                          <i class="iconhandle sort-icon" :class="{on: params.orderType === 'desc' && colum.dataIndex === params.orderBy}" @click="handleSort(colum.dataIndex, 'desc')">&#xe618;</i>
                        </span>
                      </label>
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody v-if="data && data.table && data.table.length !== 0">
                <tr class="tr-items" v-for="(index, item) in data.table" track-by="$index">
                  <template v-for="column in columns">
                    <template v-if="column.action">
                      <td>
                        <a target="_blank" v-link="{ path: '/duibamonitor/activity/area/' + item.appId + '/' + item.activityName + '/' + item.curDate}">{{item[column.dataIndex]}}</a>
                      </td>
                    </template>
                    <template v-else>
                      <td v-if="column.render">{{column.render(item[column.dataIndex])}}</td>
                      <td v-else>{{item[column.dataIndex]}}</td>
                    </template>
                  </template>
                </tr>
              </tbody>
          </table>
         </div>
         <tableempty v-if="!$loadingRouteData && (data && data.table && data.table.length === 0)"></tableempty>
         <d-pagination :total="totalList" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" ></d-pagination>
       <div>
     </div>
   </div>
   <loading :show="$loadingRouteData"></loading>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
import activityLine from './components/activityLine';
const columns = [
  {
    title: '数据更新时间',
    dataIndex: 'gmtModified'
  },
  {
    title: '日期',
    dataIndex: 'curDate'
  },
  {
    title: '活动标题',
    dataIndex: 'activityName'
  },
  {
    title: 'appId',
    dataIndex: 'appId'
  },
  {
    title: '媒体名称',
    dataIndex: 'appName'
  },
  {
    title: '活动总UV',
    dataIndex: 'totalUv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '活动参与人数',
    dataIndex: 'participateUv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '活动参与度',
    dataIndex: 'particpateRate',
    sortable: true,
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '活动人均参与次数',
    dataIndex: 'particpateTimes',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '活动请求数',
    dataIndex: 'participatePv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true,
    action: true
  },
  {
    title: '活动发券量',
    dataIndex: 'couponCount',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '付费发券量',
    dataIndex: 'payCoupon',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '微信券',
    dataIndex: 'weixinCoupon',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '免费券',
    dataIndex: 'freeCoupon',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '付费券发券成功率',
    dataIndex: 'payCouponSuccessRate',
    sortable: true,
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '当前消耗',
    dataIndex: 'adConsume',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '点击均价',
    dataIndex: 'clickPrice',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '点击率',
    dataIndex: 'clickRate',
    sortable: true,
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  }
];
const quotaArr = [
  {
    label: '活动总UV',
    id: 'totalUv'
  }, {
    label: '活动参与人数',
    id: 'participateUv'
  }, {
    label: '活动参与度',
    id: 'particpateRate'
  }, {
    label: '活动人均参与次数',
    id: 'particpateTimes'
  }, {
    label: '活动请求数',
    id: 'participatePv'
  }, {
    label: '活动发券量',
    id: 'couponCount'
  }, {
    label: '付费发券量',
    id: 'payCoupon'
  }, {
    label: '微信券',
    id: 'weixinCoupon'
  }, {
    label: '免费券',
    id: 'freeCoupon'
  }, {
    label: '付费券发券成功率',
    id: 'payCouponSuccessRate'
  }, {
    label: '当前消耗',
    id: 'adConsume'
  }, {
    label: '点击均价',
    id: 'clickPrice'
  }, {
    label: '点击率',
    id: 'clickRate'
  }
];
const actTypeArr = [
  {
    label: '开发者独立活动',
    id: 2
  },
  {
    label: '开发者自有活动',
    id: 1
  }
];
const actTypeArrs = [
  {
    label: '独立',
    id: 2
  },
  {
    label: '自有',
    id: 1
  }
];
export default {
  components: {
    activityLine
  },
  ready() {
    this.getDataList('ready');
    this.getChartList();
  },
  data() {
    return {
      columns: columns,
      actTypeArr: actTypeArr,
      actTypeArrs: actTypeArrs,
      totalList: 0,
      data: {},
      chartObj: {
        chartData: {},
        quotaArr: quotaArr,
        selectQuota: ''
      },
      chartParams: {
        title: '',
        date: '',
        activityType: ''
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        appId: '',
        date: '',
        endDate: '',
        orderType: '',
        orderBy: '',
        activityType: ''
      }
    };
  },
  methods: {
    disabledDate(date) {
      var now = new Date();
      return date.getTime() >= now.getTime();
    },
    onPageChange(page) {
      this.params.pageNum = page;
      this.getDataList();
    },
    handleSort(orderBy, orderType) {
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataList();
    },
    getDataList(type) {
      let isLoading = true;
      if (type === 'ready') {
        isLoading = false;
      }
      if (isLoading) { this.$loadingRouteData = true; };
      this.$http.post('/indact/table', this.params
      ).then((res) => {
        res = res.json();
        if (res.success) {
          if (isLoading) { this.$loadingRouteData = false; };
          this.$set('data', res.data);
          this.totalList = res.data.count;
        } else {
          if (isLoading) { this.$loadingRouteData = false; };
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        if (isLoading) { this.$loadingRouteData = false; };
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getChartList() {
      this.$loadingRouteData = true;
      this.$http.post('/indact/line', this.chartParams
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.$loadingRouteData = false;
          // 折线图数据
          this.chartObj.chartData.extPoint = res.data.extPoint;
          this.chartObj.chartData.sevAvePoint = res.data.sevAvePoint;
          this.chartObj.chartData.todPoint = res.data.todPoint;
          this.chartObj.chartData.yesPoint = res.data.yesPoint;
          this.dispatchLine();
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
    dispatchLine() {
      this.$refs.resources.selectQuotaChange();
    },
    downTable() {
      let goLink = `/indact/table/download?title=${this.params.title}&appId=${this.params.appId}&date=${this.params.date}&endDate=${this.params.endDate}`;
      window.open(goLink);
    }
  }
};
</script>
<style lang="less">
  .main {
    padding: 20px;
  }
  .resources-main {
    background-color: #fff;
    padding: 20px;
    .search-area {
      padding: 60px 0 20px 0;
      .form-filter-group {
        margin-bottom: 18px;
        float: left;
        .filter-label{
          font-size: 14px;
          font-weight: bold;
          color: #444;
          width: 84px;
          text-align: right;
          display: inline-block;
          vertical-align: top;
          margin-top: 10px;
        }
        .filter-label-small {
          width: 54px !important;
        }
        .filter-label-middle {
          width: 73px !important;
        }
        .filter-label-big {
          width: 70px;
        }
        .form-control {
          width: 120px;
          margin-right: 10px;
        }
        .form-control-small {
          width: 78px;
        }
        .datepicker-input {
          width: 160px !important;
        }
        .iconhandle {
          right: 26px;
        }
      }
      .serch-btn {
        float: right;
      }
    }
  }
  .sort-warp {
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
    .sort-arrow {
      display: inline-block;
      height: 20px;
      width: 12px;
      position: relative;
      vertical-align: middle;
      .sort-icon {
        position: absolute;
        display: inline-block;
        font-size: 12px;
        color: #ccc;
        height: 12px;
        line-height: 1;
        &:nth-child(2) {
          top: 6px;
        }
        &:hover {
          color: #000;
        }
        &.on {
          color: #39f;
        }
      }
    }
  }
  .table-area {
    .download {
      color: #657180;
      font-size: 16px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .table-warp {
      width: 100%;
      overflow-X: scroll;
      table {
        width: 2000px;
      }
    }
  }
  .table-warp::-webkit-scrollbar {
    height: 5px !important;
  }

  .table-content {
    .form-filter-group-mr10 {
      margin-right: 10px;
      .select-group {
        width: 75px;
        .iconhandle {
          right: 10px !important;
        }
      }
    }
  }
</style>


