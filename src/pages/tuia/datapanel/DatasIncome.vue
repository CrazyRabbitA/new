<template>
  <pagetitle class="incometitle" title="收入数据监控" :sub-title="newtime"></pagetitle>
  <div class="top-content">
    <div class="table-container">
      <div  v-for="(index, table) in newTableList" class="table-slide" :class="{'active': table.isActive}" @click="choose(index)" :style="{color: colorArr[index]}">
        <div class="fix"></div>
        <div class="i-name">{{table.name}}</div>
        <div class="i-num">{{table.total | thousand}}</div>
        <div class="i-annotation">{{nameMapdesc[index]}}</div>
      </div>
    </div>
  </div>
  <div class="rank-warp" v-if="index === 1">
    <h2 class="rank" @click="showBudgetRankModal"><i class="iconnav">&#xe6ac;</i> 涨跌</h2>
    <h2 class="top" @click="showBudgetTopModal"><i class="iconnav">&#xe6b6;</i> 榜单</h2>
  </div>
  <div class="rank-warp" v-if="index === 0">
    <h2 class="rank" @click="showRankModal"><i class="iconnav">&#xe6ac;</i> 涨跌</h2>
    <h2 class="top" @click="showTopModal"><i class="iconnav">&#xe6b6;</i> 榜单</h2>
  </div>
  <div id="main" class="income-chart" style="height:400px;width:100%"></div>
  <rank-modal v-if="isShowRankModalAsync" :show.sync="isShowRankModal" :close.sync="closeRankmodal"></rank-modal>
  <top-modal v-if="isShowTopModalAsync" :show.sync="isShowTopModal" :top-type="'appTop'" :quota-type="quotaType" :close.sync="closeTopModal"></top-modal>
  <component :is="currentView" :show="currentShow"></component>
</template>

<script>
  import incomechartmixins from './mixins/incomeChartMixins';
  import incomeMixins from './mixins/incomeMixins';
  import MessageBox from 'components/basic/MessageBox';
  import rankModal from '../monitor/components/rank';
  import topModal from '../monitor/components/top';
  import rankBudgetModal from './components/rank.vue';
  import topBudgetModal from './components/top';
  const colorArr = ['#60a4e8', '#2ac993', '#ff5b5b', '#fe8002', '#ffbf55', '#73cfca', '#8291d9'];
  const nameMap = {
    AdvertConcume: '当日累计消耗',
    ResidueBudget: '当日剩余广告预算',
    AdsNumber: '在投广告数',
    AccountNumber: '在投广告主数',
    ActiveApp: '活跃媒体数',
    ActiveSlot: '活跃广告位数',
    ResidueBalance: '广告主余额'
  };
  const nameMapdesc = [
    '每半小时更新数据，平台累计广告消耗。',
    '每半小时更新数据，有广告计划预算或账户预算的广告预算余额。',
    '每半小时更新数据，广告状态为“有效”的广告计划数量。',
    '每半小时更新数据，广告状态为“有效”的广告计划数量，根据广告主id去重。',
    '最近半小时，媒体发券量大于500的媒体数量。',
    '最近半小时，广告位发券量大于500的广告位数量。',
    '半小时更新数据，截止到上一个统计点，平台广告主余额。'
  ];

  export default {
    mixins: [incomechartmixins, incomeMixins],
    components: {
      rankBudgetModal,
      topBudgetModal,
      rankModal,
      topModal
    },
    data() {
      return {
        isShowTopModal: false,
        isShowTopModalAsync: false,
        isShowRankModal: false,
        isShowRankModalAsync: false,
        currentView: '',
        currentShow: false,
        timeNum: +new Date(),
        // 表格所有数据
        newTableList: [],
        nameMap: nameMap,
        nameMapdesc: nameMapdesc,
        // 储存请求数据
        _myresultData: {},
        colorArr: colorArr,
        index: 0
      };
    },
    route: {
      data(transition) {
        this.realtime(transition);
      }
    },
    computed: {
      newtime: function() {
        let date = new Date(this.timeNum);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return year + '年' + this.formatstr(month) + '月' + this.formatstr(day) + '日 ' + this.formatstr(h) + ':' + this.formatstr(m) + ':' + this.formatstr(s);
      }
    },
    methods: {
      choose: function(index) {
        this.index = index;
        for (let item of this.newTableList) {
          item.isActive = false;
        }
        this.newTableList[index].isActive = true;
        this.updateCharts(index);
      },
      realtime: function(transition) {
        this.$http.post('/income2/realtime', {
          appId: 1,
          classifyId: 2
        }).then((res) => {
          res = res.json();
          if (res.success) {
            let data = this._fixData(res.data);
            this.newTableList = Object.keys(nameMap).map(k => data[k]);
            this.init(this.newTableList[0]); // 渲染第一个先
            this.newTableList[0].isActive = true; // 渲染第一个先
            setInterval(() => { this.timeNum += 1000; }, 1000); // 倒计时
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, res => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      formatstr: function(num) {
        return num > 9 ? num : ('0' + num);
      },
      showBudgetRankModal() {
        this.currentView = '';
        this.$nextTick(() => {
          this.currentShow = true;
          this.currentView = 'rankBudgetModal';
        });
      },
      showBudgetTopModal() {
        this.currentView = '';
        this.$nextTick(() => {
          this.currentShow = true;
          this.currentView = 'topBudgetModal';
        });
      },
      showRankModal() {
        this.isShowRankModal = true;
        this.isShowRankModalAsync = true;
      },
      closeRankmodal() {
        this.isShowRankModal = false;
        setTimeout(() => {
          this.isShowRankModalAsync = false;
        }, 500);
      },
      showTopModal() {
        this.quotaType = this.selectDimension;
        this.isShowTopModal = true;
        this.isShowTopModalAsync = true;
      },
      closeTopModal() {
        this.isShowTopModal = false;
        setTimeout(() => {
          this.isShowTopModalAsync = false;
        }, 500);
      }
    }
  };
</script>

<style lang="less">

.top-content {
  overflow-x: hidden;
  margin: 40px 0 60px 0;
  padding: 10px 10px 20px 10px;
}
.table-container {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 120px;
}
::-webkit-scrollbar {
    width: 8px;
    height: 4px;
}
.table-slide {
  color: #fff;
  font-family:HiraginoSansGB-W3;
  font-size:12px;
  width: 12%;
  min-width: 120px;
  height: 60px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 14px;
  border-radius: 4px;
  position: relative;
  background-color: currentcolor;
  transition: all .4s linear;
  .i-annotation {
    position: absolute;
    background:rgba(255,255,255,0.95);
    box-shadow:0 1px 4px 0 rgba(41,41,41,0.50);
    border-radius:2px;
    padding: 6px;
    text-align: left;
    color: #666;
    font-size: 10px;
    margin-top: 4px;
    display: none;
  }
  & + .table-slide {
    margin-left: 16px;
  }
  &.active {
    box-shadow: 0 10px 20px -5px currentcolor;
    .fix:after {
      opacity: 1;
    }
  }
  &:hover {
    box-shadow: 0 10px 20px -5px currentcolor;
    .fix:after {
      opacity: 1;
    }
    .i-annotation  {
      display: block;
    }
  }
  .fix {
    width: 0;
    height: 0;
    &:after {
      transition: opacity .4s linear;
      content: "";
      opacity: 0;
      display: block;
      position: absolute;
      z-index: 11;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-top-color: currentcolor;
      left: 50%;
      bottom: -20px;
      transform: translateX(-50%);
    }
  }
  .i-name {
    margin-top: 12px;
    color:#fff;
    line-height: 1.5
  }
  .i-num {
    margin-bottom: 12px;
    font-size:14px;
    color:#fff;
    text-align:center;
    line-height: 1.5
  }
}

.incometitle {
  // border-bottom: none;
  h2.has-sub-title {
    font-weight: bold;
    font-size:16px;
    color:#444444;
  }
  .iconhandle {
    display: none;
  }
  .sub-title {
    font-size:14px;
    color:#444444;
    font-weight: normal;
    margin-right: 9px;
  }
}
.rank-warp {
  position: relative;
  .rank {
    position: absolute;
    z-index: 1;
    top: -100px;
    right: 20px;
    cursor: pointer;
    color:#657180 !important;
    font-weight: normal;
    line-height: 1;
    &:hover {
      color: #ef6b3b;
    }
  }
  .top {
    position: absolute;
    z-index: 1;
    top: -60px;
    right: 20px;
    cursor: pointer;
    color:#657180 !important;
    font-weight: normal;
    line-height: 1;
    &:hover {
      color: #ef6b3b;
    }
  }
}

.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
}
.income-chart {
  position: relative;
  top: -60px;
}
</style>
