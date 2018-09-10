<template>
  <div class='ka-container'>
    <pagetitle class="incometitle" title="广告KA数据" :sub-title="newtime"></pagetitle>
    <div class="top-content">
    </div>
    <div id="main" class="income-chart" style="height:300px;width:100%"></div>
    <ka-trade-table :list="kaTrade"></ka-trade-table>
    <ka-team-table></ka-team-table>
  </div>
</template>

<script>
import advertKaChartMixins from './mixins/advertKaChartMixins';
import kaMixins from './mixins/kaMixins';
import MessageBox from 'components/basic/MessageBox';
import kaTradeTable from './components/kaTradeTable.vue';
import kaTeamTable from './components/kaTeamTable.vue';

export default {
  mixins: [advertKaChartMixins, kaMixins],
  components: {
    kaTradeTable,
    kaTeamTable
  },
  data() {
    return {
      timeNum: +new Date(),
      // 表格所有数据
      kaTrade: []
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
      return (
        year +
        '年' +
        this.formatstr(month) +
        '月' +
        this.formatstr(day) +
        '日 ' +
        this.formatstr(h) +
        ':' +
        this.formatstr(m) +
        ':' +
        this.formatstr(s)
      );
    }
  },
  methods: {
    realtime: function(transition) {
      this.$http.get('/ka').then(
        res => {
          res = res.json();
          if (res.success) {
            let data = this._fixData(res.data);
            this.kaTrade = res.data.tradeList;
            this.init(data.line, res.data.line.target); // 渲染第一个先
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    formatstr: function(num) {
      return num > 9 ? num : '0' + num;
    }
  }
};
</script>

<style lang="less">
.top-content {
  overflow-x: hidden;
  margin-bottom: 30px;
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
  font-family: HiraginoSansGB-W3;
  font-size: 12px;
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
  transition: all 0.4s linear;
  .i-annotation {
    position: absolute;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 4px 0 rgba(41, 41, 41, 0.5);
    border-radius: 2px;
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
    .i-annotation {
      display: block;
    }
  }
  .fix {
    width: 0;
    height: 0;
    &:after {
      transition: opacity 0.4s linear;
      content: '';
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
    color: #fff;
    line-height: 1.5;
  }
  .i-num {
    margin-bottom: 12px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 1.5;
  }
}

.incometitle {
  // border-bottom: none;
  h2.has-sub-title {
    font-weight: bold;
    font-size: 18px;
    color: #444444;
  }
  .iconhandle {
    display: none;
  }
  .sub-title {
    font-size: 14px;
    color: #444444;
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
    color: #657180 !important;
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
    color: #657180 !important;
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
