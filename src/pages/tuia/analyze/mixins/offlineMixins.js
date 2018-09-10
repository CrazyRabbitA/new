const quotasArr = [
  {
    title: '广告位返回成功PV',
    id: 'actSucResponseCount'
  },
  {
    title: '广告位曝光PV',
    id: 'actExposeCount'
  },
  {
    title: '广告位曝光UV',
    id: 'actExposeUv'
  },
  {
    title: '广告位点击PV',
    id: 'actClickCount'
  },
  {
    title: '广告位点击UV',
    id: 'actClickUv'
  },
  {
    title: '广告位点击率',
    id: 'actClickRate'
  },
  {
    title: '广告位访问PV',
    id: 'sdkPv'
  },
  {
    title: '广告位访问UV',
    id: 'sdkUv'
  },
  {
    title: '活动请求PV',
    id: 'actRequestCount'
  },
  {
    title: '活动请求UV',
    id: 'actRequestUv'
  },
  {
    title: '活动参与PV',
    id: 'participateCount'
  },
  {
    title: '活动参与UV',
    id: 'participateUv'
  },
  {
    title: '参与率',
    id: 'participateRate'
  },
  {
    title: '复参数',
    id: 'participateTimes'
  },
  {
    title: '每UV发券',
    id: 'launchPerUv'
  },
  {
    title: '每UV券请求',
    id: 'arcPsu'
  },
  {
    title: '广告券请求数',
    id: 'advertRequestCount'
  },
  {
    title: '广告券发券量',
    id: 'launchCount'
  },
  {
    title: '付费券占比',
    id: 'plpPlc'
  },
  {
    title: '请求成功率',
    id: 'requestSuccessRate'
  },
  {
    title: '发券成功率',
    id: 'launchSuccessRate'
  },
  {
    title: '广告券曝光量',
    id: 'advertExposureCount'
  },
  {
    title: '广告劵点击量',
    id: 'efClickCount'
  },
  {
    title: '每UV券点击',
    id: 'clickPerUv'
  },
  {
    title: '广告券点击率',
    id: 'advertClickRate'
  },
  {
    title: '广告券点击单价',
    id: 'adClickPrice'
  },
  {
    title: '发券ARPU值',
    id: 'launchArpu'
  },
  {
    title: '付费券arpu值',
    id: 'acPplp'
  },
  {
    title: '媒体CPM',
    id: 'mediaCpm'
  },
  {
    title: 'UV单价（元）',
    id: 'uvPrice'
  },
  {
    title: '媒体UV单价（元）',
    id: 'mediaUvPrice'
  },
  {
    title: '活动点击单价',
    id: 'actClickPrice'
  },
  {
    title: '媒体点击单价',
    id: 'mediaClickPrice'
  },
  {
    title: '广告消耗',
    id: 'adConsume'
  },
  {
    title: '媒体预计分成',
    id: 'mediaExDivide'
  },
  {
    title: '媒体应得分成',
    id: 'mediaDueDivide'
  },
  {
    title: '分成比例',
    id: 'dividePercent'
  },
  {
    title: '广告位CTR(UV)',
    id: 'ctr'
  },
  {
    title: '付费券点击率',
    id: 'plpClickRate'
  },
  {
    title: '付费券点击单价',
    id: 'plpClickPrice'
  }
];
export default {
  data() {
    return {
      quotasArr: quotasArr,
      typeName: []
    };
  },
  methods: {
    /**
     * @param {any} lineList 图表数据
     * @param {any} type 指标
     */
    getResourcesDate(lineList, type) {
      this.getTypeName(type);
      let leftLine = {
        name: this.typeName[0],
        type: 'line',
        itemStyle: {
          normal: {
            color: '#73cfca',
            borderWidth: 4
          }
        },
        data: []
      };
      let rightLine = {
        name: this.typeName[1],
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#ff9090',
            borderWidth: 4
          }
        },
        data: []
      };
      let dataList = [];
      let xData = Object.keys(lineList);
      let yData = [];
      if (type[0] && !this.isEmptyObject(lineList)) {
        Object.keys(lineList).forEach((key) => {
          if (lineList[key][(type[0])] === null) {
            leftLine.data.push('-');
          } else {
            leftLine.data.push(lineList[key][(type[0])]);
          }
        });
        yData.push({
          name: this.typeName[0],
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
                return (value / 1000) + 'k';
              }
              return value;
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        });
        dataList.push(leftLine);
      }
      if (type[1] && !this.isEmptyObject(rightLine.type[1])) {
        Object.keys(lineList).forEach((key) => {
          if (lineList[key][(type[1])] === null) {
            rightLine.data.push('-');
          } else {
            rightLine.data.push(lineList[key][(type[1])]);
          }
        });
        yData.push({
          name: this.typeName[1],
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
                return (value / 1000) + 'k';
              }
              return value;
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        });
        dataList.push(rightLine);
      }
      this.renderLineChart(dataList, xData, yData);
    },
    getTypeName(type) {
      this.typeName = [];
      if (type[0]) {
        this.quotasArr.forEach((item) => {
          if (item.id === type[0]) {
            this.typeName.push(item.title);
          }
        });
      }
      if (type[1]) {
        this.quotasArr.forEach((item) => {
          if (item.id === type[1]) {
            this.typeName.push(item.title);
          }
        });
      }
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    },
    _fixNum(num) {
      num = Number(num);
      let isFloatNum = (num.toString()).indexOf('.');
      let isPrecentNum = (num.toString()).indexOf('%');
      if (isPrecentNum === -1 && isFloatNum !== -1) {
        num = num.toFixed(2);
      }
      let result = Number(num);
      if (result) {
        num = num + '';
        let fix = ''; // 小数点情况
        let splitArr = num.split('.');
        num = splitArr[0];
        fix = splitArr[1] ? splitArr[1] : '';
        num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
          return s + ',';
        });
        if (fix) {
          return num + '.' + fix;
        }
        return num + fix;
      }
      return num;
    }
  }
};
