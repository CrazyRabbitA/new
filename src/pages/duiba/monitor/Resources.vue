<template>
   <div class="resources-main">
     <div class="chart-area">
       <resources-line :resources-data="resourcesData" v-ref:resources :line-id="'resourcesLine'" :type="'type'"></resources-line>
     <div>
     <div class="table-content">
       <div class="search-area cf">
         <div class="form-filter-group cf">
           <p class="filter-label fl">主会场ID：</p>
           <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.mainmeetId">
         </div>
         <div class="form-filter-group cf">
           <p class="filter-label fl filter-label-big">主会场名称：</p>
           <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.title">
         </div>
         <div class="form-filter-group cf">
           <p class="filter-label fl">appId：</p>
           <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.appIds">
         </div>
         <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
         <div class="serch-btn">
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
                  <template v-if="column.action">
                    <td>
                      <a href="javascript:;" @click="showAppModel(item.mainmeetId, item.title, item.curDate)" v-if="column.dataIndex">{{item[column.dataIndex]}}</a>
                      <a href="javascript:;" @click="showTimeModel(item.mainmeetId, item.title, item.curDate)" v-else>点击查看该趋势</a>
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
         <tableempty v-if="!$loadingRouteData && (data && data.table && data.table.length === 0)"></tableempty>
         <d-pagination :total="totalList" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" ></d-pagination>
       <div>
     </div>
   </div>
   <loading :show="$loadingRouteData"></loading>
   <component :is="currentView" :modal-obj="modalObj" :show.sync="modalObj.show"></component>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
import resourcesLine from './components/resourcesLine';
import timeModal from './components/timeModal';
import appModal from './components/appModal';
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
    title: '主会场名称',
    dataIndex: 'title'
  },
  {
    title: '页面访问pv',
    dataIndex: 'pagePv'
  },
  {
    title: '页面访问uv',
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
  },
  {
    title: '开发者上架数',
    dataIndex: 'appCount',
    action: true
  },
  {
    title: '时间趋势',
    action: true
  }
];

export default {
  mixins: [],
  components: {
    resourcesLine,
    timeModal,
    appModal
  },
  ready() {
    this.getDataList();
  },
  data() {
    return {
      columns: columns,
      totalList: 0,
      data: {},
      currentView: '',
      resourcesData: {},
      modalObj: {
        mainmeetId: '',
        title: '',
        curDate: '',
        show: false,
        closeModal: ''
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        mainmeetId: '',
        title: '',
        appIds: '',
        extraDate: ''
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
    downTable() {
      let goLink = `/mainmeet/download?mainmeetId=${this.params.mainmeetId}&title=${this.params.title}&appIds=${this.params.appIds}&extraDate=${this.params.extraDate}`;
      window.open(goLink);
    },
    getDataList() {
      this.$loadingRouteData = true;
      this.$http.post('/mainmeet',
        this.params
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.$loadingRouteData = false;
          this.$set('data', res.data);
          this.totalList = res.data.count;
          // 折线图数据
          this.resourcesData.extPoint = res.data.extPoint;
          this.resourcesData.sevAvePoint = res.data.sevAvePoint;
          this.resourcesData.todPoint = res.data.todPoint;
          this.resourcesData.yesPoint = res.data.yesPoint;
          this.dispatchLine();
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
    showTimeModel(id, title, curDate) {
      this.currentView = '';
      setTimeout(() => {
        this.currentView = 'timeModal';
      }, 1);
      this.modalObj.mainmeetId = id;
      this.modalObj.title = title;
      this.modalObj.curDate = curDate;
      this.modalObj.show = true;
      this.modalObj.closeModal = this.closeModal;
    },
    showAppModel(id, title, curDate) {
      this.currentView = '';
      setTimeout(() => {
        this.currentView = 'appModal';
      }, 1);
      this.modalObj.mainmeetId = id;
      this.modalObj.title = title;
      this.modalObj.curDate = curDate;
      this.modalObj.closeModal = this.closeModal;
      this.modalObj.show = true;
    },
    closeModal() {
      this.modalObj.show = false;
      this.modalObj.mainmeetId = '';
      this.modalObj.title = '';
      this.modalObj.curDate = '';
      this.modalObj.show = false;
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
    .table-content {
      .search-area {
        padding: 60px 0 0 0;
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
          .filter-label-big {
            width: 92px;
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
      .table-area {
        .download {
          color: #657180;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
