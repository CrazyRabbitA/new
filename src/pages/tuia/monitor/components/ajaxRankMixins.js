import MessageBox from 'components/basic/MessageBox';
const urlToMap = {
  app: '/monitor/mediadimension/',
  act: '/monitor/activitydimension/',
  slot: '/monitor/adslotDimension/',
  actApp: '/monitor/activityMediaDimension/',
  actSlot: '/monitor/activityAdslotDimension/'
};
const actQuotaArr = [
  {
    label: '广告位请求成功pv',
    id: 1,
    point: 'actSucResponseCount'
  },
  {
    label: '广告位曝光pv',
    id: 2,
    point: 'actExposeCount'
  },
  {
    label: '广告位点击pv',
    id: 3,
    point: 'actClickCount'
  },
  {
    label: '广告位点击uv',
    id: 4,
    point: 'actClickUv'
  },
  {
    label: '广告位点击率',
    id: 16,
    point: 'advertClickRate'
  },
  {
    label: '活动请求pv',
    id: 7,
    point: 'actRequestCount'
  },
  {
    label: '活动请求uv',
    id: 8,
    point: 'actRequestUv'
  },
  {
    label: '活动参与pv',
    id: 9,
    point: 'participateCount'
  },
  {
    label: '活动参与uv',
    id: 10,
    point: 'participateUv'
  },
  {
    label: '参与率',
    id: 17,
    point: 'participateRate'
  },
  {
    label: '复参数',
    id: 18,
    point: 'dupliParticipateRate'
  },
  {
    label: '每UV发券',
    id: 19,
    point: 'launchPerSdkUv'
  },
  {
    label: '活动广告券请求pv',
    id: 11,
    point: 'advertRequestCount'
  },
  {
    label: '请求成功率',
    id: 20,
    point: 'requestParticipateRate'
  },
  {
    label: '发券成功率',
    id: 21,
    point: 'launchRequestRate'
  },
  {
    label: '活动广告发券量',
    id: 12,
    point: 'launchCount'
  },
  {
    label: '广告券曝光pv',
    id: 13,
    point: 'advertExposureCount'
  },
  {
    label: '广告券点击pv',
    id: 14,
    point: 'advertClickCount'
  },
  {
    label: '每UV券点击',
    id: 22,
    point: 'clickPerSdk'
  },
  {
    label: '广告券点击率',
    id: 23,
    point: 'clickExposureRate'
  }
];
export default {
  data() {
    return {
      isShowTitle: false,
      title: '',
      name: '',
      id: '',
      gotoUrl: '',
      getActId: '',
      getSlotId: '',
      getAppId: '',
      // 涨跌板table分页
      rankTopData: {
        currentTable: [],
        total: 0,
        pageNum: 1,
        pageSize: 8
      }
    };
  },
  methods: {
    getRule(type) {
      if (this.actId) {
        if (type === 'app') {
          this.gotoUrl = urlToMap.actApp;
        } else {
          this.gotoUrl = urlToMap.actSlot;
        }
        this.quotaArr = actQuotaArr;
        this.title = '活动名称';
        this.getActId = 'data.info';
        this.getSlotId = 'item';
        this.getAppId = 'item';
        this.isShowTitle = true;
        this.getAct();
        return;
      }
      if (this.appId) {
        if (type === 'act') {
          this.gotoUrl = urlToMap.actApp;
        }
        this.title = '媒体名称';
        this.getActId = 'item';
        this.getSlotId = 'item';
        this.getAppId = 'data.info';
        this.isShowTitle = true;
        this.getApp();
        return;
      }
      if (this.slotId) {
        if (type === 'act') {
          this.gotoUrl = urlToMap.actSlot;
        }
        this.title = '广告位名称';
        this.getActId = 'item';
        this.getSlotId = 'data.info';
        this.getAppId = 'item';
        this.isShowTitle = true;
        this.getSlot();
        return;
      }
      if (type === 'act') {
        this.getAct();
      }
      if (type === 'app') {
        this.getApp();
      }
      if (type === 'slot') {
        this.getSlot();
      }
    },
    getSlot() {
      this.loadshow = true;
      this.$http.post('/tuia/adslot/app/top', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.currentQuota = this.params.quota;
          this.data = res.data;
          if (res.data.info) {
            this.name = res.data.info.slotName;
            this.id = res.data.info.slotId;
          } else {
            this.isShowTitle = false;
          }
          this.getPage();
          this.loadshow = false;
        } else {
          this.loadshow = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadshow = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getAct() {
      this.loadshow = true;
      this.$http.post('/tuia/activity/app/top', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.currentQuota = this.params.quota;
          if (res.data.info) {
            this.name = res.data.info.activityTitle;
            this.id = res.data.info.activityId;
          } else {
            this.isShowTitle = false;
          }
          this.data = res.data;
          this.getPage();
          this.loadshow = false;
        } else {
          this.loadshow = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadshow = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getApp() {
      this.loadshow = true;
      this.$http.post('/tuia/app/top', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.currentQuota = this.params.quota;
          this.data = res.data;
          if (res.data.info) {
            this.name = res.data.info.appName;
            this.id = res.data.info.appId;
          } else {
            this.isShowTitle = false;
          }
          this.getPage();
          this.loadshow = false;
        } else {
          this.loadshow = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.loadshow = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getItemUrl(idType, idValue, item) {
      if (this[idType] === 'data.info') {
        return this.data.info[idValue];
      } else {
        return item[idValue];
      }
    },
    // 分页
    onPageChange(page) {
      this.rankTopData.pageNum = page;
      this.getPage();
    },
    getPage() {
      this.rankTopData.total = this.data.table.length;
      let start = (this.rankTopData.pageNum - 1) * this.rankTopData.pageSize;
      let end = start + this.rankTopData.pageSize;
      this.rankTopData.currentTable = this.data.table.slice(start, end);
    }
  }
};
