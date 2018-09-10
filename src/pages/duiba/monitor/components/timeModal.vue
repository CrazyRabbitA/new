<template>
  <d-modal :title="title" effect="fade" :show.sync="show" width="1100" class="time-trend-modal" :on-ok="submit" :on-close="modalObj.closeModal">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="show-area-warp">
          <div class="time-trend-line-area">
            <div class="search-area search-area-time">
                <div class="form-filter-group cf">
                    <p class="filter-label fl filter-label-1 filter-label-samll">活动ID：</p>
                    <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "pointParams.activityId">
                </div>
                <datepicker :value.sync="pointParams.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
                <div class="serch-btn serch-btn-timemodal">
                  <d-button class="searchfilter" size="large" type="primary" @click="getDataPointList">查询</d-button>
                </div>
            </div>
            <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange"></d-select>
            <div id="timeTrendModalLine" style="height:400px;width:100%;margin-top:20px;"></div>
          </div>
          <div class="table-content">
            <div class="search-area cf">
              <div class="form-filter-group cf">
                <p class="filter-label fl filter-label-1">主会场ID：</p>
                <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "tableParams.mainmeetId">
              </div>
              <div class="form-filter-group cf">
                <p class="filter-label fl filter-label-1">主会场名称：</p>
                <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "tableParams.title">
              </div>
              <div class="form-filter-group cf">
                <p class="filter-label fl filter-label-1 filter-label-samll">appId：</p>
                <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "tableParams.appIds">
              </div>
              <datepicker :value.sync="tableParams.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
              <div class="serch-btn">
                <d-button class="searchfilter" size="large" type="primary" @click="getDataTableList">查询</d-button>
              </div>
            </div>
            <div class="table-area">
              <a href="javascript:;" @click="downTable" class="download fr"><i class="iconhandle mr2">&#xe606;</i>导出</a>
              <table>
                  <thead>
                    <tr class="tr-header">
                      <template v-for="colum in columns">
                        <th>{{colum.title}}</th>
                      </template>
                    </tr>
                  </thead>
                  <tbody v-if="data && data.table && data.table.length !== 0">
                    <tr class="tr-items" v-for="(index, item) in data.table" track-by="$index">
                      <template v-for="column in columns">
                        <td>{{item[column.dataIndex]}}</td>
                      </template>
                    </tr>
                  </tbody>
              </table>
              <tableempty v-if="!loadingRouteDataTimeModal && (data && data.table && data.table.length === 0)"></tableempty>
              <d-pagination :total="totalList" :current-page="tableParams.pageNum" :page-size="tableParams.pageSize" @change="onPageChange" ></d-pagination>
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
  <loading :show="loadingRouteDataTimeModal"></loading>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
import MessageBox from 'components/basic/MessageBox';
import cheatTimeModalLineMinxins from '../mixins/cheatTimeModalLineMinxins.js';
import timeModalLineMinxins from '../mixins/timeModalLineMinxins.js';
const quotaArr = [
  {
    label: '曝光pv',
    id: 'expPv'
  }, {
    label: '曝光uv',
    id: 'expUv'
  }, {
    label: '点击pv',
    id: 'clickPv'
  }, {
    label: '点击uv',
    id: 'clickUv'
  }, {
    label: '点击率',
    id: 'uvClickRate'
  }, {
    label: '人均进入主会场次数',
    id: 'perTimes'
  }
];
const columns = [
  {
    title: '数据更新时间',
    dataIndex: 'gmtModified'
  },
  {
    title: '活动名称',
    dataIndex: 'activityTitle'
  },
  {
    title: '活动id',
    dataIndex: 'activityId'
  },
  {
    title: '曝光pv',
    dataIndex: 'expPv'
  },
  {
    title: '曝光uv',
    dataIndex: 'expUv'
  },
  {
    title: '点击pv',
    dataIndex: 'clickPv'
  },
  {
    title: '点击uv',
    dataIndex: 'clickUv'
  },
  {
    title: '点击率',
    dataIndex: 'uvClickRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '人均进入主会场次数',
    dataIndex: 'perTimes'
  }
];
export default {
  mixins: [
    cheatTimeModalLineMinxins,
    timeModalLineMinxins
  ],
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
    this.pointParams.mainmeetId = this.modalObj.mainmeetId;
    this.pointParams.extraDate = this.modalObj.curDate;
    this.pointParams.title = this.modalObj.title;
    this.tableParams.mainmeetId = this.modalObj.mainmeetId;
    this.tableParams.extraDate = this.modalObj.curDate;
    this.tableParams.title = this.modalObj.title;
    this.tableParams.appIds = this.modalObj.appIds;
    this.getDataPointList();
    this.getDataTableList();
  },
  computed: {
    title: function() {
      return this.modalObj.title + '实时数据趋势';
    }
  },
  data() {
    return {
      loadingRouteDataTimeModal: false,
      data: {},
      resourcesData: {},
      columns: columns,
      quotaArr: quotaArr,
      totalList: 0,
      selectQuota: 'expPv',
      selectQuotaName: '',
      pointParams: {
        extraDate: '',
        mainmeetId: '',
        title: '',
        activityId: ''
      },
      tableParams: {
        extraDate: '',
        pageNum: 1,
        pageSize: 10,
        mainmeetId: '',
        title: '',
        appIds: ''
      }
    };
  },
  methods: {
    submit() {
      this.show = false;
    },
    getDataPointList() {
      this.loadingRouteDataTimeModal = true;
      this.$http.post('/mainmeet/activity/point', this.pointParams).then((res) => {
        res = res.json();
        if (res.success) {
          this.loadingRouteDataTimeModal = false;
          this.resourcesData = res.data.point;
          this.selectQuotaChange();
        } else {
          this.loadingRouteDataTimeModal = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadingRouteDataTimeModal = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    downTable() {
      let goLink = `/mainmeet/activity/table/download?mainmeetId=${this.tableParams.mainmeetId}&title=${this.tableParams.title}&appIds=${this.tableParams.appIds}&extraDate=${this.tableParams.extraDate}`;
      window.open(goLink);
    },
    getDataTableList() {
      this.loadingRouteDataTimeModal = true;
      this.$http.post('/mainmeet/activity/table', this.tableParams).then((res) => {
        res = res.json();
        if (res.success) {
          this.loadingRouteDataTimeModal = false;
          this.$set('data', res.data);
          this.totalList = res.data.count;
        } else {
          this.loadingRouteDataTimeModal = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadingRouteDataTimeModal = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getQuotaName() {
      quotaArr.forEach(item => {
        if (item.id === this.selectQuota) {
          this.selectQuotaName = item.label;
        }
      });
    },
    selectQuotaChange() {
      this.getQuotaName();
      this.getResourcesDate(this.resourcesData, this.selectQuota, this.selectQuotaName);
    },
    onPageChange(page) {
      this.tableParams.pageNum = page;
      this.getDataTableList();
    }
  }
};
</script>

<style lang="less">
  .time-trend-modal {
    .modal-dialog {
      height: 460px;
    }
   .show-area-warp {
      height: 500px;
      overflow-y: scroll;
    }
   .filter-label-1 {
     line-height: 1;
   }
   .filter-label-samll {
     width: 60px !important;
   }
   .search-area-time {
     padding: 20px 0 20px 0 !important;
   }
   .serch-btn-timemodal {
      float: none !important;
      margin-left: 10px;
      display: inline-block;
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
