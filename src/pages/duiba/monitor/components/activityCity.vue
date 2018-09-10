<template>
  <d-modal :title="title" effect="fade" :show.sync="show" width="1000" class="city-modal" :on-ok="submit" :on-close="modalObj.closeModal">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="show-area-warp">
          <div class="search-area cf search-area-pd10">
            <datepicker :value.sync="params.date" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
            <div class="form-filter-group cf form-filter-group-mr10">
              <p class="filter-label fl filter-label-middle">活动类型：</p>
              <d-select :options.sync="actTypeArr" :value.sync="params.activityType"></d-select>
            </div>
            <div class="serch-btn serch-btn-city">
              <d-button class="searchfilter" size="large" type="primary" @click="getDataList">查询</d-button>
            </div>
          </div>
          <template v-if="isShowChart">
            <activity-line :chart-obj="chartObj" v-ref:resources :line-id="'activityLine'"></activity-line>
          </template>
          <div class="table-content">
            <div class="table-area">
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
              <tableempty v-if="!loadingRouteDataCity && (data && data.table && data.table.length === 0)"></tableempty>
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
  <loading :show="loadingRouteDataCity"></loading>
</template>

<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import coerceBoolean from 'components/utils/coerceBoolean.js';
import MessageBox from 'components/basic/MessageBox';
import activityLine from '../components/activityLine';
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
    dataIndex: 'appId',
    sortable: true
  },
  {
    title: '媒体名称',
    dataIndex: 'appName',
    sortable: true
  },
  {
    title: '覆盖城市',
    dataIndex: 'city',
    sortable: true
  },
  {
    title: '请求pv',
    dataIndex: 'accessPv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '请求uv',
    dataIndex: 'accessUv',
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  }
];
const quotaArr = [
  {
    label: '请求pv',
    id: 'accessPv'
  }, {
    label: '请求uv',
    id: 'accessUv'
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
export default {
  components: {
    activityLine
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    modalObj: {
      type: Object,
      default: () => {}
    }
  },
  ready() {
    this.params.title = this.modalObj.title;
    this.params.appId = this.modalObj.appId;
    this.params.date = this.modalObj.curDate;
    this.params.province = this.modalObj.province;
    this.getDataList();
  },
  data() {
    return {
      data: {},
      columns: columns,
      actTypeArr: actTypeArr,
      isShowChart: false,
      totalList: 0,
      loadingRouteDataCity: false,
      params: {
        date: '',
        endDate: '',
        title: '',
        appId: '',
        province: '',
        pageNum: 1,
        pageSize: 10,
        orderType: '',
        orderBy: ''
      },
      chartObj: {
        quotaArr: quotaArr,
        columns: columns,
        chartData: {}
      }
    };
  },
  methods: {
    submit() {
      this.show = false;
    },
    onPageChange(page) {
      this.params.pageNum = page;
      this.getDataList();
    },
    getDataList() {
      this.loadingRouteDataCity = true;
      this.$http.post('/indact/location/city', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.data = res.data;
          this.loadingRouteDataCity = false;
          this.totalList = res.data.count;
          // 折线图数据
          this.chartObj.chartData.extPoint = res.data.extPoint;
          this.chartObj.chartData.sevAvePoint = res.data.sevAvePoint;
          this.chartObj.chartData.todPoint = res.data.todPoint;
          this.chartObj.chartData.yesPoint = res.data.yesPoint;
          this.dispatchLine();
        } else {
          this.loadingRouteDataCity = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadingRouteDataCity = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    dispatchLine() {
      let timer;
      clearTimeout(timer);
      timer = null;
      this.isShowChart = true;
      timer = setTimeout(() => {
        this.$refs.resources.selectQuotaChange();
      }, 1);
    },
    downTable() {
      let goLink = `/indact/location/city/download?title=${this.params.title}&appId=${this.params.appId}&date=${this.params.date}&endDate=${this.params.endDate}&province=${this.params.province}`;
      window.open(goLink);
    },
    handleSort(orderBy, orderType) {
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataList();
    }
  }
};
</script>

<style lang="less">
  .city-modal {
    .modal-dialog {
      height: 500px;
    }
    .show-area-warp {
      .serch-btn-city {
        display: inline-block;
        margin-left: 20px;
        float: none !important;
      }
      height: 500px;
      overflow-y: scroll;
    }
    .search-area-pd10 {
      padding-top: 10px !important;
    }
    .form-filter-group-mr10 {
      margin-right: 10px;
      .select-group {
        width: 160px !important;
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
  }

</style>
