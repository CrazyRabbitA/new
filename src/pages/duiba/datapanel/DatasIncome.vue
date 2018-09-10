<template>
  <div>
  <pagetitle class="incometitle" title="兑吧关键数据监控" :sub-title="newtime"></pagetitle>
  <div class="top-content">
    <div class="table-container">
      <div  v-for="(index, table) in newTableList" class="table-slide"
      :class="{'active': table.isActive}"
      @click="choose(index)"
      :style="{color: colorArr[index]}" :key="index">
        <div class="fix"></div>
        <div class="i-name">{{table.name}}</div>
        <div class="i-num">{{table.total | thousand}}</div>
        <div class="i-annotation">{{nameMapdesc[index]}}</div>
      </div>
    </div>
  </div>
  <div class="income-warp">
    <d-select :options.sync="quotaArr" :value.sync="ptType" @select="selectQuotaChange"></d-select>
    <h2 class="rank" @click.native="showMaskModal"><i class="iconnav">&#xe6ac;</i>涨跌情况</h2>
  </div>
  <div id="main" class="income-chart" style="height:400px;width:100%"></div>
  <rank-modal  v-if="showMaskAsync" :show="showMask" :close="closeMask"></rank-modal>
  </div>
</template>

<script>
  import { _fixNum } from 'components/utils/cheatDataUtils';
  import incomechartmixins from './mixins/incomeChartMixins';
  import incomeMixins from './mixins/incomeMixins';
  import MessageBox from 'components/basic/MessageBox';
  import rankModal from './components/rank';

  const colorArr = ['#60a4e8', '#2ac993', '#ff5b5b', '#fe8002', '#ffbf55', '#73cfca', '#b84c04'];
  const nameMap = {
    consumeTotal: '消耗',
    // 差个字段
    advertRequestCount: '广告券请求',
    activityPercent: '活动参与度',
    requestPercent: '复参',
    participateUv: '活动参与UV',
    payCoupon: '付费券量',
    arpu: 'arpu'
  };
  const nameMapdesc = [
    '推啊付费券消耗（独立活动+积分商城+推啊资源位）',
    '广告券请求（积分商城+独立活动+推啊资源位）',
    '活动参与度=活动参与UV/活动访问UV',
    '复参（请求效率）= 活动参与PV/活动参与UV',
    '活动参与UV：积分商城参与UV+独立活动参与UV',
    '付费券发券量：（独立活动+积分商城+推啊资源位）',
    'arpu值=消耗/付费券发券'
  ];
  const quotaArr = [
    {
      label: '大盘总计',
      id: -1
    },
    {
      label: '积分商城',
      id: 10
    },
    {
      label: '独立活动',
      id: 1
    }
  ];
  export default {
    mixins: [incomechartmixins, incomeMixins],
    data() {
      return {
        timeNum: +new Date(),
        // 表格所有数据
        newTableList: [],
        nameMap: nameMap,
        nameMapdesc: nameMapdesc,
        // 储存请求数据
        _myresultData: {},
        colorArr: colorArr,
        quotaArr: quotaArr,
        ptType: -1,
        originKind: 1,
        showMask: false,
        showMaskAsync: false
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
      showMaskModal() {
        this.showMask = true;
        this.showMaskAsync = true;
      },
      closeMask() {
        this.showMask = false;
        setTimeout(() => {
          this.showMaskAsync = false;
        }, 500);
      },
      choose: function(index) {
        for (let item of this.newTableList) {
          item.isActive = false;
        }
        this.newTableList[index].isActive = true;
        this.getResourcesDate(this.data, this.newTableList[index]);
      },
      realtime: function(transition) {
        let ptType = -1;
        // if (this.ptType === 10) {
        //   ptType = 0;
        // } else {
        //   ptType = this.ptType;
        // }
        ptType = this.ptType;
        this.$http.get(`/duiba/credits/independent/activity/collect?ptType=${ptType}`, {
        }).then((res) => {
          res = res.json();
          if (res.success) {
            let data = res.data.collect;
            this.data = res.data;
            this.newTableList = [];
            Object.keys(nameMap).forEach((key) => {
              let total;
              if (key === 'activityPercent') {
                total = parseFloat((data[key] * 100).toPrecision(12)).toFixed(2) + '%';
              } else if (key === 'requestPercent') {
                total = _fixNum(data[key], 1);
              } else if (key === 'payCoupon' || key === 'participateUv' || key === 'participatePv' || key === 'advertRequestCount') {
                total = _fixNum(data[key], 0);
              } else {
                total = _fixNum(data[key], 2);
              }
              this.newTableList.push({
                name: nameMap[key],
                total: total,
                key: key,
                isActive: false
              });
            });
            this.newTableList[0].isActive = true; // 渲染第一个先
            this.getResourcesDate(this.data, this.newTableList[0]);
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
      selectQuotaChange(e) {
        // let ids = e.id;
        // localStorage.setItem('sourceTypeArr', ids);
        this.realtime();
      }
    },
    ready() {
      // 用缓存做组件传值
      // localStorage.setItem('sourceTypeArr', -1);
    },
    components: {
      rankModal
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
    // background: #b84c04
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
  border-bottom: none;
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
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
}
.income-chart {
  position: relative;
  top: -60px;
}
.income-warp {
  position: absolute;
  z-index: 999;
  top: 300px;
  .rank{
    cursor:pointer;
    display: inline-block;
    font-weight:normal;
    color:#657180;
    margin-left:10px;
    .iconnav{
      margin-right:5px;
    }
  }
}
</style>
