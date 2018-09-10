<template>
  <d-modal :title="title" effect="fade" :show.sync="show" width="1100" class="time-trend-modal" :on-ok="submit" :on-close="close">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="show-area-warp">
          <AreaLoading :show="chartLoading"></AreaLoading>
          <template v-if="isShowChart">
            <hotspot-line :resources-data="resourcesData" v-ref:resources :line-id="'hotsPotAppLine'"></hotspot-line>
          </template>
          <div class="table-content">
            <div class="search-area cf">
              <div class="form-filter-group cf">
                <p class="filter-label fl">app名称：</p>
                <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.appName">
              </div>
              <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
              <div class="serch-btn serch-btn-time-trend">
                <d-button class="searchfilter" size="large" type="primary" @click="getData">查询</d-button>
              </div>
            </div>
            <div class="table-area">
              <AreaLoading :show="tableLoading"></AreaLoading>
              <a href="javascript:;" @click="downTable" class="download fr"><i class="iconhandle mr2">&#xe606;</i>导出</a>
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
                        <td v-if="column.render">{{column.render(item[column.dataIndex])}}</td>
                        <td v-else>{{item[column.dataIndex]}}</td>
                      </template>
                    </tr>
                  </tbody>
              </table>
              <tableempty v-if="!tableLoading && (data && data.table && data.table.length === 0)"></tableempty>
              <d-pagination :total="totalList" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" ></d-pagination>
            <div>
          </div>
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
import { _fixNum } from 'components/utils/cheatDataUtils';
import coerceBoolean from 'components/utils/coerceBoolean.js';
import MessageBox from 'components/basic/MessageBox';
import hotspotLine from '../components/hotspotLine';
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
    title: '资源位类别',
    dataIndex: 'floorName'
  },
  {
    title: 'app名称',
    dataIndex: 'appName'
  },
  {
    title: 'appId',
    dataIndex: 'appId'
  },
  {
    title: '具体位置',
    dataIndex: 'appFloorName'
  },
  {
    title: '曝光pv',
    dataIndex: 'expPv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '曝光uv',
    dataIndex: 'expUv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '点击Pv',
    dataIndex: 'clickPv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '点击uv',
    dataIndex: 'clickUv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: 'pv点击率',
    dataIndex: 'pvClickRate',
    sortable: true,
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '前七日点击率',
    dataIndex: 'lastSevenDayClickRate',
    sortable: true,
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '同比增加',
    dataIndex: 'growth',
    sortable: true,
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  }
];
export default {
  components: {
    hotspotLine
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    hotspotAppModelObj: {
      type: Object,
      default: () => {}
    }
  },
  ready() {
    if (this.hotspotAppModelObj.appFloorName) {
      this.params.appFloorName = this.hotspotAppModelObj.appFloorName;
    }
    if (this.hotspotAppModelObj.curDate) {
      this.params.extraDate = this.hotspotAppModelObj.curDate;
    }
    if (this.hotspotAppModelObj.floorName) {
      this.params.floorName = this.hotspotAppModelObj.floorName;
    }
    this.getDataList();
    this.getDataListPoint();
  },
  computed: {
    title: function() {
      return '总览';
    }
  },
  data() {
    return {
      data: {},
      resourcesData: {},
      columns: columns,
      isShowChart: false,
      totalList: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        extraDate: '',
        appFloorName: '',
        appName: '',
        floorName: '',
        orderType: '',
        orderBy: ''
      },
      chartLoading: false,
      tableLoading: false
    };
  },
  methods: {
    submit() {
      this.show = false;
    },
    close() {
      this.show = false;
    },
    onPageChange(page) {
      this.params.pageNum = page;
      this.getDataList();
    },
    downTable() {
      let goLink = `/dpm/app/table/download?extraDate=${this.params.extraDate}&appFloorName=${this.params.appFloorName}&floorName=${this.params.floorName}&appName=${this.params.appName}`;
      window.open(goLink);
    },
    getData() {
      this.getDataList();
      this.getDataListPoint();
    },
    getDataListPoint() {
      this.chartLoading = true;
      this.$http.post('/dpm/app/point',
        this.params
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.chartLoading = false;
          // 折线图数据
          this.resourcesData.extPoint = res.data.extPoint;
          this.resourcesData.sevAvePoint = res.data.sevAvePoint;
          this.resourcesData.todPoint = res.data.todPoint;
          this.resourcesData.yesPoint = res.data.yesPoint;
          this.dispatchLine();
        } else {
          this.chartLoading = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.chartLoading = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getDataList() {
      this.tableLoading = true;
      this.isShowChart = true;
      this.$http.post('/dpm/app/table', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.data = res.data;
          this.tableLoading = false;
          this.totalList = res.data.count;
        } else {
          this.tableLoading = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.tableLoading = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    handleSort(orderBy, orderType) {
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataList();
    },
    dispatchLine() {
      let timer;
      clearTimeout(timer);
      timer = null;
      timer = setTimeout(() => {
        this.$refs.resources.selectQuotaChange();
      }, 1);
    }
  }
};
</script>

<style lang="less">
  .time-trend-modal {
    .modal-dialog {
      height: 500px;
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
    .search-area {
      padding: 60px 0 0px 0;
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
        .filter-label-big {
          width: 92px;
        }
        .form-control {
          width: 136px;
          margin-right: 10px;
        }
        .datepicker-input {
          width: 160px !important;
        }
        .iconhandle {
          right: 26px !important;
        }
      }
      .serch-btn {
        float: right;
      }
    }
    .show-area-warp {
      position: relative;
      .serch-btn-time-trend {
        margin-right: 500px;
      }
      height: 500px;
      overflow-y: scroll;
    }
    .table-area {
       .download {
         color: #657180;
         font-size: 16px;
         cursor: pointer;
         margin-bottom: 20px;
       }
    }
  }

</style>
