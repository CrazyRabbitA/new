<template>
  <div class="chart-page">
    <div class="data-wrapper">
        <p class="data-title">
            <span>日期:</span>
            <daterangepicker
              :error-show.sync="errorShow"
              :start.sync="params.startDate"
              :end.sync="params.endDate"
              ></daterangepicker>
        </p>
        <p class="data-type1">
          <span
              @click="changeDate(index,item)"
              :class="{'isActive':item.active}"
              v-for="(index,item) in dataType"
              :key="index">{{item.label}}</span>
        </p>
        <p class="data-type2">
          <span
              @click="changeType(index,item)"
              :class="{'isActive':item.active}"
              v-for="(index,item) in dataType2"
              :key="index">{{item.label}}</span>
        </p>
    </div>
    <div class="filter-wrapper">
        <p ><span>筛选:</span></p>
        <selectcomponent
          @getobj = "getobj"
          @getkey = "getkey"
          v-for="i in dimensionCountArr"
          :count = "dimensionCountArr.length"
          :params = "params"
          track-by = "$index"
          :key="i"
          :showactive = "showactive"></selectcomponent>
        <span @click="addDimension" class = "add-dimension" >
          +
        </span>
        <!-- 指标 -->
        <indicatorcomponent
          @gettotal = "gettotal"
          @getin = "getin"
          @gettext = "gettext"
          @getindica = "getindica"></indicatorcomponent>
    </div>

    <div class="change-chart">
      <span class="search"><d-button @click="searchChart"  size="large" >查询</d-button></span>
      <span :class="{'isActives': type === 0}" @click="getInitChart(0)"><i class="quwenicon">&#xe637;</i></span>
      <span :class="{'isActives': type === 2}" @click="getInitChart(2)"><i class="quwenicon">&#xe663;</i></span>
      <span :class="{'isActives': type === 1}" @click="getInitChart(1)"><i class="quwenicon">&#xe655;</i></span>
    </div>
    <div v-if="type===1" class="line-count">
      <p  v-for="(index,item) in legendData" track-by="$index" :key="index">
        <span>
          <i
            :style="{'background': colorArr[index]}"></i>
          <i>{{ item === "dashBoard" ? "大盘" : item}}</i>
          <i>{{ lineTitle[index] }}</i>
        </span>
      </p>

    </div>
    <div class="canvas-wrapper">
      <div class="canvas" :id='"canvas"'>

      </div>
    </div>
   <!-- <loading :show="showloading"></loading> -->
  </div>
</template>
<script>
const chartIcon = [
  {
    id: 0,
    label: '&#xe663;'
  },
  {
    id: 2,
    label: '&#xe663;'
  },
  {
    id: 1,
    lable: '&#xe655;'
  }
];
const showindicators = [
  {
    label: 'APP启动用户数',
    id: 'appStartUser',
    active: true
  },
  {
    label: '用户登录数',
    id: 'loginUser',
    active: false
  },
  {
    label: '人均访问时长',
    id: 'avgVisitDuration',
    active: false
  },
  {
    label: '人均点击文章数',
    id: 'articleClickAvg',
    active: false
  },
  {
    label: '次日留存率',
    id: 'dayStayRate',
    active: false
  },
  {
    label: '周留存率',
    id: 'weekStayRate',
    active: false
  }
];
import MessageBox from 'components/basic/MessageBox';
import { formatDate } from 'components/utils/dateUtils';
import selectcomponent from './selectComponent';
import indicatorcomponent from './indicatorComponent';
import coredataMixin from '../mixins/coredataChartMixin';
const colorArr = [
  '#F4A460',
  '#A0522D',
  '#7171C6',
  '#43CD80',
  '#B22222',
  '#CD661D',
  '#FFB90F',
  '#FF8C69',
  '#CDAA7D',
  '#FF7F00',
  '#AB82FF',
  '#FF4040',
  '#FA8072',
  '#B4EEB4',
  '#8470FF',
  '#DA70D6',
  '#8B7E66',
  '#CDB79E',
  '#CD3700',
  '#9370DB',
  '#BA55D3',
  '#9ACD32',
  '#8B7355',
  '#0000FF',
  '#8B0000',
  '#545454'
];
export default {
  props: {
    key: {
      type: Number,
      default: 1
    },
    selectObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mixins: [coredataMixin],
  data() {
    const dataType = [
      {
        label: '最近7天',
        active: true
      },
      {
        label: '最近30天',
        active: false
      },
      {
        label: '最近3个月',
        active: false
      }
    ];
    const dataType2 = [
      {
        label: '按日',
        active: true
      },
      {
        label: '按周',
        active: false
      }
    ];
    return {
      params: {
        startDate: this._getStartDay(formatDate(new Date())),
        endDate: this._getEndDay(formatDate(new Date())),
        appSources: [],
        appVersions: [],
        queryType: 1,
        userTypes: []
      },
      dataType: dataType,
      dataType2: dataType2,
      errorShow: false,
      dimensionCountArr: [0],
      dimensionCount: 0,
      showindicators: showindicators,
      indicators: [],
      indicatorsTypeItem: 'appStartUser',
      getparams: {},
      type: 1,
      labelName: 'APP启动用户数',
      colorArr: colorArr,
      appVersions: [],
      appSources: [],
      queryType: [],
      totalindicator: {},
      chartIcon: chartIcon
    };
  },
  methods: {

    gettotal(data) {
      this.totalindicator = data;
    },
    getin() {
      this.initChart(this.type, this.indicatorsTypeItem);
    },
    gettext(data) {
      this.labelName = data;
    },
     // 指标过滤
    getindica(data) {
      this.indicatorsTypeItem = data;
      // 指标切换的时候过滤
      this.initChart(this.type, this.indicatorsTypeItem);
    },
    getkey(key) {
      this.dimensionCount--;
      this.dimensionCountArr.splice(key, 1);
    },
    getobj(data) {
      this.params = Object.assign(this.params, data);
      // dom
      setTimeout(() => {
        if (!document.getElementById('pageappVersions')) {
          // this.params.appVersions = []
          this.params = Object.assign(this.params, {appVersions: []});
        };
        if (!document.getElementById('pageappSources')) {
            // this.params.appSources = []
          this.params = Object.assign(this.params, {appSources: []});
        }
        if (!document.getElementById('pagequeryType')) {
            // this.params.queryType = []
          this.params = Object.assign(this.params, {userTypes: []});
        }
        // this.getChartData();
        this.getChartData(this.type, this.indicatorsTypeItem);
      }, 100);

      // setTimeout(() => {
      //   this.initChart(this.type, this.indicatorsTypeItem);
      // }, 400);
    },
    changeIndicators(index, item) {
      this.showindicators.map((ditem, i) => {
        if (i === index) {
          ditem.active = true;
          this.indicatorsTypeItem = ditem.id;
        } else {
          ditem.active = false;
        }
        return ditem;
      });
    },
    selectindicators() {
      this.showindicators.map(item => {
        item.active = false;
        if (item.id === this.indicatorsTypeItem) {
          item.active = true;
        }
        return item;
      });
    },
    _getStartDay(dateStr, type = 7) {
      let start = new Date(dateStr) - 1000 * 60 * 60 * 24 * type;
      return formatDate(start);
    },
    _getEndDay(dateStr) {
      let end = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(end);
    },
    changeDate(index, item) {
      switch (index) {
        case 0:
          this.params.startDate = this._getStartDay(formatDate(new Date()), 7);
          this.params.endDate = this._getEndDay(formatDate(new Date()));
          break;
        case 1:
          this.params.startDate = this._getStartDay(formatDate(new Date()), 30);
          this.params.endDate = this._getEndDay(formatDate(new Date()));
          break;
        case 2:
          this.params.startDate = this._getStartDay(formatDate(new Date()), 90);
          this.params.endDate = this._getEndDay(formatDate(new Date()));
          break;
      }
      this.dataType.map((ditem, i) => {
        if (i === index) {
          ditem.active = true;
        } else {
          ditem.active = false;
        }
        return ditem;
      });
      // 快捷入口
      this.getChartData(this.type, this.indicatorsTypeItem);
      // setTimeout(() => {
      //   this.initChart(this.type, this.indicatorsTypeItem);
      // }, 200);
    },
    // 按日按周
    changeType(index, item) {
      if (index === 0) {
        this.params.queryType = 1;
      } else {
        this.params.queryType = 2;
      }
      this.dataType2.map((ditem, i) => {
        if (i === index) {
          ditem.active = true;
        } else {
          ditem.active = false;
        }
        return ditem;
      });
      // 按日按周
      // this.getChartData();
      this.getChartData(this.type, this.indicatorsTypeItem);
      // setTimeout(() => {
      //   this.initChart(this.type, this.indicatorsTypeItem);
      // }, 200);
    },
    addDimension() {
      if (this.dimensionCount > 2) {
        MessageBox({
          title: '最多添加4个',
          type: 'error'
        });
        return;
      }
      this.dimensionCount++;
      this.dimensionCountArr.push(this.dimensionCount);
    },
    // 图表类型
    getInitChart(type) {
      this.type = type;
      // 图标切换的时候走一遍接口
      // this.getChartData();
      // setTimeout(() => {
      //   this.initChart(this.type, this.indicatorsTypeItem);
      // }, 200);
      this.getChartData(this.type, this.indicatorsTypeItem);
    },

    searchChart() {
      // this.getChartData();
      // setTimeout(() => {
      //   this.initChart(this.type, this.indicatorsTypeItem);
      // }, 200);
      this.getChartData(this.type, this.indicatorsTypeItem);
    }
  },
  ready() {
    // this.getChartData();
    // setTimeout(() => {
    //   this.initChart(this.type, this.indicatorsTypeItem);
    // }, 200);
    this.getChartData(this.type, this.indicatorsTypeItem);
    // 获取指标
  },
  components: {
    selectcomponent,
    indicatorcomponent
  }
};
</script>
<style lang="less" >
.chart-page {
  .data-wrapper {
    height: 60px;
    margin-top: 10px;
    p {
      float: left;
      &:nth-child(2),
      &:nth-child(3) {
        margin-left: 30px;
        height: 34px;
        padding-top: 4px;
        box-sizing: border-box;
        span {
          cursor: pointer;
          display: inline-block;
          padding: 4px 20px;
          border: 1px solid #999;
          border-right: none;
          &:nth-last-child(1) {
            border-right: 1px solid #999;
          }
        }
      }
    }
  }
  .filter-wrapper {
    display: inline-block;
    .ins {
      line-height: 34px;
      margin-right: 10px;
    }
    p {
      float: left;
      &:nth-child(1) {
        line-height: 34px;
        margin-right: 10px;
      }
    }
  }
  .add-dimension {
    background: rgb(224, 59, 59);
    display: block !important;
    text-align: center;
    line-height: 34px;
    width: 44px;
    height: 34px;
    border: none;
    font-size: 24px;
    color: #fff;
    border-radius: 3px;
    margin-left: 46px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .isActive {
    background: #ffc715;
  }
  .isActives {
    color: #ffc715;
  }
  .add-dimension {
    display: inline-block;
    background: red;
  }
  .data-type3 {
    margin-left: 30px;
    height: 34px;
    padding-top: 4px;
    box-sizing: border-box;
    span {
      cursor: pointer;
      display: inline-block;
      padding: 4px 20px;
      border: 1px solid #999;
      border-right: none;
      &:nth-last-child(1) {
        border-right: 1px solid #999;
      }
    }
  }
  .select {
    float: left;
  }
  .canvas-wrapper{
    width:100%;
    overflow: auto;
    .canvas {
      width: 1500px;
      overflow: auto;
      // overflow-y: auto;
      height: 600px;
      margin-top: 20px;
      margin-bottom: 50px;
    }
  }

  .change-chart {
    margin: 20px 0;
    height: 30px;
    .search {
      float: left;
      button {
        background: #ffc715;
      }
    }
    span {
      float: right;
      margin-right: 10px;

      cursor: pointer;
      i {
        font-size: 24px;
        display: inline-block;
        width: 26px;
        height: 26px;
      }
    }
  }
  .line-count {
    p {
      height: 20px;
      line-height: 20px;
      // display: inline-block;
      span {
        float: right;
        color: #444;
        font-size: 12px;
        i {
          float: left;
          font-style: normal;
          &:nth-of-type(1) {
            border-radius: 50%;
            width: 10px;
            height: 10px;
            background: red;
            margin-right: 10px;
            margin-top: 5px;
          }
          &:nth-of-type(2) {
            margin-right: 10px;
            // min-width: 60px;
            // max-width: 180px;
            width: 140px;
            text-align: left;
          }
          &:nth-of-type(3) {
            font-size: 16px;
            width: 120px;
            max-width: 180px;
          }
        }
      }
    }
  }
}
</style>

