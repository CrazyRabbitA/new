<template>
  <div >
    <time-select :time-obj.sync="timeObj" :button-time="buttonTime"></time-select>
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">页面类型：</p>
        <d-select :options.sync="skinArr" :value.sync ="params.pageType" :disabled="true"></d-select>
      </div>
      <div class="form-filter-group">
        <p class="filter-label short fl"></p>
        <d-select :options.sync="activityArr" :value.sync ="params.skinId" ></d-select>
      </div>
      <d-button class="searchfilter" size="large" type="warning" @click="getDataList" >查询</d-button>
      </div>
    <div class="cf">
              <div class="form-filter-group">

      <p class="filter-label fl">过滤条件：</p>
        <input :class="'form-control fl'" placeholder="活动ID(非必填)" v-model="params.pageId">
      </div>
      <div class="form-filter-group">
        <p class="filter-label short fl"></p>
        <input :class="'form-control fl'" placeholder="广告位ID(非必填)"  v-model="params.slotId" >
      </div>
      <div class="form-filter-group">
        <p class="filter-label short fl"></p>
        <input :class="'form-control fl'" placeholder="媒体ID(非必填)"  v-model="params.appId" >
      </div>
    </div>
    <div class="cf">
        <div class="form-filter-group">
      <p class="filter-label fl">页面粒度：</p>
        <d-select :options.sync="scaleArr" :value.sync ="params.dimension" ></d-select>
      </div>
    </div>
    <div class="cf">
       <table class="mytable">
      <tr>
        <th>页面类型</th>
        <th>皮肤类型</th>
        <th>活动标题</th>
        <th>活动ID</th>
        <th>广告位名称</th>
        <th>广告位ID</th>
        <th>媒体名称</th>
        <th>媒体ID</th>
      </tr>
      <tr>
        <td>{{showDetail.pageType}}</td>
        <td>{{showDetail.skinName}}</td>
        <td>{{showDetail.pageTitle}}</td>
        <td>{{showDetail.pageId}}</td>
        <td>{{showDetail.slotName}}</td>
        <td>{{showDetail.slotId}}</td>
        <td>{{showDetail.appName}}</td>
        <td>{{showDetail.appId}}</td>
      </tr>
      </table>
    </div>
    <div class="heatmap-chart" v-show="isShowHeatMap">
      <div class="heatmapBox">
        <iframe  id="heatmapWarp" :src="iframeurl" frameborder="0" v-show="selected" scrolling="no"></iframe>
        <div id="heatmapContainer" @mousemove="showPoint($event)" @mouseleave="hidePoint($event)" v-bind:style="{ backgroundImage:'url('+bgurl+')' }"  v-show="selectedPv">
          <div class="tip" id="pvtip" v-show="pvTip.pvTipShow" v-bind:style="{ left: leftSize+'px', top: topSize +'px' }">{{"点击PV："+pvTip.value}}</div>
        </div>
        <iframe id="heatmapWarp1" :src="iframeurl" frameborder="0"  v-show="selected" scrolling="no"></iframe>
        <div id="heatmapContainer1" @mousemove="showPoint($event)" @mouseleave="hidePoint($event)" v-bind:style="{ backgroundImage:'url('+bgurl+')' }" v-show="selectedUv">
          <div class="tip" id="uvtip" v-show="uvTip.uvTipShow" v-bind:style="{ left: leftSize+'px', top: topSize +'px' }">{{"点击UV："+uvTip.value}}</div>
        </div>
      </div>
    </div>
    <loading :show="$loadingRouteData"></loading>
    <!-- <quota-modal :show.sync="isShowQuotaModal" :check-list="checkList" :on-ok="dispatchLine"></quota-modal> -->
  </div>
</template>
<script>
import timeSelect from './selectTime';
import autoInput from '../../monitor/components/autoInput';
import quotaModal from './quotaModal';
import MessageBox from 'components/basic/MessageBox';
import _heatmap from 'components/utils/heatmap.min.js'; /* eslint-disable */

const skinArr = [
  {
    label: '活动',
    id: 0
  },
  {
    label: '主会场',
    id: 1
  },
  {
    label: '活动中心',
    id: 2
  },
  {
    label: '直投页',
    id: 3
  }
];
const scaleArr = [
  {
    label: '25*50',
    id: 4
  },
  {
    label: '20*40',
    id: 3
  },
  {
    label: '15*30',
    id: 2
  },
  {
    label: '10*20',
    id: 1
  }
];
const quotas = [
  {
    title: '页面PV热力图',
    id: 'pvHeatMap'
  },
  {
    title: '页面UV热力图',
    id: 'uvHeatMap'
  }
];
export default {
  components: {
    timeSelect,
    autoInput,
    quotaModal
  },
  data() {
    return {
      data: {},
      pointListPv: {
        min: 0,
        max: 0,
        data: []
      },
      leftSize: 0,
      topSize: 0,
      isShowHeatMap: false,
      pointListUv: {
        min: 0,
        max: 0,
        data: []
      },
      showDetail: {
        pageId: '-',
        pageType: '-',
        pageTitle: '-',
        skinType: '-',
        skinName: '-',
        slotId: '-',
        slotName: '-',
        appId: '-',
        appName: '-'
      },
      appNameList: [],
      slotIdList: [],
      slotNameList: [],
      skinArr: skinArr,
      activityArr: [],
      scaleArr: scaleArr,
      pvTip: {
        value: '',
        pvTipShow: false
      },
      uvTip: {
        value: '',
        uvTipShow: false
      },
      selectedUv: true,
      selected: true,
      selectedPv: true,
      heatmap: '',
      timeObj: {
        startDate: '',
        endDate: ''
      },
      params: {
        appId: '',
        pageId: '',
        slotId: '',
        pageType: 0,
        dimension: 4,
        skinId: 6
      },
      iframeurl: '',
      bgurl: '',
      quotas: quotas,
      isShowQuotaModal: false,
      buttonTime: true,
      domHeight:600,
      dimension: {
        xScale: 0,
        yScale: 0,
        radius: 0
      }
    };
  },
  methods: {
    getDataList() {
      this.$loadingRouteData = true;
      this.$http
        .get(
          `/page/heatMap/getData?beginDate=${this.timeObj.startDate}&endDate=${
            this.timeObj.endDate
          }`,
          {
            params: this.params
          }
        )
        .then(
          res => {
            this.$loadingRouteData = false;
            res = res.json();
            this.data = {};
            this.pointListPv.data = [];
            this.pointListUv.data = [];
            if (res.success) {
              this.data = res.data.axisList;
              this.isShowHeatMap = true;
              this.params.dimension = res.data.dimension;
              this.params.skinId==27?this.domHeight = 758:this.domHeight = 600;
              switch (this.params.dimension) {
                case 1:
                  this.dimension.xScale = 10;
                  this.dimension.yScale = 20;
                  this.dimension.radius = 75;
                  break;
                case 2:
                  this.dimension.xScale = 15;
                  this.dimension.yScale = 30;
                  this.dimension.radius = 50;
                  break;
                case 3:
                  this.dimension.xScale = 20;
                  this.dimension.yScale = 40;
                  this.dimension.radius = 36;
                  break;
                case 4:
                  this.dimension.xScale = 25;
                  this.dimension.yScale = 50;
                  this.dimension.radius = 16;
                  break;
              }
              if (!document.querySelector('.heatmap-canvas')) {
                this.heatmap = _heatmap.create({
                  container: document.getElementById('heatmapContainer'),
                  radius: 40,
                  maxOpacity: 1,
                  minOpacity: 0.6,
                  blur: 1,
                  backgroundColor: '',
                  gradient: {
                    '0.01': 'blue',
                    '0.03': 'green',
                    '0.1': 'yellow',
                    '0.2': 'orange',
                    '0.4': 'red'
                  }
                });
                this.heatmap1 = _heatmap.create({
                  container: document.getElementById('heatmapContainer1'),
                  radius: 40,
                  maxOpacity: 0.9,
                  minOpacity: 0.45,
                  blur: 1,
                  backgroundColor: '',
                  gradient: {
                    '0.01': 'blue',
                    '0.03': 'green',
                    '0.1': 'yellow',
                    '0.2': 'orange',
                    '0.4': 'red'
                  }
                });
              }
              !!res.data.slotName
                ? (this.showDetail.slotName = res.data.slotName)
                : (this.showDetail.slotName = '-');
              !!res.data.skinType
                ? (this.showDetail.skinType = res.data.skinType)
                : (this.showDetail.skinType = '-');
              !!res.data.pageType
                ? (this.showDetail.pageType = res.data.pageType)
                : (this.showDetail.pageType = '-');
              !!res.data.pageTitle
                ? (this.showDetail.pageTitle = res.data.pageTitle)
                : (this.showDetail.pageTitle = '-');
              !!res.data.appName
                ? (this.showDetail.appName = res.data.appName)
                : (this.showDetail.appName = '-');
              !!res.data.skinName
                ? (this.showDetail.skinName = res.data.skinName)
                : (this.showDetail.skinName = '-');
              !!res.data.slotId
                ? (this.showDetail.slotId = res.data.slotId)
                : (this.showDetail.slotId = '-');
              !!res.data.appId
                ? (this.showDetail.appId = res.data.appId)
                : (this.showDetail.appId = '-');
              !!res.data.pageId
                ? (this.showDetail.pageId = res.data.pageId)
                : (this.showDetail.pageId = '-');
              this.pointListPv.max = res.data.maxPv;
              this.pointListUv.max = res.data.maxUv;
              this.pointListPv.data = [];
              if (!res.data.axisList) {
                MessageBox({
                  title: '暂无数据',
                  type: 'error'
                });
                this.heatmap.setData(this.pointListPv);
                this.heatmap1.setData(this.pointListUv);
                return;
              } else {
                res.data.axisList.forEach(item => {
                  this.pointListPv.data.push({
                    x: parseInt(
                      item.x * (100 / this.dimension.xScale) * 375 * 0.01
                    ),
                    y: parseInt(
                      item.y * (100 / this.dimension.yScale) * this.domHeight * 0.01
                    ),
                    value: item.pv
                  });
                  this.pointListUv.data.push({
                    x: parseInt(
                      item.x * (100 / this.dimension.xScale) * 375 * 0.01
                    ),
                    y: parseInt(
                      item.y * (100 / this.dimension.yScale) * this.domHeight * 0.01
                    ),
                    value: item.uv
                  });
                });
                this.heatmap.setData(this.pointListPv);
                this.heatmap1.setData(this.pointListUv);
              }
            } else {
              //返回不成功 重置
              this.isShowHeatMap = false;
              this.showDetail.slotName = '-';
              this.showDetail.skinType = '-';
              this.showDetail.pageType = '-';
              this.showDetail.pageTitle = '-';
              this.showDetail.appName = '-';
              this.showDetail.skinName = '-';
              this.showDetail.slotId = '-';
              this.showDetail.appId = '-';
              this.showDetail.pageId = '-';
              MessageBox({
                title: res.desc,
                type: 'error'
              });
            }
          },
          res => {
            this.$loadingRouteData = false;
            this.isShowHeatMap = false;
            MessageBox({
              title: '网络错误！',
              type: 'error'
            });
          }
        );
      //获取预览链接
      this.iframeurl = '';
      this.bgurl = '';

      if (!!this.params.pageId) {
        this.selected = true;
        this.$http
          .get(
            `/page/heatMap/preview?pageId=${this.params.pageId}&pageType=${
              this.params.pageType
            }&skinId=${this.params.skinId}`,
            {}
          )
          .then(
            res => {
              // this.$loadingRouteData = false;
              res = res.json();
              if (res.success) {
                this.iframeurl = res.data;
              } else {
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
      } else {
        this.selected = false;
        this.$http
          .get(
            `/page/heatMap/preview?pageId=${this.params.pageId}&pageType=${
              this.params.pageType
            }&skinId=${this.params.skinId}`,
            {}
          )
          .then(
            res => {
              this.$loadingRouteData = false;
              res = res.json();
              if (res.success) {
                this.bgurl = res.data;
              } else {
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
      }
    },
    showPoint(e) {
      let self = this;
      let tx = parseInt((e.offsetX / 375 * this.dimension.xScale).toFixed(0));
      let ty = parseInt((e.offsetY / this.domHeight * this.dimension.yScale).toFixed(0));
      self.pvTip.pvTipShow = false;
      self.uvTip.uvTipShow = false;
      this.leftSize = e.offsetX;
      this.topSize = e.offsetY;
      this.data.forEach(item => {
        if (item.x === tx && item.y === ty) {
              self.pvTip.value = item.pv;
              self.pvTip.pvTipShow = true;
              self.uvTip.value = item.uv;
              self.uvTip.uvTipShow = true;
        }
      });
    },
    hidePoint(e) {
      this.pvTip.pvTipShow = false;
        this.uvTip.uvTipShow = false;
    },
    getarr() {
      this.$http.get('/page/heatMap/getSkinTypeList', {}).then(
      res => {
        res = res.json();
        this.activityArr = [];
        if (res.success) {
          res.data.forEach(item => {
            this.activityArr.push({
              id: item.id,
              label: item.skinName
            });
          });
        }
      },
        res => {}
      );
    }
  },
  ready() {
    this.getarr();
  }
};
</script>
<style lang="less">
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  .heatmap-warp {
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      .filter-label {
        font-size: 14px;
        font-weight: bold;
        color: #444;
        width: 84px;
        text-align: left;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        &.long {
          width: 120px;
          text-align: left;
        }
        &.short {
          width: 16px;
          text-align: left;
        }
      }
      .form-control {
        width: 150px;
        display: inline-block;
        margin-right: 10px;
      }
      .select-group {
        width: 150px;
        margin-right: 10px;
      }
      .datepicker-input {
        width: 160px !important;
      }
      .iconhandle {
        right: 26px !important;
      }
    }
    .d-button {
      margin-left: 16px;
    }
    .mytable {
      border-radius: 2px;
      border: 1px solid #ccc;
      margin-bottom: 0px;
      width: 85%;
      th {
        font-family: HiraginoSansGB-W6;
        font-size: 14px;
        color: #444444;
        background-color: #e8e7e2;
        padding: 9px 0;
      }
      td {
        line-height: 40px;
        text-align: center;
        font-size: 13px;
        border-bottom: 1px dashed #ccc;
        div {
          text-align: center;
        }
      }
      .td-title {
        border: none;
        vertical-align: middle;
        text-align: center;
      }
    }
    .heatmap-chart {
      .filter-area {
        font-size: 0px;
        ul {
          font-size: 0px;
          display: inline-block;
          border-right: 0px solid #e3e3e3;
        }
        .download {
          margin-left: 20px;
          background-color: #fff;
          border: 0px;
          color: #657180 !important;
        }
        li {
          display: inline-block;
          border: 1px solid #e3e3e3;
          background-color: #f7f6f2;
          border-right: none;
          height: 34px;
          line-height: 34px;
          padding: 0 14px;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #ef6b3b;
          }
          &.active {
            background-color: #ef6b3b;
            color: #fff;
            border: 1px solid #ef6b3b;
          }
          &:nth-child(7) {
            border-right: 1px solid #e3e3e3;
          }
          .iconhandle {
            font-size: 14px;
          }
        }
        .quota {
          font-size: 14px;
          font-weight: bold;
          color: #444;
          width: 84px;
          text-align: left;
          display: inline-block;
          margin-top: 10px;
        }
      }

      .heatmapBox {
        position: relative;
        width: 100%;
        height: 600px;
        margin-top: 20px;
        margin-left: px;
        iframe {
          width: 375px;
          height: 600px;
          position: absolute;
          img {
            width: 100%;
            height: 100%;
          }
        }
        #heatmapWarp1 {
          left: 380px;
        }
        #heatmapContainer {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 375px;
          height: 600px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        #pvtip,
        #uvtip {
          position: absolute;
          border-style: solid;
          white-space: nowrap;
          z-index: 9999999;
          background-color: rgba(50, 50, 50, 0.7);
          border-width: 0px;
          border-color: rgb(51, 51, 51);
          border-radius: 4px;
          color: rgb(255, 255, 255);
          font-style: normal;
          font-variant: normal;
          font-weight: normal;
          font-stretch: normal;
          font-size: 14px;
          font-family: 'Microsoft YaHei';
          line-height: 21px;
          padding: 5px;
        }
        #heatmapContainer1 {
          position: absolute !important;
          top: 0;
          left: 380px;
          width: 375px;
          height: 600px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
      }
    }
  }
}
</style>

