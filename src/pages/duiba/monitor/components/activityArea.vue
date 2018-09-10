<template>
   <div class="resources-main">
     <div class="chart-area">
          <div :id="mapId" style="height:500px;width:100%;margin-top:20px;background-color:#efefef"></div>
     </div>
     <div class="table-content">
       <div class="search-area cf">
         <div class="form-filter-group cf">
           <p class="filter-label fl filter-label-middle">活动类型：</p>
           <d-select :options.sync="actTypeArr" :value.sync="params.activityType"></d-select>
         </div>
         <div class="form-filter-group cf">
           <p class="filter-label fl filter-label-big">活动标题：</p>
           <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.title">
         </div>
         <div class="form-filter-group cf">
           <p class="filter-label fl filter-label-small">appId：</p>
           <input type="text" class="form-control fl form-control-small" placeholder="不输入显示全局" v-model= "params.appId">
         </div>
         <daterangepicker :error-show.sync="errorShow" :start.sync="params.date" :end.sync="params.endDate" :disabled-date="disabledDate" :range="30"></daterangepicker>
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
                      <a href="javascript:;" @click="showActivityModel(item.appId, item.activityName, item.curDate, item.province)" v-if="column.dataIndex">{{item[column.dataIndex]}}</a>
                      <a href="javascript:;" @click="showActivityModel(item.appId, item.activityName, item.curDate, item.province)" v-else>点击查看该趋势</a>
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
       <div>
     </div>
   </div>
   <loading :show="$loadingRouteData"></loading>
   <component :is="currentView" :modal-obj="modalObj" :show.sync="modalObj.show"></component>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
import cheatMapMixins from '../mixins/cheatMapMixins';
import activityCity from './activityCity';
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
    title: '请求PV',
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
  },
  {
    title: '请求来源',
    dataIndex: 'province'
  },
  {
    title: '覆盖城市',
    dataIndex: 'cityCount',
    action: true,
    sortable: true
  },
  {
    title: '请求时间分布',
    action: true,
    sortable: true
  }
];
const actTypeArr = [
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
  mixins: [cheatMapMixins],
  components: {
    activityCity
  },
  ready() {
    this.getDataList();
  },
  data() {
    return {
      columns: columns,
      actTypeArr: actTypeArr,
      data: {},
      currentView: '',
      mapId: 'pvMap',
      resourcesData: {},
      modalObj: {
        appId: '',
        title: '',
        curDate: '',
        show: false,
        closeModal: ''
      },
      params: {
        title: this.$route.params.title,
        appId: this.$route.params.appId,
        date: this.$route.params.curDate,
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
    getDataList(mapRender) {
      this.$loadingRouteData = true;
      this.$http.post('/indact/location', this.params
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.$loadingRouteData = false;
          this.$set('data', res.data);
          // 地图数据
          if (mapRender !== false) {
            let mapData = res.data.map;
            this.renderMapChart(mapData);
          }
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
    showActivityModel(id, title, curDate, province) {
      this.currentView = '';
      setTimeout(() => {
        this.currentView = 'activityCity';
      }, 1);
      this.modalObj.appId = id;
      this.modalObj.title = title;
      this.modalObj.curDate = curDate;
      this.modalObj.province = province;
      this.modalObj.closeModal = this.closeModal;
      this.modalObj.show = true;
    },
    closeModal() {
      this.modalObj.show = false;
      this.modalObj.appId = '';
      this.modalObj.title = '';
      this.modalObj.curDate = '';
      this.modalObj.province = '';
      this.modalObj.show = false;
    },
    handleSort(orderBy, orderType) {
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataList(false);
    },
    downTable() {
      let goLink = `/indact/location/download?title=${this.params.title}&appId=${this.params.appId}&date=${this.params.date}&endDate=${this.params.endDate}`;
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
    .table-content {
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
            width: 63px !important;
          }
          .filter-label-middle {
            width: 73px;
          }
          .filter-label-big {
            width: 86px;
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
          .select-group {
            width: 75px;
            .iconhandle {
              right: 10px !important
            }
          }
        }
        .serch-btn {
          float: right;
        }
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


