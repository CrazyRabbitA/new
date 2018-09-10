export default {
  methods: {
    getLineDate(list, type) {
      this.showNewListForLine = {
        today: {},
        yesterday: {},
        before7days: {}
      };
      this.showNewListForLine.today.data = Object.values(list.today[type]) ? Object.values(list.today[type]) : '';
      this.showNewListForLine.today.data.unshift(0);
      Object.assign(this.showNewListForLine.today, this.itemSet.today);

      this.showNewListForLine.yesterday.data = Object.values(list.yesterday[type]) ? Object.values(list.yesterday[type]) : '';
      this.showNewListForLine.yesterday.data.unshift(0);
      Object.assign(this.showNewListForLine.yesterday, this.itemSet.yesterday);

      this.showNewListForLine.before7days.data = Object.values(list['7avg'][type]) ? Object.values(list['7avg'][type]) : '';
      this.showNewListForLine.before7days.data.unshift(0);
      Object.assign(this.showNewListForLine.before7days, this.itemSet.before7days);

      if (list.extraDate && list.extraDate.launchCount) {
        this.showNewListForLine.extradate = {};
        this.showNewListForLine.extradate.data = Object.values(list.extraDate[type]) ? Object.values(list.extraDate[type]) : '';
        this.showNewListForLine.extradate.data.unshift(0);
        Object.assign(this.showNewListForLine.extradate, this.itemSet.extradate);
      }
      this._fixData(this.showNewListForLine.today.data);
      this.renderLineChart(this.showNewListForLine);
      this.getToalData(list, type);
    },
    getToalData(list, type) {
      let todaySum = 0;
      let avgSum = 0;
      let extraDateSum = 0;
      let yesterdaySum = 0;
      let _todaySum = 0;
      let _avgSum = 0;
      let _extraDateSum = 0;
      let _yesterdaySum = 0;
      let self = this;
      // 需要计算非简单相加的指标
      if (self.selectDimension === 'advertClickRate' || self.selectDimension === 'participateRate' || self.selectDimension === 'dupliParticipateRate' || self.selectDimension === 'requestParticipateRate' || self.selectDimension === 'launchRequestRate' || self.selectDimension === 'clickExposureRate' || self.selectDimension === 'launchPerSdkUv' || self.selectDimension === 'clickPerSdk' || self.selectDimension === 'actParticipateRate' || self.selectDimension === 'advertFeePerSdkUv' || self.selectDimension === 'ctr' || self.selectDimension === 'clickPrice' || self.selectDimension === 'arcPsu' || self.selectDimension === 'plpPlc' || self.selectDimension === 'arpu' || self.selectDimension === 'acPplp') {
        switch (type) {
          case 'advertClickRate':
            Object.values(list['7avg']['actClickCount']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['actExposeCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['actClickCount']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['actExposeCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['actClickCount']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['actExposeCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['actClickCount']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['actExposeCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'participateRate':
            Object.values(list['7avg']['participateUv']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['actRequestUv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['participateUv']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['actRequestUv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['participateUv']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['actRequestUv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['participateUv']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['actRequestUv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'dupliParticipateRate':
            Object.values(list['7avg']['participateCount']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['participateUv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['participateCount']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['participateUv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['participateCount']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['participateUv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['participateCount']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['participateUv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'requestParticipateRate':
            Object.values(list['7avg']['advertRequestCount']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['participateCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertRequestCount']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['participateCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertRequestCount']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['participateCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertRequestCount']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['participateCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'launchRequestRate':
            Object.values(list['7avg']['launchCount']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['advertRequestCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['launchCount']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['advertRequestCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['launchCount']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['advertRequestCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['launchCount']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['advertRequestCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'clickPerSdk':
            // 活动相关页面计算指标不同
            if (this.isNotAct) {
              Object.values(list['7avg']['advertClickCount']).forEach(function(item) {
                avgSum = self.floatAdd(avgSum, item);
              });
              Object.values(list['7avg']['sdkUv']).forEach(function(item) {
                _avgSum = self.floatAdd(_avgSum, item);
              });
              if (list.extraDate && list.extraDate.launchCount) {
                Object.values(list['extraDate']['advertClickCount']).forEach(function(item) {
                  extraDateSum = self.floatAdd(extraDateSum, item);
                });
                Object.values(list['extraDate']['sdkUv']).forEach(function(item) {
                  _extraDateSum = self.floatAdd(_extraDateSum, item);
                });
              }
              Object.values(list['today']['advertClickCount']).forEach(function(item) {
                todaySum = self.floatAdd(todaySum, item);
              });
              Object.values(list['today']['sdkUv']).forEach(function(item) {
                _todaySum = self.floatAdd(_todaySum, item);
              });
              Object.values(list['yesterday']['advertClickCount']).forEach(function(item) {
                yesterdaySum = self.floatAdd(yesterdaySum, item);
              });
              Object.values(list['yesterday']['sdkUv']).forEach(function(item) {
                _yesterdaySum = self.floatAdd(_yesterdaySum, item);
              });
            } else {
              Object.values(list['7avg']['advertClickCount']).forEach(function(item) {
                avgSum = self.floatAdd(avgSum, item);
              });
              Object.values(list['7avg']['actRequestUv']).forEach(function(item) {
                _avgSum = self.floatAdd(_avgSum, item);
              });
              if (list.extraDate && list.extraDate.launchCount) {
                Object.values(list['extraDate']['advertClickCount']).forEach(function(item) {
                  extraDateSum = self.floatAdd(extraDateSum, item);
                });
                Object.values(list['extraDate']['actRequestUv']).forEach(function(item) {
                  _extraDateSum = self.floatAdd(_extraDateSum, item);
                });
              }
              Object.values(list['today']['advertClickCount']).forEach(function(item) {
                todaySum = self.floatAdd(todaySum, item);
              });
              Object.values(list['today']['actRequestUv']).forEach(function(item) {
                _todaySum = self.floatAdd(_todaySum, item);
              });
              Object.values(list['yesterday']['advertClickCount']).forEach(function(item) {
                yesterdaySum = self.floatAdd(yesterdaySum, item);
              });
              Object.values(list['yesterday']['actRequestUv']).forEach(function(item) {
                _yesterdaySum = self.floatAdd(_yesterdaySum, item);
              });
            }
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'launchPerSdkUv':
            if (this.isNotAct) {
              Object.values(list['7avg']['launchCount']).forEach(function(item) {
                avgSum = self.floatAdd(avgSum, item);
              });
              Object.values(list['7avg']['sdkUv']).forEach(function(item) {
                _avgSum = self.floatAdd(_avgSum, item);
              });
              if (list.extraDate && list.extraDate.launchCount) {
                Object.values(list['extraDate']['launchCount']).forEach(function(item) {
                  extraDateSum = self.floatAdd(extraDateSum, item);
                });
                Object.values(list['extraDate']['sdkUv']).forEach(function(item) {
                  _extraDateSum = self.floatAdd(_extraDateSum, item);
                });
              }
              Object.values(list['today']['launchCount']).forEach(function(item) {
                todaySum = self.floatAdd(todaySum, item);
              });
              Object.values(list['today']['sdkUv']).forEach(function(item) {
                _todaySum = self.floatAdd(_todaySum, item);
              });
              Object.values(list['yesterday']['launchCount']).forEach(function(item) {
                yesterdaySum = self.floatAdd(yesterdaySum, item);
              });
              Object.values(list['yesterday']['sdkUv']).forEach(function(item) {
                _yesterdaySum = self.floatAdd(_yesterdaySum, item);
              });
            } else {
              Object.values(list['7avg']['launchCount']).forEach(function(item) {
                avgSum = self.floatAdd(avgSum, item);
              });
              Object.values(list['7avg']['actRequestUv']).forEach(function(item) {
                _avgSum = self.floatAdd(_avgSum, item);
              });
              if (list.extraDate && list.extraDate.launchCount) {
                Object.values(list['extraDate']['launchCount']).forEach(function(item) {
                  extraDateSum = self.floatAdd(extraDateSum, item);
                });
                Object.values(list['extraDate']['actRequestUv']).forEach(function(item) {
                  _extraDateSum = self.floatAdd(_extraDateSum, item);
                });
              }
              Object.values(list['today']['launchCount']).forEach(function(item) {
                todaySum = self.floatAdd(todaySum, item);
              });
              Object.values(list['today']['actRequestUv']).forEach(function(item) {
                _todaySum = self.floatAdd(_todaySum, item);
              });
              Object.values(list['yesterday']['launchCount']).forEach(function(item) {
                yesterdaySum = self.floatAdd(yesterdaySum, item);
              });
              Object.values(list['yesterday']['actRequestUv']).forEach(function(item) {
                _yesterdaySum = self.floatAdd(_yesterdaySum, item);
              });
            }
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'actParticipateRate':
            Object.values(list['7avg']['participateUv']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['sdkUv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['participateUv']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['sdkUv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['participateUv']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['sdkUv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['participateUv']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['sdkUv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'advertFeePerSdkUv':
            Object.values(list['7avg']['advertFee']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['sdkUv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertFee']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['sdkUv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertFee']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['sdkUv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertFee']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['sdkUv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'ctr': // 广告位CTR（UV）(ctr) = 广告位访问UV(sdkuv)/广告位曝光UV(actExposeUv)
            Object.values(list['7avg']['sdkUv']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['actExposeUv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['sdkUv']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['actExposeUv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['sdkUv']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['actExposeUv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['sdkUv']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['actExposeUv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'clickPrice': // 点击单价(clickPrice) = 广告消耗(advertFee)/广告券点击PV(advertClickCount)
            Object.values(list['7avg']['advertFee']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['advertClickCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertFee']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['advertClickCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertFee']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['advertClickCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertFee']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['advertClickCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'arcPsu': // 每UV券请求 = advertRequestCount/sdkUv;
            Object.values(list['7avg']['advertRequestCount']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['sdkUv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertRequestCount']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['sdkUv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertRequestCount']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['sdkUv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertRequestCount']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['sdkUv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'plpPlc': // 每UV券请求 = payLaunchPv/launchCount;
            Object.values(list['7avg']['payLaunchPv']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['launchCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['payLaunchPv']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['launchCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['payLaunchPv']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['launchCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['payLaunchPv']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['launchCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
            break;
          case 'arpu': // arpu = advertFee/launchCount;
            Object.values(list['7avg']['advertFee']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['launchCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertFee']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['launchCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertFee']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['launchCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertFee']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['launchCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          case 'acPplp': // acPplp = advertFee/payLaunchPv;
            Object.values(list['7avg']['advertFee']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['payLaunchPv']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertFee']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['payLaunchPv']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertFee']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['payLaunchPv']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertFee']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['payLaunchPv']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum, true), self.floatDiv(yesterdaySum, _yesterdaySum, true), self.floatDiv(avgSum, _avgSum, true), self.floatDiv(extraDateSum, _extraDateSum, true)];
            break;
          default:
            Object.values(list['7avg']['advertClickCount']).forEach(function(item) {
              avgSum = self.floatAdd(avgSum, item);
            });
            Object.values(list['7avg']['advertExposureCount']).forEach(function(item) {
              _avgSum = self.floatAdd(_avgSum, item);
            });
            if (list.extraDate && list.extraDate.launchCount) {
              Object.values(list['extraDate']['advertClickCount']).forEach(function(item) {
                extraDateSum = self.floatAdd(extraDateSum, item);
              });
              Object.values(list['extraDate']['advertExposureCount']).forEach(function(item) {
                _extraDateSum = self.floatAdd(_extraDateSum, item);
              });
            }
            Object.values(list['today']['advertClickCount']).forEach(function(item) {
              todaySum = self.floatAdd(todaySum, item);
            });
            Object.values(list['today']['advertExposureCount']).forEach(function(item) {
              _todaySum = self.floatAdd(_todaySum, item);
            });
            Object.values(list['yesterday']['advertClickCount']).forEach(function(item) {
              yesterdaySum = self.floatAdd(yesterdaySum, item);
            });
            Object.values(list['yesterday']['advertExposureCount']).forEach(function(item) {
              _yesterdaySum = self.floatAdd(_yesterdaySum, item);
            });
            this.totalData = [self.floatDiv(todaySum, _todaySum), self.floatDiv(yesterdaySum, _yesterdaySum), self.floatDiv(avgSum, _avgSum), self.floatDiv(extraDateSum, _extraDateSum)];
        }
      } else {
        // 简单汇总
        Object.values(list['7avg'][type]).forEach(function(item) {
          avgSum = self.floatAdd(avgSum, item);
        });
        if (list.extraDate && list.extraDate.launchCount) {
          Object.values(list['extraDate'][type]).forEach(function(item) {
            extraDateSum = self.floatAdd(extraDateSum, item);
          });
        }
        Object.values(list['today'][type]).forEach(function(item) {
          todaySum = self.floatAdd(todaySum, item);
        });
        Object.values(list['yesterday'][type]).forEach(function(item) {
          yesterdaySum = self.floatAdd(yesterdaySum, item);
        });
        this.totalData = [this._fixNum(todaySum), this._fixNum(yesterdaySum), this._fixNum(avgSum), this._fixNum(extraDateSum)];
      }
    },
    floatAdd(arg1, arg2) {
     /**
      ** 加法函数，用来得到精确的加法结果
      ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
      ** 调用：accAdd(arg1,arg2)
      ** 返回值：arg1加上arg2的精确结果
      **/
      var r1, r2, m, c;
      try {
        r1 = arg1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split('.')[1].length;
      } catch (e) {
        r2 = 0;
      }
      c = Math.abs(r1 - r2);
      m = Math.pow(10, Math.max(r1, r2));
      if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
          arg1 = Number(arg1.toString().replace('.', ''));
          arg2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
          arg1 = Number(arg1.toString().replace('.', '')) * cm;
          arg2 = Number(arg2.toString().replace('.', ''));
        }
      } else {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', ''));
      }
      return (arg1 + arg2) / m;
    },
    floatDiv(arg1, arg2, isNotPercent) {
      let t1 = 0;
      let t2 = 0;
      let r1, r2;
      try {
        t1 = arg1.toString().split('.')[1].length;
      } catch (e) {
      }
      try {
        t2 = arg2.toString().split('.')[1].length;
      } catch (e) {
      }
      r1 = Number(arg1.toString().replace('.', ''));
      r2 = Number(arg2.toString().replace('.', ''));
      if (r2 === 0) {
        return '∞';
      } else {
        var _num = (r1 / r2) * Math.pow(10, t2 - t1);
      }
      if (isNotPercent) {
        return _num.toFixed(2);
      } else {
        return parseFloat((_num * 100).toPrecision(12)).toFixed(2) + '%';
      }
    },
    _fixNum(num) {
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
    },
    _fixData(num) {
    // 去掉今天末尾为0的填充数据
      for (let len = num.length; len--;) {
        if (num[len] === 0) {
          num.pop();
        } else {
          break;
        }
      }
    }
  }
};
