import MessageBox from 'components/basic/MessageBox';
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
      data: {
        basic: {

        }
      },
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
      // 活动
      if (type === 'act') {
        this.getAct();
      }
      // 媒体
      if (type === 'app') {
        this.getApp();
      }
      // 资源位
      if (type === 'slot') {
        this.getSlot();
      }
    },
    // 资源位
    getSlot() {
      this.loadshow = true;
      this.$http.post('/duiba/top/dpm', this.params).then((res) => {
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
    // 活动
    getAct() {
      this.loadshow = true;
      this.$http.post('/duiba/top/activity', this.params).then((res) => {
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
    // 媒体
    getApp() {
      this.loadshow = true;
      this.$http.post('/duiba/credits/independent/activity/top', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.currentQuota = this.params.quota;
          this.data = res.data;
          this.isShowTitle = false;
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
