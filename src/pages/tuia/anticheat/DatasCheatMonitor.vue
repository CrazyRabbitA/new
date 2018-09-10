<template>
  
  <pagetitle title="防作弊监控-广告位" class="title"></pagetitle>
  <div class="page-content cheatmonitor">
    <div class="monitor-filter bottomline filter-style">
      <daterangepicker :error-show.sync="params2.errorShow" :start.sync="params2.startDate" :end.sync="params2.endDate" :range="90"></daterangepicker>
      <div class="cf inp-filter">
        <div class="form-filter-group form-filter-group-slot">
          <p class="filter-label fl  filter-label-slot">广告位ID：</p>
          <auto-input :input-class="'form-control fl'"  :result-list="slotIdList" :value.sync="params2.slotId"  @on-change="slotIdChange" @on-click="slotClick"></auto-input>
        </div>
        <div class="form-filter-group form-filter-group-slot">
          <p class="filter-label fl  filter-label-slot">广告位名称：</p>
          <auto-input :input-class="'form-control fl'" :result-list="slotNameList" :value.sync="params2.slotName"  @on-change="slotNameChange" @on-click="slotClick"></auto-input>
        </div>
        <div class="form-filter-group form-select-group">
          <d-select :options.sync="slotQuotaArr" :value.sync="params2.quota" class="fl"></d-select>
          <d-select :options.sync="judgeArr" :value.sync="params2.judge" class="fl"></d-select>
          <input type="text" class="form-control fl" v-model="params2.lowest">
        </div>
        <div class="fr">
          <d-button size="large" class="searchfilter"  type="primary" @click="doSlotfilter">开始查询</d-button>
        </div>
      </div>
      <div class="download-warp-more cf">
        <div class="download-warp">
          <d-button size="large" @click="openSlotCol">查看更多指标</d-button>
          <d-button size="large" type="primary" @click="pageSlotDownload">导出</d-button>
        </div>
      </div>
    </div>
    <i-table width="100%" :columns="cols2" :content="self" :data="tabledata2" @on-sort-change="sortchange2"></i-table>
    <d-pagination v-if="data2.page && data2.page.totalRecords" :total="data2.page.totalRecords" :current-page="params2.pageNum" :page-size="params2.pageSize" @change="onPageChange2"></d-pagination>
  </div>
  <pagetitle title="防作弊监控-媒体" class="title"></pagetitle>
  <div class="page-content cheatmonitor">
    <div class="monitor-filter bottomline filter-style">
      <daterangepicker :error-show.sync="params.errorShow" :start.sync="params.startDate" :end.sync="params.endDate" :range="90"></daterangepicker>
      <div class="cf inp-filter">
        <div class="form-filter-group form-filter-group-app">
          <p class="filter-label fl  filter-label-app">媒体ID：</p>
          <auto-input :input-class="'form-control fl'"  :result-list="appIdList" :value.sync="params.appId"  @on-change="appIdChange" @on-click="mediaClick"></auto-input>
        </div>
        <div class="form-filter-group form-filter-group-app">
          <p class="filter-label fl  filter-label-app">媒体名称：</p>
          <auto-input :input-class="'form-control fl'" :result-list="appNameList" :value.sync="params.appName"  @on-change="appNameChange" @on-click="mediaClick"></auto-input>
        </div>
        <div class="form-filter-group form-select-group">
          <d-select :options.sync="appQuotaArr" :value.sync="params.quota" class="fl"></d-select>
          <d-select :options.sync="judgeArr" :value.sync="params.judge" class="fl"></d-select>
          <input type="text" class="form-control fl" v-model="params.lowest">
        </div>
        <div class="fr">
          <d-button class="searchfilter" size="large" type="primary" @click="doMediafilter">开始查询</d-button>
        </div>
      </div>
      <div class="download-warp-more cf">
        <div class="download-warp">
          <d-button size="large" @click="openCol">查看更多指标</d-button>
          <d-button size="large" type="primary" @click="pageAppDownload">导出</d-button>
        </div>
      </div>
    </div>
    <i-table width="100%" :columns="cols" :content="self" :data="tabledata" @on-sort-change="sortchange"></i-table>
    <d-pagination v-if="data.page && data.page.totalRecords" :total="data.page.totalRecords" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange"></d-pagination>
  </div>
  <component :is="curView" title="" :show.sync="colModal.show" :on-close="colModal.onClose" :on-save="colModal.colSave" :isshow='showMask' :checkboxs="colModal.columns" :colskey="colModal.colskey"></component>
  <component :is="curColView" :modeldata="curColModal" :title="curColModal.title" :show.sync="curColModal.show" :on-close="onClose"></component>
  <downloadmodal :downloadmodal="downloadmodal" :paramsapp="params" :paramsslot="params2"></downloadmodal>
  <loading :show="$loadingRouteData"></loading>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import cheatmonitortablemixins from './mixins/cheatMonitorTableMixins';
  import cheatmonitormixins from './mixins/cheatMonitorMixins';
  import selectmixins from './mixins/selectMixins';
  import getCurDate from 'components/utils/getCurDate';
  import columnsmodal from './components/columnsModal';
  import downloadmodal from './components/downLoadModal';
  import autoInput from 'components/forms/autoInput';
  export default {
    components: {
      columnsmodal,
      downloadmodal,
      autoInput
    },
    mixins: [cheatmonitortablemixins, cheatmonitormixins, selectmixins],
    data() {
      return {
        self: this,
        showMask: false,
        // 媒体配置
        params: {
          appId: '',
          appName: '',
          lowest: 1000,
          quota: 'launchCount',
          judge: '1',
          startDate: getCurDate({day: -1}),
          endDate: getCurDate({day: -1}),
          sortContent: '',
          sortOrder: '',
          pageNum: 1,
          pageSize: 15
        },
        // 广告配置
        params2: {
          slotId: '',
          slotName: '',
          lowest: 1000,
          quota: 'launchCount',
          judge: '1',
          startDate: getCurDate({day: -1}),
          endDate: getCurDate({day: -1}),
          sortContent: '',
          sortOrder: '',
          pageNum: 1,
          pageSize: 15
        }
      };
    },
    route: {
      data: function(transition) {
        this.getCfg();
        this.getPageApp(transition);
        this.getPageSlot();
      }
    },
    methods: {
      getCfg() {
        if (localStorage.filterObj) {
          let filterObj = JSON.parse(localStorage.filterObj);
          this.params.quota = filterObj.quota;
          this.params.judge = filterObj.judge;
          this.params.lowest = filterObj.lowest;
        } else {
          let filterObj = {
            quota: this.params.quota,
            judge: this.params.judge,
            lowest: this.params.lowest
          };
          localStorage.filterObj = JSON.stringify(filterObj);
        }
        if (localStorage.filterObj2) {
          let filterObj2 = JSON.parse(localStorage.filterObj2);
          this.params2.quota = filterObj2.quota;
          this.params2.judge = filterObj2.judge;
          this.params2.lowest = filterObj2.lowest;
        } else {
          let filterObj2 = {
            quota: this.params2.quota,
            judge: this.params2.judge,
            lowest: this.params2.lowest
          };
          localStorage.filterObj2 = JSON.stringify(filterObj2);
        }
      },
      setCfg(type) {
        if (type === 'app') {
          let filterObj = {
            quota: this.params.quota,
            judge: this.params.judge,
            lowest: this.params.lowest
          };
          localStorage.filterObj = JSON.stringify(filterObj);
        } else {
          let filterObj2 = {
            quota: this.params2.quota,
            judge: this.params2.judge,
            lowest: this.params2.lowest
          };
          localStorage.filterObj2 = JSON.stringify(filterObj2);
        }
      },
      disabledDate(date) {
        var now = new Date();
        var currHour = now.getHours();
        now.setHours(0);
        date.setHours(currHour);
        return date.getTime() > now.getTime();
      },
      getPageApp(transition) {
        this.setCfg('app');
        this.$http.post('/cheat/monitor/app', this.params).then((res) => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            if (data.total) {
              data.page.list.unshift(data.total);
            }
            if (transition) {
              transition.next({
                'data': data
              });
            } else {
              this.$set('data', data);
            }
            this.$set('tabledata', data.page.list);
          } else {
            transition && transition.next();
            this.data = null;
          }
          this.$loadingRouteData = false;
        }, (res) => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      getPageSlot() {
        this.setCfg('slot');
        this.$http.post('/cheat/monitor/slot', this.params2).then((res) => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            if (data.total) {
              data.page.list.unshift(data.total);
            }
            this.$set('data2', data);
            this.$set('tabledata2', data.page.list);
          } else {
            MessageBox({
              title: '请求接口失败！',
              type: 'error'
            });
          }
          this.$loadingRouteData = false;
        }, (res) => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
       * 分页
       */
      onPageChange(val) {
        // 当前页不发送请求
        if (val === this.params.pageNum) {
          return;
        }
        this.params.pageNum = val;

        this.getPageApp();
      },
      /**
       * 分页
       */
      onPageChange2(val) {
        // 当前页不发送请求
        if (val === this.params2.pageNum) {
          return;
        }
        this.params2.pageNum = val;

        this.getPageSlot();
      }
    }
  };
</script>

<style lang="less">
.isRed{
  color:red;
}
  .cheatmonitor {
    .ivu-table-header {
      thead {
        th {
          text-align: right !important;
        }
      }
    }
    .searchfilter{
      background-color: #ef6b3b;
      border: 1px solid #ef6b3b;
    }
    .inp-filter {
      margin-top: 25px;
    }
    .download-warp-more {
      .download-warp {
         float: right;
      }
    }
    .filter-style {
      margin-bottom: 10px;
    }
    .filter-style .inp-filter {
    .select-group {
      width: 146px;
      margin-right: -1px;
    }
    .form-filter-group-app {
      .auto-complete .form-control {
        width: 120px !important;
      }
    }
    .form-filter-group-slot {
      .auto-complete .form-control {
        width: 110px !important;
      }
    }
    .filter-label {
      text-align: left;
      &.filter-label-app {
        width: 70px; 
      }
      &.filter-label-slot {
        width: 84px;
      }
    }
    .form-control {
      width: 200px;
      margin-right: 15px;
    }
    .form-filter-group {
      margin-bottom: 18px;
      &.form-select-group {
        .select-group {
          width: 201px;
          &:nth-child(1) {
            .select-menu {
              max-height: 350px;
            }
          }
          &:nth-child(2) {
            width: 78px;
            .iconhandle {
              right: 13px !important;
            }
          }
        }
        .form-control {
          width: 120px;
        }
      }
    }
    }
    .bottomline {
      padding-bottom: 15px;
    }
    th .ivu-table-cell {
      white-space: nowrap;
    }
    .appName {
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
    .tright{
      text-align: right;
      padding-right: 8px;
    }
    .pagination {
      background-color: #f5f7f9;
      border: 1px solid #d7dde4;
    }
  }
</style>
