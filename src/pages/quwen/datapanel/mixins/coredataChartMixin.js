import echarts from 'echarts';
import MessageBox from 'components/basic/MessageBox';
import { _fixNum } from 'components/utils/cheatDataUtils';
export default {
  data() {
    return {
      chartDatas: {
        linedatas: {},
        piedatas: {}
      },
      axisData: [],
      legendData: [],
      seriesData: [],
      lineTotalTitle: {},
      lineTitle: [],
      keys: [],
      showloading: true
    };
  },
  methods: {
    getChartData(type = 1, indicatorsTypeItem = 'appStartUser') {
      this.$http.post('/quwen/coredata', this.params).then((res) => {
        res = res.json();

        if (res.success) {
          if (res.data.detail.detail && res.data.pieChart.pieChart && (typeof res.data.detail.detail) === 'string' && (typeof res.data.pieChart.pieChart) === 'string') {
            MessageBox({
              title: '当前所选时段不足一个自然周',
              type: 'error'
            });
            return;
          };
          this.lineTotalTitle = res.data.avg ? res.data.avg : {};
          const lastlineData = res.data.detail;
          const lastpiedata = res.data.pieChart;
          this.chartDatas = Object.assign({}, {
            linedatas: lastlineData,
            piedatas: lastpiedata
          });
          setTimeout(() => {
            this.initChart(type, indicatorsTypeItem);
          }, 200);
        }
      }, res => {
        MessageBox({
          title: '网络错误',
          type: 'error'
        });
        this.showloading = false;
      });
    },
    // initChart(type = 1, indicatorsTypeItem = 'appStartUser') {
    initChart(type, indicatorsTypeItem) {
      // 初始化
      this._fixNum(type, indicatorsTypeItem);
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(document.getElementById('canvas'));
      let option = {};
      // 大盘
      if (this.legendData.length === 1 && this.legendData[0] === 'dashBoard') {
        this.legendData = ['大盘'];
      }
      this.legendData = this.legendData.map((ele) => {
        if (ele.split('-') && ele === '1') {
          ele = '新用户';
        }
        if (ele.split('-') && ele === '2') {
          ele = '老用户';
        }
        let itemkey = '';
        if (ele.length > 1 && ele.indexOf('-') > -1) {
          const keys = ele.split('-');
          keys.forEach((item) => {
            if (item === '1') {
              item = '新用户';
            }
            if (item === '2') {
              item = '老用户';
            }
            itemkey += item + '-';
          });
          ele = itemkey.substr(0, itemkey.length - 1);
        }
        return ele;
      });
      if (type === 0) {
        // 计算指标没有饼图
        if (indicatorsTypeItem === 'avgVisitDuration' || indicatorsTypeItem === 'avgStartCt' || indicatorsTypeItem === 'loginRate' || indicatorsTypeItem === 'articleClickAvg' ||
        indicatorsTypeItem === 'vedioClickAvg' || indicatorsTypeItem === 'readingDuration' || indicatorsTypeItem === 'avgReadinguserDuration' ||
        indicatorsTypeItem === 'avgReadingDuration' || indicatorsTypeItem === 'readingRate' || indicatorsTypeItem === 'avgWatchinguserDuration' ||
        indicatorsTypeItem === 'avgWatchingDuration' || indicatorsTypeItem === 'watchingRate' || indicatorsTypeItem === 'dayStayRate' ||
        indicatorsTypeItem === 'weekStayRate' || indicatorsTypeItem === 'monthStayRate' || indicatorsTypeItem === 'uvProfit'
        ) {
          MessageBox({
            title: '当前指标不适用饼图，请选择其他图表类型',
            type: 'error'
          });
          return;
        }
        option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.legendData
          },
          series: this.seriesData
        };
      } else {
        option = {
          // 浮层
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let tpl = '';
              params.forEach(function(item, index) {
                if (index === 0) {
                  tpl += item.axisValue + '<br/>';
                }
                let name = item.seriesName.split('：')[0];
                if (name === 'dashBoard') {
                  name = '大盘';
                }
                let data = item.data;
               // 百分数
                if (indicatorsTypeItem === 'loginRate' || indicatorsTypeItem === 'readingRate' || indicatorsTypeItem === 'dayStayRate' ||
                indicatorsTypeItem === 'weekStayRate' || indicatorsTypeItem === 'monthStayRate' || indicatorsTypeItem === 'watchingRate') {
                  data = _fixNum((data) * 100, 2) + '%';
                } else if (indicatorsTypeItem === 'avgStartCt' || indicatorsTypeItem === 'visitDuration' || indicatorsTypeItem === 'readingDuration' || indicatorsTypeItem === 'watchingDuration' ||
                  indicatorsTypeItem === 'avgWatchinguserDuration' || indicatorsTypeItem === 'avgWatchingDuration' || indicatorsTypeItem === 'avgReadinguserDuration' || indicatorsTypeItem === 'avgReadingDuration' ||
                  indicatorsTypeItem === 'avgVisitDuration' || indicatorsTypeItem === 'vedioClickAvg' || indicatorsTypeItem === 'articleClickAvg' || indicatorsTypeItem === 'uvProfit' || indicatorsTypeItem === 'consumeTotal'
                ) {
                   // 保留两位小数
                  data = _fixNum(data, 2);
                } else if (data === '-') {
                  data = '无穷大';
                } else {
                  data = _fixNum(data, 0);
                }
                // 格式化
                tpl +=
                  '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + name + '：' + data + '<br/>';
              });
              return tpl;
            },
            position: function(point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0], '10%'];
            }
          },
          legend: {
            data: this.legendData,
            // show: this.legendData[0] === 'dashBoard'? false : true,
            bottom: '0'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.axisData
          },
          yAxis: {
            // y轴显示
            axisLabel: {
              formatter: function(val, index) {
                // 大于1000

                if (val > 1000) {
                  val = val / 1000 + 'k';
                }
                // 小于1
                // 百分数
                if (indicatorsTypeItem === 'loginRate' || indicatorsTypeItem === 'readingRate' || indicatorsTypeItem === 'dayStayRate' ||
                indicatorsTypeItem === 'weekStayRate' || indicatorsTypeItem === 'monthStayRate' || indicatorsTypeItem === 'watchingRate') {
                  val = _fixNum((val) * 100, 0) + '%';
                }
                return val;
                // return indicatorsTypeItem === 'loginRate' || indicatorsTypeItem === 'readingRate' || indicatorsTypeItem === 'dayStayRate' ||
                // indicatorsTypeItem === 'weekStayRate' || indicatorsTypeItem === 'monthStayRate' || indicatorsTypeItem === 'watchingRate' ? _fixNum((val) * 100, 0) + '%' : val;
              },
              margin: 12
            } },
          series: this.seriesData
        };
      }
      this.myChart.clear();
      this.myChart.setOption(option);
    },
    _fixNum(type, indicatorsTypeItem) {
      let datas = {};
      let seriesdata = {};
      let vals;
      let cacheObj;
      switch (type) {
        case 2: //  柱状图
          datas = this.chartDatas.linedatas;
          seriesdata = datas[indicatorsTypeItem];
          this.legendData = Object.keys(seriesdata);
          vals = Object.values(seriesdata)[0];
          // queryType --- 横轴坐标
          if (this.params.queryType === 1) {
            this.axisData = vals.map((ele) => {
              return ele.time === 'dashBoard' ? '大盘' : ele.time;
              // return ele.time;
            });
          } else {
            this.axisData = vals.map((ele) => {
              return `第${ele.time}周`;
            });
          }
          cacheObj = [];
          // 无穷大的时候
          Object.entries(seriesdata).forEach((item, index) => {
            let dataArr = item[1].map((ele) => {
              // return ele.value;
              return ele.value === 'null' ? '-' : ele.value;
            });
            if (item[0] === '1') {
              item[0] = '新用户';
            }
            if (item[0] === '2') {
              item[0] = '老用户';
            }
            let itemkey = '';
            if (item[0].length > 1 && item[0].indexOf('-') > -1) {
              const keys = item[0].split('-');
              keys.forEach((ele) => {
                if (ele === '1') {
                  ele = '新用户';
                }
                if (ele === '2') {
                  ele = '老用户';
                }
                itemkey += ele + '-';
              });
              item[0] = itemkey.substr(0, itemkey.length - 1);
            }
            cacheObj.push({
              name: item[0] === 'dashBoard' ? '大盘' : item[0],
              // name: item[0],
              data: dataArr,
              type: 'bar',
              // barWidth: '30px',
              barMinWidth: '15px',
              barMaxWidth: '30px'
            });
          });
          this.seriesData = cacheObj;
          break;
        case 1: // 折线图
          datas = this.chartDatas.linedatas;
          seriesdata = datas[indicatorsTypeItem];
          this.legendData = Object.keys(seriesdata);
          vals = Object.values(seriesdata)[0];
          // queryType --- 横轴坐标
          if (this.params.queryType === 1) {
            this.axisData = vals.map((ele) => {
              // return ele.time;
              return ele.time;
            });
          } else {
            this.axisData = vals.map((ele) => {
              return `第${ele.time}周`;
            });
          }
          cacheObj = [];
          Object.entries(seriesdata).forEach((item, index) => {
            let dataArr = item[1].map((ele) => {
              return ele.value === 'null' ? '-' : ele.value;
            });
            if (item[0] === '1') {
              item[0] = '新用户';
            }
            if (item[0] === '2') {
              item[0] = '老用户';
            }
            // 组合情况
            let itemkey = '';
            if (item[0].length > 1 && item[0].indexOf('-') > -1) {
              const keys = item[0].split('-');
              keys.forEach((ele) => {
                if (ele === '1') {
                  ele = '新用户';
                }
                if (ele === '2') {
                  ele = '老用户';
                }
                itemkey += ele + '-';
              });
              item[0] = itemkey.substr(0, itemkey.length - 1);
            }
            cacheObj.push({
              name: item[0] === 'dashBoard' ? '大盘' : item[0],
              // name: item[0],
              data: dataArr,
              type: 'line',
              itemStyle: {
                normal: {
                  color: this.colorArr[index]
                }
              }
            });
          });
          this.seriesData = cacheObj;
          Object.values(this.lineTotalTitle).forEach((ele) => {
            this.lineTitle.push(ele[indicatorsTypeItem].toFixed(2));
          });
          break;
        case 0: // 饼图
          datas = this.chartDatas.piedatas;
          // seriesdata = datas[indicatorsTypeItem];
          this.legendData = Object.keys(datas);
          let data = [];

          for (let [key, val] of Object.entries(datas)) {
            if (key === '1') {
              key = '新用户';
            }
            if (key === '2') {
              key = '老用户';
            }
            // 组合情况
            let itemkey = '';
            if (key.length > 1 && key.indexOf('-') > -1) {
              const keys = key.split('-');
              keys.forEach((ele) => {
                if (ele === '1') {
                  ele = '新用户';
                }
                if (ele === '2') {
                  ele = '老用户';
                }
                itemkey += ele + '-';
              });
              key = itemkey.substr(0, itemkey.length - 1);
            }
            data.push({
              name: key === 'dashBoard' ? '大盘' : key,
              // name:this.totalindicator[indicatorsTypeItem],
              value: val[indicatorsTypeItem]
            });
          }
          this.seriesData = {
            name: this.totalindicator[indicatorsTypeItem],
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          };
          break;
      }
    }
    // _fixNum1(num) {
    //   let result = Number(num);
    //   if (result) {
    //     num = num + '';
    //     let fix = ''; // 小数点情况
    //     let splitArr = num.split('.');
    //     num = splitArr[0];
    //     fix = splitArr[1] ? splitArr[1] : '';
    //     num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
    //       return s + ',';
    //     });
    //     return num + fix;
    //   }

    //   return num;
    // }
  }
};
