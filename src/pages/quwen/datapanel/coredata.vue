<template>
<div class="coredata-page">
  <pagetitle class="incometitle" title="核心数据监控" :sub-title="newtime"></pagetitle>
  <div class="dimension-wrapper">
      <h2>维度:</h2>
      <p >
        <span
        v-for='(index, item) in dimensionArr'
        :key='index'
        class='disitem'
        @click='getMask($event,index)' >{{item.label}}</span>
      </p>
      <h2 class='db-style'>对比方式:</h2>
      <p>
        <span class="dbitem" id="zx" @click="getType($event,0)">纵向对比</span>
        <span class="dbitem" id='hx' v-if="dimentype !== 0" @click="getType($event,1)">横向对比</span>
        <!-- <span class="dbitem" id='hx'  @click="getType($event,1)">横向对比</span> -->
      </p>
  </div>
  <version
    :show.sync='showver'
    :dataver.sync = 'dataver'
    :dataverchild.sync = 'dataverchild'
    @datavers = 'datavers'
    @closever='closever'
    @tover='showMaskver'
    :title="title" ></version>
  <div class="item-wrapper" v-if='showmask === 1 && dataverchild.length>0'>
    <h2>版本 : </h2>
    <div class='item-list'>
      <span  @click='showvers'>+</span>
      <span v-for='(index,item) in dataverchild'>{{item.labName}}<i @click='deletever(index)' class="icondelete">&#xe635;</i></span>
    </div>
  </div>
  <sources
    :show.sync='showsou'
    :datasou.sync = 'datasou'
    :datasouchild.sync = 'datasouchild'
    @datasous = 'datasous'
    @tosou='showMasksou'
    @closesou='closesou'
    :title="title">
  </sources>
  <div class="item-wrapper" v-if='showmask === 2 && datasouchild.length>0'>
    <h2>渠道 : </h2>
    <div class='item-list'>
      <span  @click='showsous'>+</span>
      <span v-for='(index,item) in datasouchild'>{{item.labName}}<i @click='deletesou(index)' class="icondelete">&#xe635;</i></span>
    </div>
  </div>
  <total
    :show.sync = 'showtol'
    :datatol.sync = 'datatol'
    :datatolchild.sync = 'datatolchild'
    @datatols = 'datatols'
    @totol='showMasktol'
    @closetol = 'closetol'
    :title="title"
   >
  </total>
  <div class="item-wrapper" v-if='showmask === 3 && datatolchild.dataverchild && datatolchild.dataverchild.length > 0 '>
    <h2>版本 : </h2>
    <div class='item-list'>
      <span @click='showtols'>+</span>
      <span v-for='(index,item) in datatolchild.dataverchild'>{{item.labName}}<i @click='deletever1(index)' class="icondelete">&#xe635;</i></span>
    </div>
  </div>
  <div class="item-wrapper" v-if='showmask === 3 && datatolchild.datasouchild && datatolchild.datasouchild.length > 0'>
    <h2>渠道 : </h2>
    <div class='item-list'>
      <span  @click='showtols'>+</span>
      <span v-for='(index,item) in datatolchild.datasouchild'>{{item.labName}}<i @click='deletesou1(index)' class="icondelete">&#xe635;</i></span>
    </div>
  </div>
  <div class="top-content" v-if='showtop'>
    <div class="table-container">
      <div  v-for="(index, table) in newTableList" class="table-slide" :class="{'active': table.isActive}" @click="choose(index)" :style="{color: colorArr[index]}">
        <div class="fix"></div>
        <div class="i-name">{{table.name}}</div>
      </div>
    </div>
  </div>
  <div class="top-content" v-if='showmap'>
    <div class="table-container">
      <div  v-for="(index, table) in newTableList1" class="table-slide" :class="{'active': table.isActive}" @click="choose(index)" :style="{color: colorArr[index]}">
        <div class="fix"></div>
        <div class="i-name">{{table.name}}</div>
      </div>
    </div>
  </div>
  <div id="main"  class="income-chart" style="height:400px;width:100%"></div>
</div>
</template>

<script>
import version from './components/version';
import sources from './components/source';
import total from './components/total';
import incomechartmixins from './mixins/incomeChartMixins';
import incomeMixins from './mixins/incomeMixins';
import incomechartmixins1 from './mixins/incomeChartMixins1';
import incomeMixins1 from './mixins/incomeMixins1';
import MessageBox from 'components/basic/MessageBox';
import { hasClass, removeClass, addClass } from './mixins/dom';
const dimensionArr = [
  {
    id: '0',
    label: '大盘'
  },
  {
    id: '1',
    label: '版本'
  },
  {
    id: '2',
    label: '渠道'
  },
  {
    id: '3',
    label: '版本+渠道'
  }
];
const colorArr = [
  '#60a4e8',
  '#2ac993',
  '#ff5b5b',
  '#fe8002',
  '#ffbf55',
  '#73cfca',
  '#8291d9'
];
const nameMap = {
  AdvertConcume: '当日累计消耗',
  ResidueBudget: '当日剩余广告预算',
  AdsNumber: '在投广告数',
  AccountNumber: '在投广告主数',
  ActiveApp: '活跃媒体数',
  ActiveSlot: '活跃广告位数',
  ResidueBalance: '广告主余额'
};
// 纵向
const nameMap1 = {
  appopenCountVert: 'APP启动次数',
  newuserCountVert: '登录用户数',
  clickPvVert: '文章点击数',
  feeVert: '金币发放数'
};
// 横向
const nameMap2 = {
  appopenCountHori: 'APP启动用户数',
  newuserCountHori: '登录用户数',
  clickPvHori: '文章点击数',
  feeHori: '金币发放数'
};

export default {
  mixins: [incomechartmixins, incomeMixins, incomechartmixins1, incomeMixins1],
  components: {
    sources,
    version,
    total,
    MessageBox
  },
  data() {
    return {
      timeNum: +new Date(),
      // 表格所有数据
      newTableList: [],
      newTableList1: [],
      nameMap: nameMap,
      nameMap1: nameMap1,
      nameMap2: nameMap2,
      // nameMapdesc: nameMapdesc,
      // 储存请求数据
      colorArr: colorArr,
      index: 0,
      dimensionArr: dimensionArr,
      showmask: 0,
      dimentype: 0,
      title: '',
      dataver: [],
      dataverchild: [],
      datasou: [],
      datasouchild: [],
      datatol: {},
      datatolchild: {},
      showver: false,
      showsou: false,
      showtol: false,
      params: {
        appSources: [],
        appVersions: [],
        type: 0
      },
      showtop: true,
      showmap: false
      // itemSet: {},
    };
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
    // 取消按钮
    closever() {
      this.showver = false;
    },
    closesou() {
      this.showsou = false;
    },
    closetol() {
      this.showtol = false;
    },
    showtols() {
      this.showver = false;
      this.showsou = false;
      this.showtol = true;
    },
    showvers() {
      this.showver = true;
      this.showsou = false;
      this.showtol = false;
    },
    showsous() {
      this.showver = false;
      this.showsou = true;
      this.showtol = false;
    },
    // 版本号
    datavers(val) {
      this.dataverchild = val;
    },

    showMaskver(val) {
      this.showver = false;
      this.params.appVersions = this.dataverchild.map(k => k.labName);
      this.params.appSources = [];
      this.realtime(this.params);
    },
    deletever(index) {
      this.dataverchild.splice(index, 1);
      this.params.appVersions.splice(index, 1);
      this.realtime(this.params);
    },
    datasous(val) {
      this.datasouchild = val;
    },
    // 渠道号
    showMasksou(val) {
      this.showsou = false;
      this.params.appSources = this.datasouchild.map(k => k.labName);
      this.params.appVersions = [];
      this.realtime(this.params);
    },
    deletesou(index) {
      this.datasouchild.splice(index, 1);
      this.params.appSources.splice(index, 1);
      const newsou = this.params.appSources.map((ele) => {
        return ele === '未知' ? '1' : ele;
      });
      this.params.appSources = newsou;
      this.realtime(this.params);
    },
    datatols(val) {
      this.datatolchild = val;
    },
    // 版本+渠道
    showMasktol(val) {
      this.showtol = false;
      this.params.appSources = this.datatolchild.datasouchild.map(k => k.labName);
      this.params.appVersions = this.datatolchild.dataverchild.map(k => k.labName);
      this.realtime(this.params);
    },
    // 删除
    deletever1(index) {
      this.datatolchild.dataverchild.splice(index, 1);
      this.params.appVersions.splice(index, 1);
      this.realtime(this.params);
    },
    // 删除
    deletesou1(index) {
      this.params.appSources.splice(index, 1);
      this.datatolchild.datasouchild.splice(index, 1);

      const newsou = this.params.appSources.map((ele) => {
        return ele === '未知' ? '1' : ele;
      });
      this.params.appSources = newsou;
      this.realtime(this.params);
    },
    getmaskData(i) {
      this.$http.get('/quwen/dashboard', {}).then(res => {
        res = res.json();
        // 渠道
        if (
          res.data.appSources.length >= 5 &&
          res.data.appSources.length % 5 !== 0
        ) {
          const arr = new Array(5 - res.data.appSources.length % 5);
          res.data.appSources.push(...arr);
        }
        this.datasou = res.data.appSources;
        // 版本
        if (
          res.data.appVersions.length >= 5 &&
          res.data.appVersions.length % 5 !== 0
        ) {
          const arr = new Array(5 - res.data.appVersions.length % 5);
          res.data.appVersions.push(...arr);
        }
        this.dataver = res.data.appVersions;
        this.datatol = {
          dataver: this.dataver,
          datasou: this.datasou
        };
      });
    },
    getMask(e, i) {
      this.dimentype = i;
      this.showmask = i;
      this.params.type = i;
      this.getmaskData(i);
      if (i === 1) {
        this.showver = true;
        this.showsou = false;
        this.showtol = false;
      } else if (i === 2) {
        this.showver = false;
        this.showsou = true;
        this.showtol = false;
      } else if (i === 3) {
        this.showver = false;
        this.showsou = false;
        this.showtol = true;
      } else {
        // 大盘的时候请求数据
        this.showver = false;
        this.showsou = false;
        this.showtol = false;
        const nodes1 = document.querySelectorAll('.dbitem');
        nodes1.forEach((element, index) => {
          if (index === 0) {
            addClass(element, 'isactive');
          }
        });
        this.params.type = 0;
        this.params.appSources = [];
        this.params.appVersions = [];
        this.realtime(this.params);
      }
      const nodes = document.querySelectorAll('.disitem');
      this.isAct(nodes, e, i);
    },
    isAct(nodes, e, i) {
      const isAct = hasClass(e.target, 'isactive');
      if (!isAct) {
        addClass(e.target, 'isactive');
      } else {
        return;
      }
      nodes.forEach((element, index) => {
        if (hasClass(element, 'isactive') && i !== index) {
          removeClass(element, 'isactive');
        }
      });
    },
    getDefault() {
      const nodes = document.querySelectorAll('.disitem');
      const nodes1 = document.querySelectorAll('.dbitem');
      nodes.forEach((element, index) => {
        if (index === 0) {
          addClass(element, 'isactive');
        }
      });
      nodes1.forEach((element, index) => {
        if (index === 0) {
          addClass(element, 'isactive');
        }
      });
      // 倒计时
      setInterval(() => {
        this.timeNum += 1000;
      }, 1000);
    },
    getType(e, i) {
      if (i === 0) {
        this.showtop = true;
        this.showmap = false;
      } else {
        this.showtop = false;
        this.showmap = true;
      }
      const nodes = document.querySelectorAll('.dbitem');
      this.isAct(nodes, e, i);
      this.realtime(this.params);
    },
    choose: function(index) {
      this.index = index;
      if (hasClass(document.getElementById('zx'), 'isactive')) {
        for (let item of this.newTableList) {
          item.isActive = false;
        }
        this.newTableList[index].isActive = true;
        this.updateCharts(index);
      }
      if (document.getElementById('hx') && hasClass(document.getElementById('hx'), 'isactive')) {
        for (let item of this.newTableList1) {
          item.isActive = false;
        }
        this.newTableList1[index].isActive = true;
        this.updateCharts1(index);
      }
    },
    // realtime: function(transition,params) {
    realtime(params) {
      this.$http.post('/quwen/dashboard', this.params).then(
        res => {
          res = res.json();
          if (res.success) {
            if (hasClass(document.getElementById('zx'), 'isactive')) {
              let data = this._fixData(res.data.top);
              this.newTableList = Object.keys(this.nameMap1).map(k => data[k]);
              this.init(this.newTableList[0]); // 渲染第一个先
              this.newTableList[0].isActive = true; // 渲染第一个先
            }
            // 横向
            if (
              document.getElementById('hx') &&
              hasClass(document.getElementById('hx'), 'isactive')
            ) {
              // // 横向的时候重新设置数据
              let data = this._fixData1(res.data.map);
              this.newTableList1 = Object.keys(this.nameMap2).map(k => data[k]);
              this.init1(this.newTableList1[0]); // 渲染第一个先
              this.newTableList1[0].isActive = true; // 渲染第一个先
            }
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
  },
  ready() {
    this.getDefault();
    this.realtime(this.params);
  }
};
</script>

<style lang="less">
.coredata-page {
  .item-list{
    span{margin-bottom:10px};
  }
  .item-wrapper {
    margin-top: 20px;
    min-height: 30px;
    margin-top: 20px;
    display: inline-block;
    h2 {
      float: left;
      line-height: 28px;
    }
    div {
      float: left;
      font-size: 0px;
      width: 800px;
      span {
        &:nth-of-type(1) {
          padding: 5px 10px;
        }
        font-size: 18px;
        background-color: rgba(64, 158, 255, 0.1);
        color: #409eff;
        border: 1px solid rgba(64, 158, 255, 0.2);
        display: inline-block;
        padding: 5px 5px;
        border-radius: 5px;
        margin-left: 5px;
        cursor: pointer;
        i {
          font-size: 18px;
        }
      }
    }
  }
  .dimension-wrapper {
    margin-top: 20px;
    h2 {
      display: inline-block;
    }
    .db-style {
      margin-left: 100px;
    }
    .isactive {
      background:#FFC715;
      color: #fff;
    }
    p {
      display: inline-block;
      font-size: 0;
      margin-left: 10px;
      span {
        font-size: 16px;
        padding: 4px 20px;
        border: 1px solid #999;
        border-right: none;
        cursor: pointer;
        &:nth-last-of-type(1) {
          border: 1px solid #999;
        }
      }
    }
  }
  .top-content {
    overflow-x: hidden;
    margin: 40px 0 60px 0;
    padding: 10px 10px 20px 10px;
  }
  .table-container {
    display: flex;
    flex-wrap: nowrap;
    // padding-bottom: 120px;
    // padding-left:100px;
    // padding-right:100px;
    justify-content: space-around;
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
    justify-content:space-between;
    text-align: center;
    cursor: pointer;
    // flex-grow: 1;
    // flex-shrink: 0;
    flex: 0 0 180px;
    // justify-content: space-around;
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
      // margin-top: 12px;
      color: #fff;
      line-height: 60px;
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
    border-bottom: none;
    h2.has-sub-title {
      font-weight: bold;
      font-size: 16px;
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
}
</style>
