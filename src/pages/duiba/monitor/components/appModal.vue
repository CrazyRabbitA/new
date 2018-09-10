<template>
  <d-modal :title="title" effect="fade" :show.sync="show" width="1100" class="app-trend-modal" :on-ok="submit" :on-close="modalObj.closeModal">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="show-area-warp">
          <template v-if="isShowChart">
            <resources-line :resources-data="resourcesData" v-ref:resources :line-id="'appLine'"></resources-line>
          </template>
          <div class="table-content">
            <div class="search-area cf">
              <div class="form-filter-group cf">
                <p class="filter-label fl filter-label-1">appId：</p>
                <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.appIds">
              </div>
              <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
              <div class="serch-btn serch-btn-time-trend">
                <d-button class="searchfilter" size="large" type="primary" @click="getDataList">查询</d-button>
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
                        <td v-if="column.render">{{column.render(item[column.dataIndex])}}</td>
                        <td v-else>{{item[column.dataIndex]}}</td>
                      </template>
                    </tr>
                  </tbody>
              </table>
              <tableempty v-if="!loadingRouteDataApp && (data && data.table && data.table.length === 0)"></tableempty>
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
  <loading :show="loadingRouteDataApp"></loading>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
import MessageBox from 'components/basic/MessageBox';
import resourcesLine from '../components/resourcesLine';
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
    title: '开发者名称',
    dataIndex: 'appName'
  },
  {
    title: 'appId',
    dataIndex: 'appId'
  },
  {
    title: '页面pv',
    dataIndex: 'pagePv'
  },
  {
    title: '页面uv',
    dataIndex: 'pageUv'
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
    title: 'uv点击率',
    dataIndex: 'uvClickRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: 'uv流失率',
    dataIndex: 'wastageRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: 'pv点击率',
    dataIndex: 'mainmeetRate',
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
  components: {
    resourcesLine
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
    this.params.mainmeetId = this.modalObj.mainmeetId;
    this.params.extraDate = this.modalObj.curDate;
    this.params.title = this.modalObj.title;
    this.getDataList();
  },
  computed: {
    title: function() {
      return this.modalObj.title + '总览';
    }
  },
  data() {
    return {
      data: {},
      resourcesData: {},
      columns: columns,
      isShowChart: false,
      totalList: 0,
      loadingRouteDataApp: false,
      params: {
        extraDate: '',
        title: '',
        appIds: '',
        pageNum: 1,
        pageSize: 10,
        mainmeetId: ''
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
    downTable() {
      let goLink = `/mainmeet/app/download?mainmeetId=${this.params.mainmeetId}&title=${this.params.title}&appIds=${this.params.appIds}&extraDate=${this.params.extraDate}`;
      window.open(goLink);
    },
    getDataList() {
      this.loadingRouteDataApp = true;
      this.$http.post('/mainmeet/app', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.data = res.data;
          this.loadingRouteDataApp = false;
          this.totalList = res.data.count;
          // 折线图数据
          this.resourcesData.extPoint = res.data.extPoint;
          this.resourcesData.sevAvePoint = res.data.sevAvePoint;
          this.resourcesData.todPoint = res.data.todPoint;
          this.resourcesData.yesPoint = res.data.yesPoint;
          this.dispatchLine();
        } else {
          this.loadingRouteDataApp = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadingRouteDataApp = false;
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
    }
  }
};
</script>

<style lang="less">
  .app-trend-modal {
    .filter-label-1 {
      line-height: 1;
      width: 60px !important;
    }
    .modal-dialog {
      height: 500px;
    }
    .show-area-warp {
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
