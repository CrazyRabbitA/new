export default {
  data() {
    return {
      visitDate: [
        {
          // actSucResponseCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告位请求(PV)'
        },
        {
          // actExposeCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告位曝光(PV)'
        },
        {
          // actClickCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告位点击(PV)'
        },
        {
          // actClickUv
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告位点击(UV)'
        },
        {
          // sdkUv
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告位访问(UV)'
        },
        {
          // actRequestUv
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '活动访问(UV)'
        },
        {
          // participateUv
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '活动参与(UV)'
        }
      ],
      reqDate: [
        {
          // participateCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '活动参与(PV)'
        }, {
          // advertRequestCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告券请求(PV)'
        }, {
          // launchCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '发券量'
        }, {
          // advertExposureCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告券曝光(PV)'
        }, {
          // advertClickCount
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                let showPercent = this.percent[params.seriesIndex] + '%';
                let tpl = this._fixNum(Math.abs(params.value)) + '(' + showPercent + ')';
                return tpl;
              },
              textStyle: {
                color: '#000'
              }
            }
          },
          data: [0],
          type: 'bar',
          name: '广告券点击(PV)'
        }
      ],
      percent: []
    };
  },
  methods: {
    getChartData(list, data, time, type) {
      this.percent = [];
      if (type === 'visit' && time === 'all') {
        // 广告位请求(PV)
        let actSucResponseCountList = list[data].actSucResponseCount;
        let actSucResponseCountListLen = Object.values(actSucResponseCountList).length;
        let actSucResponseCountListSum = 0;
        for (let i = 0; i < actSucResponseCountListLen; i++) {
          actSucResponseCountListSum += Object.values(actSucResponseCountList)[i];
          if (Object.keys(actSucResponseCountList)[i] === time) {
            break;
          }
        }
        this.visitDate[0].data[0] = this.getAllCount(actSucResponseCountListSum, 0);
        // 广告位曝光(PV)
        let actExposeCountList = list[data].actExposeCount;
        let actExposeCountListLen = Object.values(actExposeCountList).length;
        let actExposeCountListSum = 0;
        for (let i = 0; i < actExposeCountListLen; i++) {
          actExposeCountListSum += Object.values(actExposeCountList)[i];
          if (Object.keys(actExposeCountList)[i] === time) {
            break;
          }
        }
        this.visitDate[1].data[0] = this.getAllCount(actExposeCountListSum, actSucResponseCountListSum);

        let actClickCountList = list[data].actClickCount;
        let actClickCountListLen = Object.values(actClickCountList).length;
        let actClickCountListSum = 0;
        for (let i = 0; i < actClickCountListLen; i++) {
          actClickCountListSum += Object.values(actClickCountList)[i];
          if (Object.keys(actClickCountList)[i] === time) {
            break;
          }
        }
        this.visitDate[2].data[0] = this.getAllCount(actClickCountListSum, actExposeCountListSum);

        let actClickUvList = list[data].actClickUv;
        let actClickUvListLen = Object.values(actClickUvList).length;
        let actClickUvListSum = 0;
        for (let i = 0; i < actClickUvListLen; i++) {
          actClickUvListSum += Object.values(actClickUvList)[i];
          if (Object.keys(actClickUvList)[i] === time) {
            break;
          }
        }
        this.visitDate[3].data[0] = this.getAllCount(actClickUvListSum, actClickCountListSum);
        /* 活动维度  和 活动+广告位 ， 活动+媒体 维度， 没有 广告位访问(UV) 数据，不展示此数据 */
        let actRequestUvListSum = 0;
        if (this.isShowSdkUv) {
          let sdkUvList = list[data].sdkUv;
          let sdkUvListLen = Object.values(sdkUvList).length;
          let sdkUvListSum = 0;
          for (let i = 0; i < sdkUvListLen; i++) {
            sdkUvListSum += Object.values(sdkUvList)[i];
            if (Object.keys(sdkUvList)[i] === time) {
              break;
            }
          }
          this.visitDate[4].data[0] = this.getAllCount(sdkUvListSum, actClickUvListSum);

          let actRequestUvList = list[data].actRequestUv;
          let actRequestUvListLen = Object.values(actRequestUvList).length;
          for (let i = 0; i < actRequestUvListLen; i++) {
            actRequestUvListSum += Object.values(actRequestUvList)[i];
            if (Object.keys(actRequestUvList)[i] === time) {
              break;
            }
          }
          this.visitDate[5].data[0] = this.getAllCount(actRequestUvListSum, sdkUvListSum);
        } else {
          let actRequestUvList = list[data].actRequestUv;
          let actRequestUvListLen = Object.values(actRequestUvList).length;
          for (let i = 0; i < actRequestUvListLen; i++) {
            actRequestUvListSum += Object.values(actRequestUvList)[i];
            if (Object.keys(actRequestUvList)[i] === time) {
              break;
            }
          }
          this.visitDate[5].data[0] = this.getAllCount(actRequestUvListSum, actClickUvListSum);
        }

        let participateUvList = list[data].participateUv;
        let participateUvListLen = Object.values(participateUvList).length;
        let participateUvListSum = 0;
        for (let i = 0; i < participateUvListLen; i++) {
          participateUvListSum += Object.values(participateUvList)[i];
          if (Object.keys(participateUvList)[i] === time) {
            break;
          }
        }
        this.visitDate[6].data[0] = this.getAllCount(participateUvListSum, actRequestUvListSum);
        this.renderChart(this.visitDate);
      }
      if (type === 'visit' && time !== 'all') {
        // 广告位请求(PV)
        let actSucResponseCountList = list[data].actSucResponseCount;
        let actSucResponseCountListLen = Object.values(actSucResponseCountList).length;
        let actSucResponseCountListSum = 0;
        for (let i = 0; i < actSucResponseCountListLen; i++) {
          if (Object.keys(actSucResponseCountList)[i] === time) {
            actSucResponseCountListSum = Object.values(actSucResponseCountList)[i];
            break;
          }
        }
        this.visitDate[0].data[0] = this.getAllCount(actSucResponseCountListSum, 0);
        // 广告位曝光(PV)
        let actExposeCountList = list[data].actExposeCount;
        let actExposeCountListLen = Object.values(actExposeCountList).length;
        let actExposeCountListSum = 0;
        for (let i = 0; i < actExposeCountListLen; i++) {
          if (Object.keys(actExposeCountList)[i] === time) {
            actExposeCountListSum = Object.values(actExposeCountList)[i];
            break;
          }
        }
        this.visitDate[1].data[0] = this.getAllCount(actExposeCountListSum, actSucResponseCountListSum);

        let actClickCountList = list[data].actClickCount;
        let actClickCountListLen = Object.values(actClickCountList).length;
        let actClickCountListSum = 0;
        for (let i = 0; i < actClickCountListLen; i++) {
          if (Object.keys(actClickCountList)[i] === time) {
            actClickCountListSum = Object.values(actClickCountList)[i];
            break;
          }
        }
        this.visitDate[2].data[0] = this.getAllCount(actClickCountListSum, actExposeCountListSum);

        let actClickUvList = list[data].actClickUv;
        let actClickUvListLen = Object.values(actClickUvList).length;
        let actClickUvListSum = 0;
        for (let i = 0; i < actClickUvListLen; i++) {
          if (Object.keys(actClickUvList)[i] === time) {
            actClickUvListSum = Object.values(actClickUvList)[i];
            break;
          }
        }
        this.visitDate[3].data[0] = this.getAllCount(actClickUvListSum, actClickCountListSum);
        /* 活动维度  和 活动+广告位 ， 活动+媒体 维度， 没有 广告位访问(UV) 数据，不展示此数据 */
        let actRequestUvListSum = 0;
        if (this.isShowSdkUv) {
          let sdkUvList = list[data].sdkUv;
          let sdkUvListLen = Object.values(sdkUvList).length;
          let sdkUvListSum = 0;
          for (let i = 0; i < sdkUvListLen; i++) {
            if (Object.keys(sdkUvList)[i] === time) {
              sdkUvListSum = Object.values(sdkUvList)[i];
              break;
            }
          }
          this.visitDate[4].data[0] = this.getAllCount(sdkUvListSum, actClickUvListSum);

          let actRequestUvList = list[data].actRequestUv;
          let actRequestUvListLen = Object.values(actRequestUvList).length;
          for (let i = 0; i < actRequestUvListLen; i++) {
            if (Object.keys(actRequestUvList)[i] === time) {
              actRequestUvListSum = Object.values(actRequestUvList)[i];
              break;
            }
          }
          this.visitDate[5].data[0] = this.getAllCount(actRequestUvListSum, sdkUvListSum);
        } else {
          let actRequestUvList = list[data].actRequestUv;
          let actRequestUvListLen = Object.values(actRequestUvList).length;
          for (let i = 0; i < actRequestUvListLen; i++) {
            if (Object.keys(actRequestUvList)[i] === time) {
              actRequestUvListSum = Object.values(actRequestUvList)[i];
              break;
            }
          }
          this.visitDate[5].data[0] = this.getAllCount(actRequestUvListSum, actClickUvListSum);
        }

        let participateUvList = list[data].participateUv;
        let participateUvListLen = Object.values(participateUvList).length;
        let participateUvListSum = 0;
        for (let i = 0; i < participateUvListLen; i++) {
          if (Object.keys(participateUvList)[i] === time) {
            participateUvListSum = Object.values(participateUvList)[i];
            break;
          }
        }
        this.visitDate[6].data[0] = this.getAllCount(participateUvListSum, actRequestUvListSum);
        this.renderChart(this.visitDate);
      }
      if (type === 'req' && time === 'all') {
        let participateCountList = list[data].participateCount;
        let participateCountListLen = Object.values(participateCountList).length;
        let participateCountListSum = 0;
        for (let i = 0; i < participateCountListLen; i++) {
          participateCountListSum += Object.values(participateCountList)[i];
          if (Object.keys(participateCountList)[i] === time) {
            break;
          }
        }
        this.reqDate[0].data[0] = this.getAllCount(participateCountListSum, 0);

        let advertRequestCountList = list[data].advertRequestCount;
        let advertRequestCountListLen = Object.values(advertRequestCountList).length;
        let advertRequestCountListSum = 0;
        for (let i = 0; i < advertRequestCountListLen; i++) {
          advertRequestCountListSum += Object.values(advertRequestCountList)[i];
          if (Object.keys(advertRequestCountList)[i] === time) {
            break;
          }
        }
        this.reqDate[1].data[0] = this.getAllCount(advertRequestCountListSum, participateCountListSum);

        let launchCountList = list[data].launchCount;
        let launchCountListLen = Object.values(launchCountList).length;
        let launchCountListLenSum = 0;
        for (let i = 0; i < launchCountListLen; i++) {
          launchCountListLenSum += Object.values(launchCountList)[i];
          if (Object.keys(launchCountList)[i] === time) {
            break;
          }
        }
        this.reqDate[2].data[0] = this.getAllCount(launchCountListLenSum, advertRequestCountListSum);

        let advertExposureCountList = list[data].advertExposureCount;
        let advertExposureCountListLen = Object.values(advertExposureCountList).length;
        let advertExposureCountListSum = 0;
        for (let i = 0; i < advertExposureCountListLen; i++) {
          advertExposureCountListSum += Object.values(advertExposureCountList)[i];
          if (Object.keys(advertExposureCountList)[i] === time) {
            break;
          }
        }
        this.reqDate[3].data[0] = this.getAllCount(advertExposureCountListSum, launchCountListLenSum);

        let advertClickCountList = list[data].advertClickCount;
        let advertClickCountListLen = Object.values(advertClickCountList).length;
        let advertClickCountListSum = 0;
        for (let i = 0; i < advertClickCountListLen; i++) {
          advertClickCountListSum += Object.values(advertClickCountList)[i];
          if (Object.keys(advertClickCountList)[i] === time) {
            break;
          }
        }
        this.reqDate[4].data[0] = this.getAllCount(advertClickCountListSum, advertExposureCountListSum);
        this.renderChart(this.reqDate);
      }
      if (type === 'req' && time !== 'all') {
        let participateCountList = list[data].participateCount;
        let participateCountListLen = Object.values(participateCountList).length;
        let participateCountListSum = 0;
        for (let i = 0; i < participateCountListLen; i++) {
          if (Object.keys(participateCountList)[i] === time) {
            participateCountListSum += Object.values(participateCountList)[i];
            break;
          }
        }
        this.reqDate[0].data[0] = this.getAllCount(participateCountListSum, 0);

        let advertRequestCountList = list[data].advertRequestCount;
        let advertRequestCountListLen = Object.values(advertRequestCountList).length;
        let advertRequestCountListSum = 0;
        for (let i = 0; i < advertRequestCountListLen; i++) {
          if (Object.keys(advertRequestCountList)[i] === time) {
            advertRequestCountListSum = Object.values(advertRequestCountList)[i];
            break;
          }
        }
        this.reqDate[1].data[0] = this.getAllCount(advertRequestCountListSum, participateCountListSum);

        let launchCountList = list[data].launchCount;
        let launchCountListLen = Object.values(launchCountList).length;
        let launchCountListLenSum = 0;
        for (let i = 0; i < launchCountListLen; i++) {
          if (Object.keys(launchCountList)[i] === time) {
            launchCountListLenSum = Object.values(launchCountList)[i];
            break;
          }
        }
        this.reqDate[2].data[0] = this.getAllCount(launchCountListLenSum, advertRequestCountListSum);

        let advertExposureCountList = list[data].advertExposureCount;
        let advertExposureCountListLen = Object.values(advertExposureCountList).length;
        let advertExposureCountListSum = 0;
        for (let i = 0; i < advertExposureCountListLen; i++) {
          if (Object.keys(advertExposureCountList)[i] === time) {
            advertExposureCountListSum = Object.values(advertExposureCountList)[i];
            break;
          }
        }
        this.reqDate[3].data[0] = this.getAllCount(advertExposureCountListSum, launchCountListLenSum);

        let advertClickCountList = list[data].advertClickCount;
        let advertClickCountListLen = Object.values(advertClickCountList).length;
        let advertClickCountListSum = 0;
        for (let i = 0; i < advertClickCountListLen; i++) {
          if (Object.keys(advertClickCountList)[i] === time) {
            advertClickCountListSum = Object.values(advertClickCountList)[i];
            break;
          }
        }
        this.reqDate[4].data[0] = this.getAllCount(advertClickCountListSum, advertExposureCountListSum);
        this.renderChart(this.reqDate);
      }
    },
    getAllCount(count, sum) {
      if (!!sum) {
        this.percent.push(((count / sum) * 100).toFixed(2));
      } else {
        this.percent.push(100);
      }
      return count;
    },
    _fixNum(num) {
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
        return num + fix;
      }
      return num;
    }
  }
};
