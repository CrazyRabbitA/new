<template>
  <div class="quwen-analyze">
    <div class="analyze-funnel">
      <div class="funnel-change">
        <div class="tap-list">
          <div class="tap-item" :class="{'active': isNew === true}" @click="chnageFunnelType(true, '新用户主路径漏斗');">新用户主路径漏斗</div>
          <div class="tap-item" :class="{'active': isNew === false}" @click="chnageFunnelType(false, '用户主路径漏斗');">用户主路径漏斗</div>
        </div>
      </div>
      <h1 class="title">漏斗图</h1>
      <div class="funnel-area cf">
        <div class="funnel-item funnel-left">
          <chart-funnel :chart-id="'left'" :title="funnelType" :is-new="isNew" :datatol="datatol" :fn="getTableList" v-ref:leftfunnel></chart-funnel>
        </div>
        <div class="funnel-item funnel-right">
          <template v-if="isShowCompar">
            <chart-funnel :chart-id="'right'" :title="funnelType" :is-new="isNew" :datatol="datatol"></chart-funnel>
            <div class="del-funnel-btn" @click="delFunnelAction">
              <i class="iconhandle">&#xe61d;</i>删除对比漏斗图
            </div>
          </template>
          <template v-else>
            <div class="add-funnel-btn" @click="addFunnelAction">
              <i class="iconhandle">&#xe762;</i>添加对比漏斗图
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="analyze-table">
      <h1 class="title">详细数据</h1>
      <div class="table-content">
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
                      </label>
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody v-if="dataTable && dataTable.length !== 0">
                <tr class="tr-items" v-for="(index, item) in dataTable" track-by="$index">
                  <template v-for="column in columns">
                    <template v-if="column.dataIndex === 'curDate'">
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
         <d-pagination :total="chartData.page.totalRecords" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" ></d-pagination>
       <div>
      </div>
    </div>
    <loading :show="$loadingRouteData"></loading>
  </div>
</template>
<script>
import chartFunnel from './components/chartFunnel.vue';
import { _fixNum } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
const columns = [
  {
    title: '日期',
    dataIndex: 'curDate'
  },
  {
    title: 'APP启动用户数',
    dataIndex: 'appStartUser',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    }
  },
  {
    title: 'APP启动用户数-登录用户数',
    dataIndex: 'startLoginPer'
  },
  {
    title: '登录用户数',
    dataIndex: 'loginUser',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    }
  },
  {
    title: '登录用户数-阅读文章/观看视频数',
    dataIndex: 'loginPartPer'
  },
  {
    title: '阅读文章/观看视频数',
    dataIndex: 'participateUserCt',
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    }
  },
  {
    title: '阅读文章/观看视频数-阅读文章/观看视频金币发放用户数',
    dataIndex: 'partCoinPer'
  },
  {
    title: '阅读文章/观看视频金币发放用户数',
    dataIndex: 'participateIssueUser',
    sortable: true,
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    }
  },
  {
    title: '阅读文章/观看视频金币发放用户数-提现用户数',
    dataIndex: 'issueCashPer'
  },
  {
    title: '提现用户数',
    dataIndex: 'cashUserCt',
    sortable: true,
    render: text => {
      if (text) {
        return _fixNum(text, 0);
      } else {
        return text;
      }
    }
  }
];
export default {
  components: {
    chartFunnel
  },
  ready() {
    this.getDashboard();
    this.getTableList();
  },
  data() {
    return {
      isNew: true,
      isShowCompar: false,
      funnelType: '新用户主路径漏斗',
      datatol: {
        appSources: [],
        appVersions: []
      },
      columns: columns,
      chartData: {
        page: {
          totalRecords: 0
        },
        total: {}
      },
      dataTable: [],
      params: {
        pageSize: 10,
        pageNum: 1
      }
    };
  },
  methods: {
    // 添加对比漏斗图
    addFunnelAction() {
      this.isShowCompar = true;
    },
    delFunnelAction() {
      this.isShowCompar = false;
    },
    // 切换对比漏斗图
    chnageFunnelType(isNew, title) {
      this.isNew = isNew;
      this.funnelType = title;
      // 表格刷新
      // this.getTableList();
    },
    getDashboard() {
      this.$loadingRouteData = true;
      this.$http.get('/quwen/funnelVS', {}).then(res => {
        res = res.json();
        if (res.success) {
          // 渠道
          if (
            res.data.appSources.length >= 5 &&
            res.data.appSources.length % 5 !== 0
          ) {
            const arr = new Array(5 - res.data.appSources.length % 5);
            res.data.appSources.push(...arr);
          }
          this.datatol.appSources = [];
          res.data.appSources.forEach((item) => {
            this.datatol.appSources.push({
              isActive: false,
              name: item
            });
          });
          // 版本
          if (
            res.data.appVersions.length >= 5 &&
            res.data.appVersions.length % 5 !== 0
          ) {
            const arr = new Array(5 - res.data.appVersions.length % 5);
            res.data.appVersions.push(...arr);
          }
          this.datatol.appVersions = [];
          res.data.appVersions.forEach((item) => {
            this.datatol.appVersions.push({
              isActive: false,
              name: item
            });
          });
          this.$loadingRouteData = false;
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
    getParams(page) {
      let appSources = [];
      let appVersions = [];
      this.$refs.leftfunnel.datatol.appSources.forEach(item => {
        if (item.isActive) {
          appSources.push(item.name);
        }
      });
      this.$refs.leftfunnel.datatol.appVersions.forEach(item => {
        if (item.isActive) {
          appVersions.push(item.name);
        }
      });
      let params = {
        appSources: appSources,
        appVersions: appVersions,
        startDate: this.$refs.leftfunnel.params.startDate,
        endDate: this.$refs.leftfunnel.params.endDate,
        userType: this.$refs.leftfunnel.params.userType,
        pageSize: 10,
        pageNum: page || 1
      };
      return params;
    },
    onPageChange(page) {
      this.params.pageNum = page;
      this.getTableList(page);
    },
    getTableList(page) {
      let params = this.getParams(page);
      this.$http.post('/quwen/analysis/detaildatalist', params).then(res => {
        res = res.json();
        this.chartData = res.data;
        this.dataTable = [];
        this.dataTable.push(res.data.total);
        this.dataTable = this.dataTable.concat(res.data.page.list);
      });
    },
    formatParams(data) {
      // 格式化参数
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
      }
      return arr.join('&');
    },
    // 下载
    downTable() {
      let params = this.formatParams(this.getParams());
      let goLink = `/quwen/analysis/detaildatadownload?${params}`;
      window.open(goLink);
    }
  }
};
</script>
<style lang="less">
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
}
.quwen-analyze {
  .analyze-funnel {
    .funnel-change {
      .tap-list {
        font-size: 0px;
        .tap-item {
          font-size: 16px;
          display: inline-block;
          border: 1px solid #999;
          border-left: none;
          padding: 4px 16px;
          cursor: pointer;
          &:nth-child(1) {
            border-left: 1px solid #999;
          }
          &.active {
            background-color: #ffc715;
            color: #fff;
          }
        }
      }
    }
    .title {
      padding: 40px 0;
    }
    .funnel-area {
      width: 100%;
      .funnel-item {
        display: inline-block;
        text-align: center;
        border: 1px solid #999;
        width: 48%;
        min-height: 668px;
        padding: 20px 20px 60px 20px;
      }
      .funnel-left {
        float: left;
      }
      .funnel-right {
        position: relative;
        float: right;
        .add-funnel-btn {
          position: absolute;
          width: 160px;
          height: 38px;
          line-height: 38px;
          cursor: pointer;
          color: #fff;
          background-color: #29b6b0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 2px;
        }
        .del-funnel-btn {
          position: absolute;
          width: 160px;
          height: 38px;
          line-height: 38px;
          cursor: pointer;
          color: #fff;
          background-color: #ef6b3b;
          bottom: 10px;
          right: 10px;
          border-radius: 2px;
        }
      }
    }
  }
  .analyze-table {
     .title {
       padding: 40px 0;
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
    .table-warp {
      width: 100%;
      overflow-X: scroll;
      table {
        width: 1700px;
        text-align: right;
        padding-right: 10px;
        th {
          text-align: right;
          &:last-child {
            padding-right: 40px;
          }
        }
        td {
          &:last-child {
            padding-right: 40px;
          }
        }
      }
      &::-webkit-scrollbar {
        height: 6px !important;
      }
    }
  }
}
</style>
