<template>
    <pagetitle title="柱状图" class="chart-title"></pagetitle>
    <div class="bar-chart-filter-area cf">
      <d-select :options.sync="selectDayArr" :value.sync="selectDay" @select="selectDayChange"></d-select>
      <d-select :options.sync="selectTimeNodeArr" :value.sync="selectTimeNode" @select="selectTimeNodeChange"></d-select>
      <d-select :options.sync="selectDimensionArr" :value.sync="selectDimension" @select="selectDimensionChange"></d-select>
    </div>
    <div :id="chartId" style="height:400px;"></div>
</template>
<script>
  import barChartMixins from './barChartMixins.js';
  import monitorBarChartMixins from './monitorBarChartMixins.js';
  const _selectTimeNodeArr = [
    {
      label: '全局',
      id: 'all'
    },
    {
      label: '0:30',
      id: '00:30'
    }, {
      label: '1:00',
      id: '01:00'
    }, {
      label: '1:30',
      id: '01:30'
    }, {
      label: '2:00',
      id: '02:00'
    }, {
      label: '2:30',
      id: '02:30'
    }, {
      label: '3:00',
      id: '03:00'
    }, {
      label: '3:30',
      id: '03:30'
    }, {
      label: '4:00',
      id: '04:00'
    }, {
      label: '4:30',
      id: '04:30'
    }, {
      label: '5:00',
      id: '05:00'
    }, {
      label: '5:30',
      id: '05:30'
    }, {
      label: '6:00',
      id: '06:00'
    }, {
      label: '6:30',
      id: '06:30'
    }, {
      label: '7:00',
      id: '07:00'
    }, {
      label: '7:30',
      id: '07:30'
    }, {
      label: '8:00',
      id: '08:00'
    }, {
      label: '8:30',
      id: '08:30'
    }, {
      label: '9:00',
      id: '09:00'
    }, {
      label: '9:30',
      id: '09:30'
    }, {
      label: '10:00',
      id: '10:00'
    }, {
      label: '10:30',
      id: '10:30'
    }, {
      label: '11:00',
      id: '11:00'
    }, {
      label: '11:30',
      id: '11:30'
    }, {
      label: '12:00',
      id: '12:00'
    }, {
      label: '12:30',
      id: '12:30'
    }, {
      label: '13:00',
      id: '13:00'
    }, {
      label: '13:30',
      id: '13:30'
    }, {
      label: '14:00',
      id: '14:00'
    }, {
      label: '14:30',
      id: '14:30'
    }, {
      label: '15:00',
      id: '15:00'
    }, {
      label: '15:30',
      id: '15:30'
    }, {
      label: '16:00',
      id: '16:00'
    }, {
      label: '16:30',
      id: '16:30'
    }, {
      label: '17:00',
      id: '17:00'
    }, {
      label: '17:30',
      id: '17:30'
    }, {
      label: '18:00',
      id: '18:00'
    }, {
      label: '18:30',
      id: '18:30'
    }, {
      label: '19:00',
      id: '19:00'
    }, {
      label: '19:30',
      id: '19:30'
    }, {
      label: '20:00',
      id: '20:00'
    }, {
      label: '20:30',
      id: '20:30'
    }, {
      label: '21:00',
      id: '21:00'
    }, {
      label: '21:30',
      id: '21:30'
    }, {
      label: '22:00',
      id: '22:00'
    }, {
      label: '22:30',
      id: '22:30'
    }, {
      label: '23:00',
      id: '23:00'
    }, {
      label: '23:30',
      id: '23:30'
    }, {
      label: '24:00',
      id: '24:00'
    }
  ];
  const selectDimensionArr = [
    {
      label: '访问柱状图',
      id: 'visit'
    }, {
      label: '请求柱状图',
      id: 'req'
    }
  ];
  const selectDayArr = [
    {
      label: '今日',
      id: 'today'
    }, {
      label: '昨日',
      id: 'yesterday'
    }, {
      label: '7日平均',
      id: '7avg'
    }
  ];
  export default {
    mixins: [barChartMixins, monitorBarChartMixins],
    props: {
      selectDayArr: {
        type: Array,
        default() {
          return selectDayArr;
        }
      },
      selectTimeNodeArrBackUp: {
        type: Array,
        default: () => {
          return _selectTimeNodeArr;
        }
      },
      selectDimensionArr: {
        type: Array,
        default: () => {
          return selectDimensionArr;
        }
      },
      dataList: {
        type: Object,
        default: () => {
          return {};
        }
      },
      chartId: {
        type: String,
        default: ''
      },
      isShowSdkUv: {
        type: Boolean,
        default: true
      },
      isLeftChart: {
        type: Boolean,
        default: ''
      },
      selectTimeNode: {
        type: String,
        default: ''
      },
      selectDay: {
        type: String,
        default: ''
      },
      selectDimension: {
        type: String,
        default: ''
      }
    },
    ready() {
      this.timeNodeFomat();
      this.getBarChart();
      this.$watch('barAlign', (val) => {
        this.getChartData(this.dataList, this.selectDay, this.selectTimeNode, this.selectDimension);
      });
      this.$watch('dataList', (val) => {
        if (this.dataList.extraDate && this.dataList.extraDate.launchCount && this.selectDayArr.length === 3) {
          this.selectDayArr.push(
            {
              label: '额外日期',
              id: 'extraDate'
            }
          );
        }
        this.getChartData(this.dataList, this.selectDay, this.selectTimeNode, this.selectDimension);
      });
    },
    data() {
      return {
        showNewListForbar: {
        },
        selectTimeNodeArr: []
      };
    },
    methods: {
      timeNodeFomat() {
        if (this.selectDay === 'today') {
          let hours = new Date().getHours();
          let mins = new Date().getMinutes();
          let node = mins > 30 ? 1 : 0;
          let sumItem = hours * 2 + node + 1;
          let timeArr = [].concat(this.selectTimeNodeArrBackUp);
          this.selectTimeNodeArr = timeArr.splice(0, sumItem);
        } else {
          this.selectTimeNodeArr = [].concat(this.selectTimeNodeArrBackUp);
        }
      },
      getBarChart() {
        if (this.dataList.extraDate && this.dataList.extraDate.launchCount && this.selectDayArr.length === 3) {
          this.selectDayArr.push(
            {
              label: '额外日期',
              id: 'extraDate'
            }
          );
        }
        this.getChartData(this.dataList, this.selectDay, this.selectTimeNode, this.selectDimension);
      },
      selectTimeNodeChange() {
        this.getChartData(this.dataList, this.selectDay, this.selectTimeNode, this.selectDimension);
      },
      selectDimensionChange() {
        this.getChartData(this.dataList, this.selectDay, this.selectTimeNode, this.selectDimension);
      },
      selectDayChange() {
        this.timeNodeFomat();
        if (this.selectDay === 'today') {
          this.selectTimeNode = 'all';
        }
        this.getChartData(this.dataList, this.selectDay, this.selectTimeNode, this.selectDimension);
      }
    }
  };
</script>
<style lang="less">
  .bar-chart-filter-area {
    padding: 0 20px 20px 20px;
    .select-group {
      &:nth-child(1) {
        width: 106px;
      }
      &:nth-child(2) {
        width: 90px;
        .select-menu {
          a {
            padding-left: 26px;
          }  
          .iconhandle {
            left: 7px;
          }
        }
      }    
      &:nth-child(3) {
        width: 120px;
        float: right;
      }
    }
  }
</style>
