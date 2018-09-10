<template>
   <div class="hotspot-main">
     <div class="chart-area">
       <AreaLoading :show="chartLoading"></AreaLoading>
       <hotspot-line :resources-data="resourcesData" v-ref:resources :line-id="'hotspotLine'" type="'all'"></hotspot-line>
     </div>
     <div class="table-content">
       <div class="search-area cf">
         <div class="form-filter-group cf form-filter-group-classes">
           <p class="filter-label fl">资源位名称：</p>
           <input type="text" class="form-control fl" placeholder="不输入显示全局" v-model= "params.floorName">
         </div>
         <datepicker :value.sync="params.extraDate" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
         <div class="serch-btn">
           <d-button class="searchfilter search-resources-btn" size="large" type="primary" @click="getData">查询</d-button>
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
                  <template v-if="column.action">
                    <td>
                      <a href="javascript:;" @click="showHotspotModel(item.curDate, item.appFloorName, item.floorName)" v-if="column.dataIndex">{{item[column.dataIndex]}}</a>
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
         <tableempty v-if="!tableLoading && (data && data.table && data.table.length === 0)"></tableempty>
       <div>
     </div>
   </div>
   <component :is="currentView" :hotspot-model-obj="hotspotModelObj" :show.sync="hotspotModelObj.show"></component>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
import hotspotLine from './components/hotspotLine';
import hotspotModel from './components/hotspotModel';
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
    title: '资源位名称',
    dataIndex: 'floorName'
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
    render: text => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '前七日点击率',
    dataIndex: 'lastSevenDayClickRate',
    sortable: true,
    render: text => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '同比增加',
    dataIndex: 'growth',
    sortable: true,
    render: text => {
      return parseFloat((text * 100).toPrecision(12)) + '%';
    }
  },
  {
    title: '资源位数量',
    dataIndex: 'count',
    sortable: true,
    action: true
  }
];
const classesArr = [
  {
    label: 'banner',
    id: 1
  },
  {
    label: 'icon',
    id: 2
  },
  {
    label: '商品区',
    id: 3
  },
  {
    label: '今日必抢',
    id: 4
  },
  {
    label: '活动楼层',
    id: 5
  },
  {
    label: '优惠券',
    id: 6
  },
  {
    label: '自定义楼层',
    id: 7
  },
  {
    label: '橱窗区',
    id: 8
  },
  {
    label: '游戏中心',
    id: 9
  },
  {
    label: '免单秒杀',
    id: 10
  },
  {
    label: '签到楼层',
    id: 11
  },
  {
    label: '弹层插件',
    id: 12
  },
  {
    label: '浮标',
    id: 13
  },
  {
    label: '推荐位',
    id: 14
  },
  {
    label: '其他',
    id: 15
  },
  {
    label: '所有',
    id: 'all'
  }
];
export default {
  mixins: [],
  components: {
    hotspotLine,
    hotspotModel
  },
  ready() {
    this.getDataList();
    this.getDataListPoint();
  },
  data() {
    return {
      columns: columns,
      classesArr: classesArr,
      classes: 'all',
      data: {},
      resourcesData: {},
      hotspotModelObj: {
        curDate: '',
        appFloorName: '',
        floorName: '',
        closeHotspotModel: '',
        show: false
      },
      currentView: '',
      params: {
        extraDate: '',
        floorName: '',
        orderType: '',
        orderBy: ''
      },
      chartLoading: false,
      tableLoading: false
    };
  },
  methods: {
    disabledDate(date) {
      var now = new Date();
      return date.getTime() >= now.getTime();
    },
    downTable() {
      let goLink = `/dpm/floor/table/download?floorName=${this.params
        .floorName}&extraDate=${this.params.extraDate}`;
      window.open(goLink);
    },
    getData() {
      this.getDataListPoint();
      this.getDataList();
    },
    getDataListPoint() {
      this.chartLoading = true;
      this.$http.post('/dpm/floor/point', this.params).then(
        res => {
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
        },
        res => {
          this.chartLoading = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    getDataList() {
      this.tableLoading = true;
      this.$http.post('/dpm/floor/table', this.params).then(
        res => {
          res = res.json();
          if (res.success) {
            this.tableLoading = false;
            this.$set('data', res.data);
            this.totalList = res.data.count;
          } else {
            this.tableLoading = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          this.tableLoading = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    dispatchLine() {
      // 画图
      this.$refs.resources.selectQuotaChange();
    },
    handleSort(orderBy, orderType) {
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataList();
    },
    showHotspotModel(curDate, appFloorName, floorName) {
      this.currentView = '';
      this.$nextTick(() => {
        this.currentView = 'hotspotModel';
      });
      this.hotspotModelObj.curDate = curDate;
      this.hotspotModelObj.appFloorName = appFloorName;
      this.hotspotModelObj.floorName = floorName;
      this.hotspotModelObj.show = true;
      this.hotspotModelObj.closeHotspotModel = this.closeHotspotModel;
    },
    closeHotspotModel() {
      this.hotspotModelObj.curDate = '';
      this.hotspotModelObj.appFloorName = '';
      this.hotspotModelObj.floorName = '';
      this.hotspotModelObj.show = false;
    }
  }
};
</script>
<style lang="less">
.main {
  padding: 20px;
}
.hotspot-main {
  background-color: #fff;
  padding: 20px;
  .chart-area {
    position: relative;
    height: 400px;
  }
  .form-filter-group-classes {
    margin-right: 40px;
  }
  .table-content {
    .search-area {
      padding: 100px 0 0px 0;
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
    .table-area {
      position: relative;
      .download {
        color: #657180;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 20px;
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
