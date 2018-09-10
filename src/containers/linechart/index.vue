<template>
  <div class="linechart-wrapper">
    <!-- <h2 @click="goLink">{{datas.info.kanbanName}}</h2> -->
     <h2 @click="goLink">{{title}}</h2>
    <div class="linechart-item" :id="ids" >
    </div>
  </div>
</template>
<script>
// _fixNum
  // import MessageBox from 'components/basic/MessageBox';
  import { setItem } from 'components/utils/localStorage.js';
  import {getPrecent, _fixNum} from 'components/utils/cheatDataUtils.js';
  import echarts from 'echarts';
  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      isShowLoading: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: 'lg'
      },
      formateType: {
        type: String,
        default: ''
      },
      ids: {
        type: String,
        default: ''
      },
      datas: {
        type: Object,
        default: null
      },
      propkey: {
        type: String,
        default: 'ad_consume'
      },
      params: {
        type: Object,
        default: null
      },
      propparams: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        title: '',
        time: {

        }
      };
    },
    methods: {
      goLink() {
        let url = window.location.origin + window.location.pathname +
        `#!/tuiachartcenter/tuiatableview/${this.datas.chartQuery.chartQuery.id}/${this.propparams.slotid || 'null'}/${this.propparams.appid || 'null'}/${this.time.startDate || 'null'}/${this.time.endDate || 'null'}/${this.propparams.appName || 'null'}/${this.propparams.slotName || 'null'}`;
        const list = this.datas.info.dimensionDesc.split(',');
        setItem(`${this.datas.chartQuery.chartQuery.id}dimensionList`, list);
        window.open(url);
      },
      _initchart(val) {
        // 初始化
        this.title = val.info.kanbanName;
        this.time = val.info.time;
        let {keys, entries, values} = Object;
        let xAxisData = [];
        let seriesData = [];
        let legendData = keys(val.data);
        for (let [key, vals] of entries(val.data)) {
          xAxisData = keys(vals);
          seriesData.push({
            name: key,
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: values(vals).map((ele) => ele.length > 0 ? ele[0][this.propkey].toString().split(',').join('') : 0)
          });
        };

        // 其它是否需要过滤
        seriesData.forEach((ele, index) => {
          if (ele.name === '其它' && ele.data.every((item) => item === '0')) {
            seriesData.splice(index, 1);
            legendData = legendData.filter((ele) => ele !== '其它');
          }
        });
        // 总计其他
        const options = {
          title: {
            // subtext: `${this.time.startTime} ~ ${this.time.endTime}`,
            subtext: `${val.info.time.startDate} ~ ${val.info.time.endDate}`,
            x: 'left',
            align: 'left',
            subtextStyle: {
              fontSize: 14,
              color: '#666'
            }
          },
          grid: {
            left: '1%',
            bottom: '15%',
            containLabel: true
          },
          legend: {
            icon: 'rect',
            itemWidth: 25,
            itemHeight: 3,
            itemGap: 10,
            left: 'center',
            bottom: 20,
            data: legendData
          },
          toolbox: {
            show: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              const key = params[0].axisValue;
              const index = xAxisData.findIndex((ele) => ele === key);
              let tpl = '';
              let total = 0;
              // 总数计算
              // seriesData[index].data.forEach((ele) => { total += Number(ele); return total; });
              seriesData.forEach((ele) => { total += Number(ele.data[index]); return total; });
              params.forEach(function(item, index) {
                const per = getPrecent(parseInt(item.data.toString().split(',').join('')) / total).toString() === 'NaN%' ? 0 : getPrecent(parseInt(item.data.toString().split(',').join('')) / total).toString();
                // let num = Number(item.data);
                tpl += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' +
                item.seriesName + ' : ' + _fixNum(item.data, 2) + ' (' + per + ')' + '<br/>';
              });
              return tpl;
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: xAxisData
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: seriesData
        };
        this.chart.setOption(options);
      }
    },
    watch: {
      'datas': {
        handler: function(val) {
          if (this.chart !== null && this.chart !== '' && this.chart !== undefined) {
            this.chart.dispose();
          }
          this.chart = echarts.init(document.getElementById(this.ids));
          this._initchart(val);
        },
        deep: true
      }
    }
  };
</script>
<style lang="less">
.linechart-wrapper{
  margin-top:40px;
  h2{
    cursor: pointer;
    font-size:20px;
     &:hover{
      color:chocolate
    }
  }
  .linechart-item {
    width:100%;
    height:400px;
  }
}

</style>

