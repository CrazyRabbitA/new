<template>
  <d-modal :title="title" id="asd"  :show.sync="show" width="80%" class="quotamodal mask-wrapper" :on-close="onClose">
    <div ref="modal"  class="modal-body quota-modal-body charts-wraper" slot="modal-body" >
        <!-- 广告 -->
        <div class="media-offline-chart">
            <div class="filter-area">
                <span class="quota">指标:</span>
                <ul>
                    <template v-for="item in adquotas" track-by="$index">
                        <li :key="item" :getId = "item.id" @click="changeQuota(item.id, item.titile)" :class="{activeTag: isActive(item.id)}">{{item.title}}</li>
                    </template> 
                </ul>
            </div>
            <div style="height:400px" id="canvaswrap"></div>
            </div>
        </div>
    <div slot="modal-footer">
    </div>
  </d-modal>
</template>
<script>
// 发券、点击、转化、ARPU、点击均价、转化成本
import MessageBox from 'components/basic/MessageBox';
import echarts from 'echarts';
export default {
  props: {
    title: {
      required: true,
      default: '',
      type: String
    },

    chartdata: {
      type: Object,
      default() {
        return {};
      }
    },
    show: {
      default: true,
      type: Boolean
    }
    // onClose:{
    //   type:Function,
    //   default:null,
    // }
  },
  data() {
    return {
      adquotas: [],
      // 广告
      checkList: [],
      // 大盘
      data: {},
      legendData: [],
      seriesData: [],
      xAxisData: [],
      // 左右
      yAxisData: [],
      adobj: {},
      bigobj: {
        launchPv: [],
        clickPrice: [],
        efclickPv: []
      }
    };
  },
  ready() {

  },
  methods: {
    initchart(legendData, ydatas, xAxisData) {
      // 初始化清除dom

      const echart = echarts.init(document.getElementById('canvaswrap'));
      // 初始化赋值

      const option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        // 标题
        legend: {
          data: legendData,
          bottom: 0
        },

        // X轴数据
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: ydatas,
        series: this.seriesData
      };
      echart.setOption(option, true);
      window.addEventListener('resize', function() {
        echart.resize();
      });
    },
    onClose() {
      this.$emit('to-parent', false);
    },
    // id判断
    isActive(id) {
      let notHas = false;
      this.checkList.forEach(item => {
        if (item === id) {
          notHas = true;
        }
      });
      return notHas;
    },
    switchLegend(ele) {
      let lengendName = '';
      const key = Object.keys(this.adobj);
      if (key.length > 3) {
        // 广告分析图
        switch (ele) {
          case 'launchCount':
            lengendName = '发券';
            break;
          case 'tuiaConsumerCount':
            lengendName = '点击';
            break;
          case 'effectPv':
            lengendName = '转化';
            break;
          case 'clickPrice':
            lengendName = '点击单价';
            break;
          case 'arpu':
            lengendName = 'ARPU';
            break;
          case 'transCost':
            lengendName = '转化成本';
            break;
        }
      } else {
        // 大盘数据
        switch (ele) {
          case 'launchPv':
            lengendName = '发券UV';
            break;
          case 'clickPrice':
            lengendName = '均价';
            break;
          case 'efclickPv':
            lengendName = '点击UV';
            break;
        }
      }
      return lengendName;
    },
    // 数据切换

    changeQuota(id, title) {
      let notHas = true;
      let curIndex = 0;
      this.checkList.forEach((item, index) => {
        if (item === id) {
          notHas = false;
          curIndex = index;
        }
      });

      if (
        (this.checkList.length === 2 || this.checkList.length > 2) &&
        notHas
      ) {
        this.checkList.splice(0, 1);
      }
      if (notHas) {
        this.checkList.push(id);
      } else {
        this.checkList.splice(curIndex, 1);
      }
      if (this.checkList.length === 0) {
        this.checkList.push(id);
        MessageBox({
          title: '对不起，最少选择一个指标！',
          type: 'error'
        });
        return false;
      }
      // x轴数据

      // 对应的id series整理
      this.rendMap();
      // 数据
    },
    rendMap() {
      this.xAxisData = Object.keys(this.chartdata);
      this.seriesData = [];
      this.legendData = [];
      const yAxisData = [];

      this.checkList.forEach((ele, index) => {
        const lengendName = this.switchLegend(ele);
        let pushArr = {};
        if (index === 1) {
          pushArr = {
            name: lengendName,
            type: 'line',
            yAxisIndex: 1,
            data: this.adobj[ele]
          };
        } else {
          pushArr = {
            name: lengendName,
            type: 'line',
            data: this.adobj[ele]
          };
        }
        this.seriesData.push(pushArr);
        this.legendData.push(lengendName);
        yAxisData.push({
          name: lengendName,
          type: 'value',
          nameTextStyle: {
            color: '#444'
          },
          nameLocation: 'end',
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              if (value > 100000) {
                return value / 1000 + 'k';
              }
              return value;
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        });
      });

      this.initchart(this.legendData, yAxisData, this.xAxisData);
    }
  },

  watch: {
    chartdata(newval) {
      const valArr = Object.values(newval);

      // 判断是大盘数据视图还是广告分析视图
      const getKey = Object.keys(valArr[0]);
      if (getKey.length !== 3) {
        // 广告分析视图
        this.adobj = {
          launchCount: [],
          tuiaConsumerCount: [],
          effectPv: [],
          transCost: [],
          arpu: [],
          clickPrice: []
        };
        this.checkList = ['launchCount'];
        this.adquotas = [
          {
            title: '发券',
            id: 'launchCount'
          },
          {
            title: '点击',
            id: 'tuiaConsumerCount'
          },
          {
            title: '转化',
            id: 'effectPv'
          },
          {
            title: 'ARPU',
            id: 'arpu'
          },
          {
            title: '点击单价',
            id: 'clickPrice'
          },
          {
            title: '转化成本',
            id: 'transCost'
          }
        ];
      } else {
        // 大盘数据
        this.adobj = {
          launchPv: [],
          clickPrice: [],
          efclickPv: []
        };
        this.checkList = ['launchPv'];
        this.adquotas = [
          {
            title: '发券UV',
            id: 'launchPv'
          },
          {
            title: '点击UV',
            id: 'efclickPv'
          },
          {
            title: '均价',
            id: 'clickPrice'
          }
        ];
      }

      valArr.forEach(ele => {
        const keys = Object.keys(ele);

        // 数据格式转换
        keys.forEach(id => {
          if (
            id === 'clickPrice' ||
            id === 'arpu' ||
            id === 'transCost' ||
            id === 'clickPrice'
          ) {
            ele[id] = ele[id].toFixed(2);
          }
          this.adobj[id].push(ele[id]);
        });
      });
      // const keys = Object.keys(this.adobj);
      setTimeout(() => {
        this.rendMap();
      }, 20);
      // this.rendMap();
    }
  }
};
</script>
<style lang="less">
.mask-wrapper {
  .modal-title {
    text-align: center;
  }
  height: 100%;
}

.media-offline-chart {
  // height: 600px;
  margin-top: 10px;
  .filter-area {
    font-size: 0px;
    margin-bottom: 40px;
    text-align: center;
    ul {
      font-size: 0px;
      display: inline-block;
      border-right: 1px solid #e3e3e3;
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
      &.activeTag {
        background-color: #ef6b3b;
        color: #fff;
        border: 1px solid #ef6b3b;
      }
    }
    .quota {
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 40px;
      text-align: left;
      display: inline-block;
      margin-top: 10px;
    }
  }
}
</style>
