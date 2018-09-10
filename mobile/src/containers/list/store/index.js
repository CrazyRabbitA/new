import { observable, action } from 'mobx';
import common from '../../../lib/common';
import { fixNum } from '../../../lib/dataFormate';

function formatNum(type, num) {
  if (isNaN(parseInt(num))) {
    return '-';
  }
  // null
  if (type === null) {
    return '-';
  }
  // 浮点数
  if (type === 'float') {
    return fixNum(num, 3);
  }
  // 整数
  if (type === 'int') {
    return fixNum(num, 0);
  }
  // 百分比
  if (type === '%') {
    return parseFloat((num * 100).toPrecision(12)) + '%';
  }
  return num;
}
class State {
  // 请求参数
  @observable
  params = {
    appSource: 2,
    quota: 'totalChargeFees',
    name: '消耗'
  }
  // 更新params
  @action
  updateParams = (params) => {
    this.params = Object.assign({}, this.params, params);
  }
  // 报表数据
  @observable
  dataList = [];
  @observable
  fromateDataList = [];
  // 图表实例
  @observable
  resourcesline = '';
  // 更新图表实例
  @action
  updataResourcesline = (line) => {
    const promise = new Promise((resolve, reject) => {
      this.resourcesline = line;
      resolve();
    })
    return promise;
  }
  // 获取推啊报表
  @action
  getDataList = () => {
    const promise = new Promise((resolve, reject) => {
      common.fetch('/mobile/report/tuia', this.params, 'get')
        .then(res => {
          this.dataList = res.data || [];
          resolve(res);
        });
    });
    return promise; 
  }
  // 获取图表配置
  getDpr = () => {
    var dpr = window.devicePixelRatio;
    if (dpr == 1) {
        return 14;
    }else if (dpr == 2) {
        return  28;
    }else {
        return 42;
    }
  };

  @action
  renderLineChart = () => {
    this.resourcesline.clear();
    let type = this.params.quota;
    // 测试长度
    let dataList = this.dataList;
    let name = this.params.name;
    //获取标准格式的字段
    let data = dataList.map(k => k[type]);
    let chartData = [];
    let option = {
      tooltip : {
        trigger: 'axis',
        padding: 5,
        axisLabel : {
          textStyle : {
            fontSize : this.getDpr()
          }
        },
        axisPointer:{
          show: true,
          type : 'line',
          lineStyle: {
              type : 'solid',
              color: '#000',
              shadowColor: '#000',
              width : 5,
              opacity: 0.4
          }
        },
        formatter: (params) => {
          let tpl = '<br/>';
          let self = this;
          params.forEach(function(item, index) {
            let data = item.data;
            if (type === 'avgClickFee' || type === 'orderAvgFee' || type === 'userFaquanAvgCnt' || type === 'feeArpu') {
              tpl += name + '：' + formatNum('float', data) + '<br/>';
            } else if (type === 'ctr' || type === 'bianliRatio' || type === 'freeRate') {
              tpl += name + '：' + formatNum('%', data) + '<br/>';
            } else {
              tpl += name + '：' + formatNum('int', data) + '<br/>';
            }
          });
          return `<div style="font-size:${this.getDpr()}px; height="40px;" padding="40px">${tpl}<br/></div>`;
        }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: '30%',
        containLabel: true
      },
      xAxis : [
        {
          type: 'category',
          boundaryGap: false,
          data: dataList.map(k => k.gmtCreateDate),
          axisLabel : {
            textStyle : {
              fontSize : this.getDpr()
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      yAxis : [
        {
          show : false,
        }
      ],
      series: [
        {
            name: name,
            type:'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top',
                fontSize : this.getDpr(),
                color: '#000',
                formatter: (params) => {
                  let self = this;
                    let dataLen = formatNum('float', dataList[0][type]);
                    if (dataLen.length > 10 && (params.dataIndex === 1 || params.dataIndex === 3 || params.dataIndex === 5)) {
                      return '';
                    } else {
                      if (type === 'avgClickFee' || type === 'orderAvgFee' || type === 'userFaquanAvgCnt' ||  type === 'feeArpu' ) {
                        return formatNum('float', params.data)
                      } else if (type === 'ctr' || type === 'bianliRatio' || type === 'freeRate') {
                        return formatNum('%', params.data)
                      } else {
                        return formatNum('int', params.data)
                      }
                    }
                }
              }
            },
            smooth: true,
            symbolSize: 18,
            symbol: 'emptyCircle',
            color: '#25A2FF',
            areaStyle: {
               color: '#25A2FF',
                normal: {
                  color: '#25A2FF',
                  opacity: "0.4",
                }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#25A2FF',
                  width: 6
                }
              }
            },
            data: data
        }
      ]
    }
    this.resourcesline.setOption(option);
  }
}

const store = new State();
export default store;
