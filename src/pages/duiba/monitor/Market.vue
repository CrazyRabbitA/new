<template>
   <div class="resources-main">
    <div class="search-area cf">
      <d-select :options.sync="quotaArr" :value.sync="params.ptType" @select="selectQuotaChange"></d-select>
      <div class="form-filter-group cf">
        <p class="filter-label fl filter-label-small">appId：</p>
        <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.appId">
      </div>
      <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="primary" @click="getDataList">查询</d-button>
      </div>
     </div>
     <div class="chart-area">
       <resources-line :resources-data="resourcesData" v-ref:resources :collect-line="collectLine" :line-id="'resourcesLine'" :type="'type'"></resources-line>
     <div>
     <div class="table-content">
       <div class="table-area">
         <!-- <a href="javascript:;" @click="downTable" class="download fr"><i class="iconhandle mr2">&#xe606;</i>导出</a> -->
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
              <tbody v-if="dataTable && dataTable.length !== 0">
                <tr class="tr-items" v-for="(index, item) in dataTable" track-by="$index">
                  <template v-for="column in columns">
                    <template v-if="column.dataIndex === 'curDate' || column.dataIndex === 'dimension'">
                      <td>{{item[column.dataIndex]}}</td>
                    </template>
                    <template v-else>
                      <td v-if="column.render" class="text-right">{{column.render(item[column.dataIndex])}}</td>
                      <td v-else class="text-right">{{item[column.dataIndex]}}</td>
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
import resourcesLine from './components/marketLine';
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
    title: '数据维度',
    dataIndex: 'dimension'
  },
  {
    title: '曝光pv',
    dataIndex: 'exposurePv',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  },
  {
    title: '曝光uv',
    dataIndex: 'exposureUv',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  },
  {
    title: '活动访问pv',
    dataIndex: 'accessPv',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  },
  {
    title: '活动访问uv',
    dataIndex: 'accessUv',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  },
  {
    title: '活动参与PV',
    dataIndex: 'participatePv',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  },
  {
    title: '活动参与UV',
    dataIndex: 'participateUv',
    sortable: true
  },
  {
    title: '活动参与度',
    dataIndex: 'participatePercent',
    sortable: true,
    render: text => {
      if (text) {
        return parseFloat((text * 100).toPrecision(12)).toFixed(2) + '%';
      } else {
        return text;
      }
    }
  },
  {
    title: '付费券量',
    dataIndex: 'payCoupon',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  },
  {
    title: '付费券发券成功率',
    dataIndex: 'payCouponPercent',
    sortable: true,
    render: text => {
      if (text) {
        return parseFloat((text * 100).toPrecision(12)).toFixed(2) + '%';
      } else {
        return text;
      }
    }
  },
  {
    title: '福袋点击率',
    dataIndex: 'bagClickPercent',
    sortable: true,
    render: text => {
      if (text) {
        return parseFloat((text * 100).toPrecision(12)).toFixed(2) + '%';
      } else {
        return text;
      }
    }
  },
  {
    title: '复参(请求效率)',
    dataIndex: 'requestPercent',
    sortable: true,
    render: text => {
      if (text) {
        return _fixNum(text, 1);
      } else {
        return text;
      }
    }
  },
  {
    title: '消耗',
    dataIndex: 'consumeTotal',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    },
    sortable: true
  }
];
const quotaArr = [
  {
    label: '大盘总计',
    id: -1
  },
  {
    label: '积分商城',
    id: 10
  },
  {
    label: '独立活动',
    id: 1
  }
];
export default {
  mixins: [],
  components: {
    resourcesLine
  },
  ready() {
    this.getDataList();
  },
  data() {
    return {
      columns: columns,
      totalList: 0,
      collectLine: {},
      collect: {},
      data: {},
      dataTable: {},
      resourcesData: {},
      quotaArr: quotaArr,
      params: {
        pageNum: 1,
        pageSize: 10,
        appId: '',
        extraDate: '',
        ptType: '',
        orderBy: 'participateUv',
        orderType: 'desc'
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
      this.getDataListTable();
    },
    downTable() {
      let goLink = `/mainmeet/download?appId=${this.params
        .appId}&extraDate=${this.params.extraDate}`;
      window.open(goLink);
    },
    getDataListTable() {
      let ptType = -1;
      if (this.params.ptType === 10) {
        ptType = 0;
      } else {
        ptType = this.params.ptType;
      }
      this.$loadingRouteData = true;
      this.$http
        .post('/duiba/credits/independent/activity/realtime/table', {
          pageNum: this.params.pageNum,
          pageSize: this.params.pageSize,
          appId: this.params.appId,
          extraDate: this.params.extraDate,
          ptType: ptType,
          orderBy: this.params.orderBy,
          orderType: this.params.orderType
        })
        .then(
          res => {
            res = res.json();
            if (res.success) {
              this.$loadingRouteData = false;
              this.$set('dataTable', res.data.table);
              this.dataTable.unshift(this.collect);
              // 折线图数据
            } else {
              this.$loadingRouteData = false;
              MessageBox({
                title: res.desc,
                type: 'error'
              });
            }
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
    getDataList() {
      this.$loadingRouteData = true;
      let ptType = -1;
      if (this.params.ptType === 10) {
        ptType = 0;
      } else {
        ptType = this.params.ptType;
      }
      this.$http
        .post('/duiba/credits/independent/activity/realtime', {
          pageNum: this.params.pageNum,
          pageSize: this.params.pageSize,
          appId: this.params.appId,
          extraDate: this.params.extraDate,
          ptType: ptType,
          orderBy: this.params.orderBy,
          orderType: this.params.orderType
        })
        .then(
          res => {
            res = res.json();
            if (res.success) {
              this.$loadingRouteData = false;
              this.$set('data', res.data);
              this.$set('dataTable', res.data.table.data);
              this.$set('collect', res.data.table.collect);
              this.$set('collectLine', res.data.linechart.collect);
              this.dataTable.unshift(this.collect);
              this.totalList = res.data.table.count;
              // 折线图数据
              this.resourcesData.today = res.data.linechart.today;
              this.resourcesData.yestoday = res.data.linechart.yesterday;
              this.resourcesData.lastday = res.data.linechart.lastday;
              this.resourcesData['7avg'] = res.data.linechart['7avg'];
              this.dispatchLine();
            } else {
              this.$loadingRouteData = false;
              MessageBox({
                title: res.desc,
                type: 'error'
              });
            }
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
    handleSort(orderBy, orderType) {
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataListTable();
    },
    dispatchLine() {
      this.$refs.resources.selectQuotaChange();
    },
    selectQuotaChange() {
      this.getDataList();
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  padding: 20px;
}
.resources-main {
  background-color: #fff;
  padding: 20px;
  .search-area {
    padding: 60px 0 0 0;
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      .filter-label {
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
        width: 57px;
      }
      .form-control {
        width: 120px;
        margin-right: 10px;
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
  .table-content {
    margin-top: 20px;
    .table-area {
      .text-right {
        text-align: right;
        padding-right: 50px;
      }
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
          width: 1540px;
        }

      }
      .table-warp::-webkit-scrollbar {
        height: 5px !important;
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
  }
}
</style>
