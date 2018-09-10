// ------------------------------------页面渲染项------------------------------------
// ----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
const judgeArr = [
  {
    label: '大于',
    id: '1'
  },
  {
    label: '小于',
    id: '2'
  }
];
// 广告配置数据
const slotQuotaArr = [
  // 广告位数据
  {
    label: '广告位曝光PV',
    id: 'actExposeCount'
  },
  {
    label: '广告位点击PV',
    id: 'actClickCount'
  },
  {
    label: '广告位点击率',
    id: 'actClickRate'
  },
  {
    label: '广告位访问PV',
    id: 'sdkPv'
  },
  {
    label: '广告位访问UV',
    id: 'sdkUv'
  },
  // 活动数据
  {
    label: '活动请求PV',
    id: 'actRequestCount'
  },
  {
    label: '活动请求UV',
    id: 'actRequestUv'
  },
  {
    label: '活动参与PV',
    id: 'participateCount'
  },
  {
    label: '活动参与UV',
    id: 'participateUv'
  },
  {
    label: '参与率',
    id: 'participateRate'
  },
  {
    label: '复参数',
    id: 'dupliParticipateRate'
  },
  // 广告数据
  {
    label: '每UV发券',
    id: 'launchPerSdkUv'
  },
  {
    label: '广告发券量',
    id: 'launchCount'
  },
  {
    label: '高风险发券量',
    id: 'highriskLaunch'
  },
  {
    label: '高风险发券占比',
    id: 'highriskLaunchPercentage'
  },
  {
    label: '广告券曝光量',
    id: 'advertExposeCount'
  },
  {
    label: '广告券点击量',
    id: 'advertExposureCount'
  },
  {
    label: '广告券计费点击量',
    id: 'tuiaConsumerCount'
  },
  {
    label: '广告点击率',
    id: 'clickRate'
  },
  {
    label: '券计费点击率',
    id: 'advertClickRate'
  },
  // 新增字段
  {
    label: '每UV券点击',
    id: 'advertClickCountPerLaunchUv'
  },
  {
    label: '高风险点击量（计费）',
    id: 'highriskVclickPv'
  },
  {
    label: '高风险点击占比（计费）',
    id: 'highriskVclickPercent'
  },
  {
    label: '高风险消耗',
    id: 'highriskConsume'
  },
  // 转化数据
  {
    label: '广告消耗',
    id: 'adConsume'
  },
  // 高分险消耗占比
  {
    label: '高分险消耗占比',
    id: 'highriskConsumePercent'
  },
  {
    label: '有埋点广告点击',
    id: 'advertClickLoadPv'
  },
  {
    label: '落地页访问PV',
    id: 'visitPv'
  },
  {
    label: '落地页访问UV',
    id: 'visitUv'
  },
  {
    label: '落地页效果PV',
    id: 'effectPv'
  },
  {
    label: '落地页效果UV',
    id: 'effectUv'
  },
  {
    label: '落地页转化率',
    id: 'effectRate'
  },
   // 媒体收益数据
  {
    label: '落地页理论转化率',
    id: 'effectCvr'
  },
  {
    label: '媒体分成',
    id: 'consumeTotal'
  },
  {
    label: '分成比例',
    id: 'consumePercent'
  },
  {
    label: '建议分成比例',
    id: 'recommendConsumePercent'
  },
  {
    label: '媒体CPM',
    id: 'mediaCpm'
  },
  {
    label: '媒体UV单价（元）',
    id: 'consumePerSdkUv'
  },
  {
    label: 'arpu值',
    id: 'arpu'
  },
  // 其他 只有广告维度配置,媒体无此选项
  {
    label: '命中规则',
    id: 'riskLevel'
  }
];
// 媒体数据配置
const appQuotaArr = [
  // 广告位数据
  {
    label: '广告位曝光PV',
    id: 'actExposeCount'
  },
  {
    label: '广告位点击PV',
    id: 'actClickCount'
  },
  {
    label: '广告位点击率',
    id: 'actClickRate'
  },
  {
    label: '广告位访问PV',
    id: 'sdkPv'
  },
  {
    label: '广告位访问UV',
    id: 'sdkUv'
  },
  // 活动数据
  {
    label: '活动请求PV',
    id: 'actRequestCount'
  },
  {
    label: '活动请求UV',
    id: 'actRequestUv'
  },
  {
    label: '活动参与PV',
    id: 'participateCount'
  },
  {
    label: '活动参与UV',
    id: 'participateUv'
  },
  {
    label: '参与率',
    id: 'participateRate'
  },
  {
    label: '复参数',
    id: 'dupliParticipateRate'
  },
  // 广告数据
  {
    label: '每UV发券',
    id: 'launchPerSdkUv'
  },
  {
    label: '广告发券量',
    id: 'launchCount'
  },
  {
    label: '高风险发券量',
    id: 'highriskLaunch'
  },
  {
    label: '高风险发券占比',
    id: 'highriskLaunchPercentage'
  },
  {
    label: '广告券曝光量',
    id: 'advertExposeCount'
  },
  {
    label: '广告券点击量',
    id: 'advertExposureCount'
  },
  {
    label: '广告券计费点击量',
    id: 'tuiaConsumerCount'
  },
  {
    label: '广告点击率',
    id: 'clickRate'
  },
  {
    label: '券计费点击率',
    id: 'advertClickRate'
  },
  // 新增字段
  {
    label: '每UV券点击',
    id: 'advertClickCountPerLaunchUv'
  },
  {
    label: '高风险点击量（计费）',
    id: 'highriskVclickPv'
  },
  {
    label: '高风险点击占比（计费）',
    id: 'highriskVclickPercent'
  },
  {
    label: '高风险消耗',
    id: 'highriskConsume'
  },
  {
    label: '广告消耗',
    id: 'adConsume'
  },
  // 高分险消耗占比
  {
    label: '高分险消耗占比',
    id: 'highriskConsumePercent'
  },
  // 转化数据
  {
    label: '有埋点广告点击',
    id: 'advertClickLoadPv'
  },
  {
    label: '落地页访问PV',
    id: 'visitPv'
  },
  {
    label: '落地页访问UV',
    id: 'visitUv'
  },
  {
    label: '落地页效果PV',
    id: 'effectPv'
  },
  {
    label: '落地页效果UV',
    id: 'effectUv'
  },
  {
    label: '落地页转化率',
    id: 'effectRate'
  },
   // 媒体收益数据
  {
    label: '落地页理论转化率',
    id: 'effectCvr'
  },
  {
    label: '媒体分成',
    id: 'consumeTotal'
  },
  {
    label: '分成比例',
    id: 'consumePercent'
  },
  {
    label: '建议分成比例',
    id: 'recommendConsumePercent'
  },
  {
    label: '媒体CPM',
    id: 'mediaCpm'
  },
  {
    label: '媒体UV单价（元）',
    id: 'consumePerSdkUv'
  },
  {
    label: 'arpu值',
    id: 'arpu'
  }
];
export default {
  data() {
    return {
      judgeArr: judgeArr,
      appQuotaArr: appQuotaArr,
      slotQuotaArr: slotQuotaArr,
      appIdList: [],
      appNameList: [],
      slotIdList: [],
      slotNameList: []
    };
  },
  methods: {
    appIdChange() {
      if (!this.params.appId) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/app', { appId: this.params.appId
      }).then((res) => {
        res = res.json();
        this.appIdList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.appIdList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    },
    appNameChange() {
      if (!this.params.appName) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/app', { appName: this.params.appName
      }).then((res) => {
        res = res.json();
        this.appNameList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.appNameList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    },
    slotIdChange() {
      if (!this.params2.slotId) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/slot', { slotId: this.params2.slotId
      }).then((res) => {
        res = res.json();
        this.slotIdList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.slotIdList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    },
    slotNameChange() {
      if (!this.params2.slotName) {
        this.appIdList = [];
        return;
      }
      this.$http.post('/media/slot', { slotName: this.params2.slotName
      }).then((res) => {
        res = res.json();
        this.slotNameList = [];
        if (res.success) {
          res.data.forEach((item) => {
            this.slotNameList.push({
              key: item.id,
              value: item.name
            });
          });
        }
      }, (res) => {
      });
    },
    mediaClick(value) {
      this.params.appId = value.key;
      this.params.appName = value.value;
      this.getPageApp();
    },
    slotClick(value) {
      this.params2.slotId = value.key;
      this.params2.slotName = value.value;
      this.getPageSlot();
    }
  }
};
