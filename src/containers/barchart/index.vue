<template>
  <div class="barchart-wrapper">
    <!-- <h2 @click="goLink">{{datas.kanbanName}}</h2> -->
    <h2 @click="goLink">{{title}}</h2>
    <div class="barchart-item" :id="ids" :style = styles>
    </div>
  </div>
</template>
<script>
// import MessageBox from 'components/basic/MessageBox';
import echarts from 'echarts';
import { setItem } from 'components/utils/localStorage.js';
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
      styles: {
        width: '100%'
      },
      title: '',
      time: {

      }
    };
  },
  methods: {
    goLink() {
      let ka = this.title === 'KA媒体' ? '是' : 'ka';
      // return;
      let url = window.location.origin + window.location.pathname +
        `#!/tuiachartcenter/tuiatableview/${this.datas.chartQuery.chartQuery.id}/${this.propparams.slotid || 'null'}/${this.propparams.appid || 'null'}/${this.time.startDate || 'null'}/${this.time.endDate || 'null'}/${this.propparams.appName || 'null'}/${this.propparams.slotName || 'null'}/${ka}`;
      const list = this.datas.info.dimensionDesc.split(',');
      setItem(`${this.datas.chartQuery.chartQuery.id}dimensionList`, list);
      window.open(url);
    },
    // 换行显示\
    calcuAxisData(params) {
      var newParamsName = '';
      var paramsNameNumber = params.length;
      var provideNumber = 7; // 一行显示几个字
      var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
      if (paramsNameNumber > provideNumber) {
        for (var p = 0; p < rowNumber; p++) {
          var tempStr = '';
          var start = p * provideNumber;
          var end = start + provideNumber;
          if (p === rowNumber - 1) {
            tempStr = params.substring(start, paramsNameNumber);
          } else {
            tempStr = params.substring(start, end) + '\n';
          }
          newParamsName += tempStr;
        }
      } else {
        newParamsName = params;
      }
      return newParamsName;
    },
    cal(params) {
      let newparams = params.split('(id:');
      newparams = `${newparams[0]}\n(id:${newparams[1]})`;
      return newparams;
    },
    _initchart(val) {
      this.time = val.info.time;
      this.title = val.info.kanbanName;
      let {entries, values, keys} = Object;
      let arr = [];
      let vals = values(val.data);
      arr[vals.length - 1] = vals[vals.length - 1];
      vals.forEach((ele, i) => {
        if (i < vals.length - 1) {
          arr[i] = [];
          vals[vals.length - 1].forEach((item, j) => {
            ele.forEach((aitem, k) => {
              if ((item.app_name && item.app_name === aitem.app_name) ||
                (item.account_name && item.account_name === aitem.account_name)) {
                arr[i].push(aitem);
              }
            });
          });
        }
      });
      const legendData = Object.keys(val.data);
      let xAxisData = [];
      let seriesData = [];
      let copyobj = Object.assign({}, val.data);
      let objkeys = keys(val.data);
      objkeys.forEach((ele, index) => {
        copyobj[ele] = arr[index];
      });
      for (let [key, vals] of entries(copyobj)) {
        xAxisData = vals.map(
          ele => ele.app_name ? `${ele.app_name}(id:${ele.app_id})` : `${ele.account_name}(id:${ele.account_id})`
        );
        seriesData.push({
          name: key,
          type: 'bar',
          barMaxWidth: '20px',
          barGap: 0,
          data: vals.map(
            ele => ele[this.propkey] ? ele[this.propkey].toString().split(',').join('') : 0
          )
        });
      }
      // 计算时间
      const options = {
        title: {
          subtext: `${val.info.time.startDate} ~ ${val.info.time.endDate}`,
          x: 'left',
          align: 'left',
          subtextStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        grid: {
          left: '20px',
          bottom: '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData,
          left: 'left',
          bottom: 'bottom'
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisLabel: {
              interval: 0,
              align: 'middle',
              formatter: this.calcuAxisData
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesData.reverse()
      };
      // 计算dom
      let that = this;
      this.chart.on('click', function(params) {
        const list = that.datas.info.dimensionDesc.split(',');
        setItem(`${that.datas.chartQuery.chartQuery.id}dimensionList`, list);
        let name = params.name.split('(id:')[0];
        let id = params.name.split('(id:')[1].substr(0, params.name.split('(id:')[1].length - 1);
        // 跳转
        if (that.ids === 'mediainfo') {
          // 媒体
          let url = '';
          url = window.location.origin + window.location.pathname + '#!/tuiachartcenter/tuiatableview/' +
            `${that.datas.chartQuery.chartQuery.id}/${'null'}/${id || 'null'}/${val.info.time.startDate || 'null'}/${val.info.time.endDate || 'null'}/${name || 'null'}/${'null'}`;
          window.open(url);
        } else {
          let url = '';
          url = window.location.origin + window.location.pathname + '#!/tuiachartcenter/tuiatableview/' +
            `${that.datas.chartQuery.chartQuery.id}/${id || 'null'}/${'null'}/${val.info.time.startDate || 'null'}/${val.info.time.endDate || 'null'}/${'null'}/${name || 'null'}`;
          window.open(url);
        }
      });
      this.chart.setOption(options);
    }
  },
  watch: {
    datas: {
      handler: function(val) {
        if (
          this.chart !== null &&
          this.chart !== '' &&
          this.chart !== undefined
        ) {
          this.chart.dispose();
        }
        // bar自适应
        const valcount = val.data;
        // 计算个数
        let {values} = Object;
        let count = 0;
        values(valcount).map((ele) => {
          count += ele.length;
        });
        if (count * 20 + count / values(valcount).length * 120 < window.screen.availWidth) {
          this.styles.width = window.screen.availWidth + 'px';
        } else {
          this.styles.width = count * 20 + count / values(valcount).length * 170 + 'px';
        }
        this.$nextTick(() => {
          this.chart = echarts.init(document.getElementById(this.ids));
          this._initchart(val);
        });
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
.barchart-wrapper {
  margin-top: 40px;
  h2 {
    cursor: pointer;
    font-size: 20px;
    &:hover {
      color: chocolate;
    }
  }
  .barchart-item {
    // width:150%;
    height: 600px;
  }
}
</style>

