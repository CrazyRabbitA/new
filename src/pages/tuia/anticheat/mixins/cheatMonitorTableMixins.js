// 弹窗数据配置
import {addpercent, addcomma, addpercent2, addcomma2} from 'components/utils/tableUtils';
export default {
  data() {
    // 媒体
    let columns = [
      {
        title: '媒体名称',
        key: 'appName',
        width: 120,
        fixed: 'left',
        render(row, column, index) {
          let appname = row.appName;
          let str = '';
          if (!appname) {
            str = '总计';
          } else {
            str = '<div class="appName" @click="appNameClick">' + appname + '</div>';
          }
          return str;
        }
      },
      {
        title: '媒体ID',
        key: 'appId',
        width: 100,
        render(row, column, index) {
          let val = row.appId;
          // 标红条件
          let str = '';
          if (index === 0) {
            str = '<div class="appName tright">-</div>';
          } else {
            str = '<div class="appName tright">' + val + '</div>';
          }
          return str;
        }
      },
      {
        title: '广告位曝光PV',
        width: 160,
        sortable: 'custom',
        key: 'actExposeCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'actExposeCount', 0);
        }
      },
      {
        title: '广告位点击PV',
        width: 160,
        sortable: 'custom',
        key: 'actClickCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'actClickCount', 0);
        }
      },
      {
        title: '广告位点击率',
        width: 130,
        sortable: 'custom',
        key: 'actClickRate',
        render(row, column, index) {
          return addpercent(row, column, index, 'actClickRate');
        }
      },
      {
        title: '广告位访问PV',
        width: 160,
        sortable: 'custom',
        key: 'sdkPv',
        render(row, column, index) {
          return addcomma(row, column, index, 'sdkPv', 0);
        }
      },
      {
        title: '广告位访问UV',
        width: 160,
        sortable: 'custom',
        key: 'sdkUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'sdkUv', 0);
        }
      },
      {
        title: '活动请求PV',
        width: 160,
        sortable: 'custom',
        key: 'actRequestCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'actRequestCount', 0);
        }
      },
      {
        title: '活动请求UV',
        width: 160,
        sortable: 'custom',
        key: 'actRequestUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'actRequestUv', 0);
        }
      },
      {
        title: '活动参与PV',
        width: 160,
        sortable: 'custom',
        key: 'participateCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'participateCount', 0);
        }
      },
      {
        title: '活动参与UV',
        width: 160,
        sortable: 'custom',
        key: 'participateUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'participateUv', 0);
        }
      },
      {
        title: '参与率',
        width: 90,
        sortable: 'custom',
        key: 'participateRate',
        render(row, column, index) {
          return addpercent(row, column, index, 'participateRate');
        }
      },
      {
        title: '复参数',
        width: 90,
        sortable: 'custom',
        key: 'dupliParticipateRate',
        render(row, column, index) {
          return addcomma(row, column, index, 'dupliParticipateRate');
        }
      },
      {
        title: '每UV发券',
        width: 160,
        sortable: 'custom',
        key: 'launchPerSdkUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'launchPerSdkUv');
        }
      },
      {
        title: '广告发券量',
        width: 160,
        sortable: 'custom',
        key: 'launchCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'launchCount', 0);
        }
      },
      {
        title: '高风险发券量',
        width: 180,
        sortable: 'custom',
        key: 'highriskLaunch',
        render(row, column, index) {
          return addcomma(row, column, index, 'highriskLaunch', 0);
        }
      },
      {
        title: '高风险发券占比',
        width: 140,
        sortable: 'custom',
        key: 'highriskLaunchPercentage',
        render(row, column, index) {
          return addpercent(row, column, index, 'highriskLaunchPercentage');
        }
      },
      {
        title: '广告券曝光量',
        width: 160,
        sortable: 'custom',
        key: 'advertExposureCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'advertExposureCount', 0);
        }
      },
      {
        title: '广告券点击量',
        width: 160,
        sortable: 'custom',
        key: 'advertClickCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'advertClickCount', 0);
        }
      },
      {
        title: '广告券计费点击量',
        width: 160,
        sortable: 'custom',
        key: 'tuiaConsumerCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'tuiaConsumerCount', 0);
        }
      },
      {
        title: '广告点击率',
        width: 150,
        sortable: 'custom',
        key: 'clickRate',
        render(row, column, index) {
          return addpercent(row, column, index, 'clickRate');
        }
      },
      {
        title: '券计费点击率',
        width: 130,
        sortable: 'custom',
        key: 'advertClickRate',
        render(row, column, index) {
          return addpercent(row, column, index, 'advertClickRate');
        }
      },
       // 改动部分
      {
        title: '每UV券点击',
        width: 130,
        sortable: 'custom',
        key: 'advertClickCountPerLaunchUv',
        //  advertClickCountPerLaunchUv
        render(row, column, index) {
          let advertClickCountPerLaunchUv = row.advertClickCountPerLaunchUv;
          let str = '';
          str = '<div class="appName" @click="appNameClick">' + advertClickCountPerLaunchUv + '</div>';
          return str;
        }
      },
      {
        title: '高风险点击量（计费）',
        width: 160,
        sortable: 'custom',
        key: 'highriskVclickPv',
        render(row, column, index) {
          return addcomma(row, column, index, 'highriskVclickPv', 0);
        }
      },
      {
        title: '高风险点击占比（计费）',
        width: 190,
        sortable: 'custom',
        key: 'highriskVclickPercent',
        render(row, column, index) {
          return addpercent(row, column, index, 'highriskVclickPercent');
        }
      },
      {
        title: '高风险消耗',
        width: 160,
        sortable: 'custom',
        key: 'highriskConsume',
        render(row, column, index) {
          return addcomma(row, column, index, 'highriskConsume');
        }
      },
      {
        title: '广告消耗',
        width: 160,
        sortable: 'custom',
        key: 'adConsume',
        render(row, column, index) {
          return addcomma(row, column, index, 'adConsume');
        }
      },
      // 高分险消耗占比
      {
        title: '高分险消耗占比',
        // highriskConsumePercent
        width: 180,
        sortable: 'custom',
        key: 'highriskConsumePercent',
        render(row, column, index) {
          return addpercent(row, column, index, 'highriskConsumePercent');
        }
      },
      {
        title: '有埋点广告点击',
        width: 160,
        sortable: 'custom',
        key: 'advertClickLoadPv',
        render(row, column, index) {
          return addcomma(row, column, index, 'advertClickLoadPv', 0);
        }
      },
      {
        title: '落地页访问PV',
        width: 160,
        sortable: 'custom',
        key: 'visitPv',
        render(row, column, index) {
          return addcomma(row, column, index, 'visitPv', 0);
        }
      },
      {
        title: '落地页访问UV',
        width: 160,
        sortable: 'custom',
        key: 'visitUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'visitUv', 0);
        }
      },
      {
        title: '落地页效果PV',
        width: 160,
        sortable: 'custom',
        key: 'effectPv',
        render(row, column, index) {
          return addcomma(row, column, index, 'effectPv', 0);
        }
      },
      {
        title: '落地页效果UV',
        width: 160,
        sortable: 'custom',
        key: 'effectUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'effectUv', 0);
        }
      },
      {
        title: '落地页转化率',
        width: 170,
        sortable: 'custom',
        key: 'effectRate',
        render(row, column, index) {
          return addpercent(row, column, index, 'effectRate');
        }
      },
      {
        title: '落地页理论转化率',
        width: 170,
        sortable: 'custom',
        key: 'effectCvr',
        render(row, column, index) {
          return addpercent(row, column, index, 'effectCvr');
        }
      },
      {
        title: '媒体分成',
        width: 170,
        sortable: 'custom',
        key: 'consumeTotal',
        render(row, column, index) {
          return addcomma(row, column, index, 'consumeTotal');
        }
      },
      {
        title: '分成比例',
        width: 160,
        sortable: 'custom',
        key: 'consumePercent',
        render(row, column, index) {
          return addpercent(row, column, index, 'consumePercent');
        }
      },
      {
        title: '建议分成比例',
        width: 160,
        sortable: 'custom',
        key: 'recommendConsumePercent',
        render(row, column, index) {
          return addpercent(row, column, index, 'recommendConsumePercent');
        }
      },
      {
        title: '媒体CPM',
        width: 160,
        sortable: 'custom',
        key: 'mediaCpm',
        render(row, column, index) {
          return addcomma(row, column, index, 'mediaCpm');
        }
      },
      {
        title: '媒体UV单价（元）',
        width: 160,
        sortable: 'custom',
        key: 'consumePerSdkUv',
        render(row, column, index) {
          return addcomma(row, column, index, 'consumePerSdkUv');
        }
      },
      {
        title: 'arpu值',
        width: 90,
        sortable: 'custom',
        key: 'arpu',
        render(row, column, index) {
          return addcomma(row, column, index, 'arpu');
        }
      }
    ];
    // 广告
    let columns2 = [
      // slotName 条件标红
      {
        title: '广告位名称',
        key: 'slotName',
        width: 120,
        fixed: 'left',
        render(row, column, index) {
          let appname = row.slotName;
          let isRed = row.riskLevelCount; // 标红条件
          let str = '';
          if (!appname) {
            str = '总计';
          } else {
            if (isRed && isRed === 1) {
              str = '<div class="appName isRed" @click="appNameClick">' + appname + '</div>';
            } else {
              str = '<div class="appName" @click="appNameClick">' + appname + '</div>';
            }
          }
          return str;
        }
      },
      // 广告标红改动
      {
        title: '广告位ID',
        key: 'slotId',
        width: 100,
        // 此处即为遍历
        render(row, column, index) {
          let val = row.slotId;
          let isRed = row.riskLevelCount; // 标红条件
          let str = '';
          if (index === 0) {
            str = '<div class="appName tright">-</div>';
          } else {
            // 判断是否标记
            if (isRed && isRed === 1) {
              str = '<div class="appName tright isRed">' + val + '</div>';
            } else {
              str = '<div class="appName tright">' + val + '</div>';
            }
          }
          return str;
        }
      },
      {
        title: '广告位曝光PV',
        width: 160,
        sortable: 'custom',
        key: 'actExposeCount',
        render(row, column, index) {
          return addcomma(row, column, index, 'actExposeCount', 0);
        }
      },
      {
        title: '广告位点击PV',
        width: 160,
        sortable: 'custom',
        key: 'actClickCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'actClickCount', 0);
        }
      },
      {
        title: '广告位点击率',
        width: 130,
        sortable: 'custom',
        key: 'actClickRate',
        render(row, column, index) {
          return addpercent2(row, column, index, 'actClickRate');
        }
      },
      {
        title: '广告位访问PV',
        width: 160,
        sortable: 'custom',
        key: 'sdkPv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'sdkPv', 0);
        }
      },
      {
        title: '广告位访问UV',
        width: 160,
        sortable: 'custom',
        key: 'sdkUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'sdkUv', 0);
        }
      },
      {
        title: '活动请求PV',
        width: 160,
        sortable: 'custom',
        key: 'actRequestCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'actRequestCount', 0);
        }
      },
      {
        title: '活动请求UV',
        width: 160,
        sortable: 'custom',
        key: 'actRequestUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'actRequestUv', 0);
        }
      },
      {
        title: '活动参与PV',
        width: 160,
        sortable: 'custom',
        key: 'participateCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'participateCount', 0);
        }
      },
      {
        title: '活动参与UV',
        width: 160,
        sortable: 'custom',
        key: 'participateUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'participateUv', 0);
        }
      },
      {
        title: '参与率',
        width: 90,
        sortable: 'custom',
        key: 'participateRate',
        render(row, column, index) {
          return addpercent2(row, column, index, 'participateRate');
        }
      },
      {
        title: '复参数',
        width: 90,
        sortable: 'custom',
        key: 'dupliParticipateRate',
        render(row, column, index) {
          return addcomma2(row, column, index, 'dupliParticipateRate');
        }
      },
      {
        title: '每UV发券',
        width: 160,
        sortable: 'custom',
        key: 'launchPerSdkUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'launchPerSdkUv');
        }
      },
      {
        title: '广告发券量',
        width: 160,
        sortable: 'custom',
        key: 'launchCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'launchCount', 0);
        }
      },
      {
        title: '高风险发券量',
        width: 180,
        sortable: 'custom',
        key: 'highriskLaunch',
        render(row, column, index) {
          return addcomma2(row, column, index, 'highriskLaunch', 0);
        }
      },
      {
        title: '高风险发券占比',
        width: 140,
        sortable: 'custom',
        key: 'highriskLaunchPercentage',
        render(row, column, index) {
          return addpercent2(row, column, index, 'highriskLaunchPercentage');
        }
      },
      {
        title: '广告券曝光量',
        width: 160,
        sortable: 'custom',
        key: 'advertExposeCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'advertExposeCount', 0);
        }
      },
      {
        title: '广告券点击量',
        width: 160,
        sortable: 'custom',
        key: 'advertExposureCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'advertExposureCount', 0);
        }
      },
      {
        title: '广告券计费点击量',
        width: 160,
        sortable: 'custom',
        key: 'tuiaConsumerCount',
        render(row, column, index) {
          return addcomma2(row, column, index, 'tuiaConsumerCount', 0);
        }
      },
      {
        title: '广告点击率',
        width: 150,
        sortable: 'custom',
        key: 'clickRate',
        render(row, column, index) {
          return addpercent2(row, column, index, 'clickRate');
        }
      },
      {
        title: '券计费点击率',
        width: 130,
        sortable: 'custom',
        key: 'advertClickRate',
        render(row, column, index) {
          return addpercent2(row, column, index, 'advertClickRate');
        }
      },
      // 新增部分
      {
        title: '每UV券点击',
        width: 130,
        sortable: 'custom',
        key: 'advertClickCountPerLaunchUv',
        //  advertClickCountPerLaunchUv
        render(row, column, index) {
          let advertClickCountPerLaunchUv = row.advertClickCountPerLaunchUv;
          let str = '';
          str = '<div class="appName" @click="appNameClick">' + advertClickCountPerLaunchUv + '</div>';
          return str;
        }
      },
      {
        title: '高风险点击量（计费）',
        width: 180,
        sortable: 'custom',
        key: 'highriskVclickPv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'highriskVclickPv', 0);
        }
      },
      {
        title: '高风险点击占比（计费）',
        width: 190,
        sortable: 'custom',
        key: 'highriskVclickPercent',
        render(row, column, index) {
          return addpercent2(row, column, index, 'highriskVclickPercent');
        }
      },
      {
        title: '高风险消耗',
        width: 160,
        sortable: 'custom',
        key: 'highriskConsume',
        render(row, column, index) {
          return addcomma2(row, column, index, 'highriskConsume');
        }
      },
      {
        title: '广告消耗',
        width: 160,
        sortable: 'custom',
        key: 'adConsume',
        render(row, column, index) {
          return addcomma2(row, column, index, 'adConsume');
        }
      },
      // 高分险消耗占比
      {
        title: '高分险消耗占比',
        // highriskConsumePercent
        width: 180,
        sortable: 'custom',
        key: 'highriskConsumePercent',
        render(row, column, index) {
          return addpercent2(row, column, index, 'highriskConsumePercent');
        }
      },
      {
        title: '有埋点广告点击',
        width: 160,
        sortable: 'custom',
        key: 'advertClickLoadPv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'advertClickLoadPv', 0);
        }
      },
      {
        title: '落地页访问PV',
        width: 160,
        sortable: 'custom',
        key: 'visitPv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'visitPv', 0);
        }
      },
      {
        title: '落地页访问UV',
        width: 160,
        sortable: 'custom',
        key: 'visitUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'visitUv', 0);
        }
      },
      {
        title: '落地页效果PV',
        width: 160,
        sortable: 'custom',
        key: 'effectPv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'effectPv', 0);
        }
      },
      {
        title: '落地页效果UV',
        width: 160,
        sortable: 'custom',
        key: 'effectUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'effectUv', 0);
        }
      },
      {
        title: '落地页转化率',
        width: 170,
        sortable: 'custom',
        key: 'effectRate',
        render(row, column, index) {
          return addpercent2(row, column, index, 'effectRate');
        }
      },
      {
        title: '落地页理论转化率',
        width: 170,
        sortable: 'custom',
        key: 'effectCvr',
        render(row, column, index) {
          return addpercent2(row, column, index, 'effectCvr');
        }
      },
      {
        title: '媒体分成',
        width: 170,
        sortable: 'custom',
        key: 'consumeTotal',
        render(row, column, index) {
          return addcomma2(row, column, index, 'consumeTotal');
        }
      },
      {
        title: '分成比例',
        width: 160,
        sortable: 'custom',
        key: 'consumePercent',
        render(row, column, index) {
          return addpercent2(row, column, index, 'consumePercent');
        }
      },
      {
        title: '建议分成比例',
        width: 130,
        sortable: 'custom',
        key: 'recommendConsumePercent',
        render(row, column, index) {
          return addpercent2(row, column, index, 'recommendConsumePercent');
        }
      },
      {
        title: '媒体CPM',
        width: 160,
        sortable: 'custom',
        key: 'mediaCpm',
        render(row, column, index) {
          return addcomma2(row, column, index, 'mediaCpm');
        }
      },
      {
        title: '媒体UV单价（元）',
        width: 160,
        sortable: 'custom',
        key: 'consumePerSdkUv',
        render(row, column, index) {
          return addcomma2(row, column, index, 'consumePerSdkUv');
        }
      },
      {
        title: 'arpu值',
        width: 90,
        sortable: 'custom',
        key: 'arpu',
        render(row, column, index) {
          return addcomma2(row, column, index, 'arpu');
        }
      },
      // 命中规则
      {
        title: '命中规则',
        width: 120,
        sortable: 'custom',
        key: 'riskLevel',
        render(row, column, index) {
          let riskLevel = row.riskLevel;
          let str = '';

          str = '<div class="appName" @click="appNameClick">' + riskLevel + '</div>';

          return str;
        }
      }
    ];
    return {
      cols: [],
      cols2: [],
      columns: columns,
      columns2: columns2,
      colskey: ['appName', 'appId', 'launchCount', 'highriskLaunchPercentage', 'exposeSuccessRate', 'tuiaConsumerCount', 'advertClickRate', 'advertVclickPercentage', 'higiriskPercentage', 'highriskConsume', 'effectCvr'],
      colskey2: ['slotName', 'slotId', 'launchCount', 'highriskLaunchPercentage', 'exposeSuccessRate', 'tuiaConsumerCount', 'advertClickRate', 'advertVclickPercentage', 'higiriskPercentage', 'highriskConsume', 'effectCvr'],
      data: {},
      data2: {},
      tabledata: [],
      tabledata2: []
    };
  },
  ready() {
    if (localStorage.colskey) {
      let colskey = JSON.parse(localStorage.colskey);
      this.colskey = colskey;
      this.cols = this.columns.filter((c) => {
        return colskey.indexOf(c.key) !== -1;
      });
    } else {
      this.cols = this.columns.filter((c) => {
        return this.colskey.indexOf(c.key) !== -1;
      });
      localStorage.colskey = JSON.stringify(this.colskey);
    }
    if (localStorage.colskey2) {
      let colskey2 = JSON.parse(localStorage.colskey2);
      this.colskey2 = colskey2;
      this.cols2 = this.columns2.filter((c) => {
        return colskey2.indexOf(c.key) !== -1;
      });
    } else {
      this.cols2 = this.columns2.filter((c) => {
        return this.colskey2.indexOf(c.key) !== -1;
      });
      localStorage.colskey2 = JSON.stringify(this.colskey2);
    }
  },
  methods: {
    sortchange(sort) {
      this.params.sortContent = sort.key;
      this.params.sortOrder = sort.order;
      this.params.page = 1;
      this.getPageApp();
    },
    sortchange2(sort) {
      this.params2.sortContent = sort.key;
      this.params2.sortOrder = sort.order;
      this.params2.page = 1;
      this.getPageSlot();
    },
    appNameClick(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
