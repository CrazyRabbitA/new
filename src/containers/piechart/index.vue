<template>
  <div  class = "piechart-wrapper">
    <h2 @click="goLink">{{title}}</h2>
    <!-- <h3 v-if="shownodata" class="nodata">当前查询条件下暂无数据!</h3> -->
    <div  class="piechart-item" :id="ids" width="100%" style="height:400px;"></div>

  </div>
</template>
<script>
// import MessageBox from 'components/basic/MessageBox';
import { _fixNum } from 'components/utils/cheatDataUtils';
import { setItem } from 'components/utils/localStorage.js';
import echarts from 'echarts';
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    isShowloading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    ids: {
      type: String,
      default: ''
    },
    datas: {
      type: Object,
      default: null
    },
    params: {
      type: Object,
      default: null
    },
    // 饼图是否实心
    isSolid: {
      type: Boolean,
      default: false
    },
    propkey: {
      type: String,
      default: 'ad_consume'
    },
    propparams: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      title: '',
      time: {},
      shownodata: false
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
    _initchart(data) {
      this.time = data.info.time;
      this.title = data.info.kanbanName;
      let datas = data.data instanceof Array ? data.data : data.data.data;
      const legendData = datas.map((ele) => ele.name);
      const seriesData = datas.map((ele) => {
        return {
          name: ele.name,
          value: ele[this.propkey] ? ele[this.propkey].toString().split(',').join('') : 0
        };
      });
      if (this.datas.info.kanbanName === '手机品牌分布-发券' || this.datas.info.kanbanName === '地域流量分布-发券') {
        let dataTotal = data.data.total[this.propkey];
        let itemtotal = 0;
        seriesData.forEach((ele) => {
          itemtotal += Number(ele.value);
        });
        if (Number(dataTotal) !== itemtotal) {
          let name = '';
          if (this.datas.info.kanbanName === '手机品牌分布-发券') {
            name = '非top10';
          } else {
            name = '非top20';
          }
          const obj = {
            name: name,
            value: Number(dataTotal) - itemtotal
          };
          seriesData.push(obj);
          legendData.push(name);
        }
      }
      // 计算判断和total是否相等，不相等加入其他
      // 格式化数据
      const options = {
        title: {
          subtext: `${data.info.time.startDate} ~ ${data.info.time.endDate}`,
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
        tooltip: {
          trigger: 'item',
          formatter(params) {
            // 判断整数还是小数
            let num = Number(params.value);
            let tpl = '';
            if (Number.isInteger(num)) {
              tpl = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ${params.color}"></span>` +
              `${params.name} :${_fixNum(params.value, 0)} (${params.percent}%)`;
            } else {
              tpl = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ${params.color}"></span>` +
              `${params.name} :${_fixNum(params.value, 2)} (${params.percent}%)`;
            }
            return tpl;
          }
        },
        legend: {
          data: legendData,
          bottom: 'bottom'
        },
        series: [
          {
            name: `${this.datas.kanbanName}`,
            type: 'pie',
            radius: this.isSolid ? '60%' : ['40%', '60%'],
            center: ['50%', '45%'],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.chart.setOption(options);
    }
  },
  ready() {

  },
  watch: {
    'datas': {
      handler: function(val) {
        // if (val.data.data.length === 0) {
        //   this.shownodata = true;
        // }
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
<style lang="less" scoped>
.piechart-wrapper{
  position:relative;
  .nodata{
    width:100%;
    position: absolute;
    top:80px;
    left:0;
  }
  margin-top:40px;
  h2{
    cursor: pointer;
    font-size:20px;
     &:hover{
      color:chocolate
    }
  }
  .piechart-item {
    width:100%;
    height:400px;
  }
}
</style>
