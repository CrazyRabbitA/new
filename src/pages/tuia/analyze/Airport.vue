<template>
<div class="air-container">
  <pagetitle title="数据产出" id="top" class="adv-effect-title"></pagetitle>
  <div class="time-top">
    <datepicker :value.sync="params.date" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
    <d-button class="searchfilter" size="large" type="warning" @click="search">查询</d-button>
  </div>
  <div class="navbar" >
    <span :class="{active:curactive === index }" v-for="(index,item) in nav" :key="item" @click="goAnchor('#'+ item.id,index)">{{item.label}}</span>
  </div>
  <div class="table-wrap">
      <div id="yester" style="height:450px">
        <h2 class="table-tit">消耗情况</h2>
        <div>
          <table  class="tables" style="width:50%;float:left;">
            <tr>
              <th colspan="2">广告券类型</th>
              <th>广告券预算</th>
              <th>消费(元)</th>
              <th>余额</th>
            </tr>
            <tr class='ruleItem'>
              <td style="position: relative;">填充重点
                <d-tooltip content="未设置预算的广告计划，且当日广告计划对应的广告主预算没有被发放完毕" type="disable" placement="left">
                  <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                </d-tooltip>
              </td>
              <td>仍有预算的广告</td>
              <td>{{feeTable.point.estiConsume}}</td>
              <td>{{feeTable.point.consumeTotal}}</td>
              <td>{{feeTable.point.residueBudget}}</td>
            </tr>
            <tr class='ruleItem'>
              <td style="position: relative;">一定程度增长
                <d-tooltip content="当日最后时刻状态为『广告预算不足』的广告计划或当日广告计划对应的广告主预算被发放完毕" type="disable" placement="left">
                  <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                </d-tooltip>
              </td>
              <td>未设置预算的广告</td>
              <td>{{feeTable.somehow.estiConsume}}</td>
              <td>{{feeTable.somehow.consumeTotal}}</td>
              <td>{{feeTable.somehow.residueBudget}}</td>
            </tr>
            <tr class='ruleItem'>
              <td style="position: relative;">无增长空间
                <d-tooltip content="除其他状态的广告计划都为填充重点" type="disable" placement="left">
                  <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                </d-tooltip>
              </td>
              <td>无预算广告</td>
              <td>{{feeTable.nospace.estiConsume}}</td>
              <td>{{feeTable.nospace.consumeTotal}}</td>
              <td>{{feeTable.nospace.residueBudget}}</td>
            </tr>
            <tr class='ruleItem'>
              <td style="position: relative;">可忽略
                <d-tooltip content="
                  低Arpu值广告：当日广告计划的计算Arpu低于平台平均的发券成本（发券成本需后期明确）<br/><br/>
                  限iOS广告计划：广告计划定向的操作系统为『iOS』或『iOS、其他』（以默认配置为准）<br/><br/>
                  地域定向广告：广告计划的定向范围（城市数）少于平台所有区域的50%（以默认配置为准）<br/><br/>
                  短消耗时段广告：广告计划的发券时间端 细分至每一个小时，一个广告的投放时间段小于6个"
                  type="disable" placement="left">
                  <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                </d-tooltip>
              </td>
              <td>低收益，极少消耗广告</td>
              <td>{{feeTable.ignore.estiConsume}}</td>
              <td>{{feeTable.ignore.consumeTotal}}</td>
              <td>{{feeTable.ignore.residueBudget}}</td>
            </tr>
            <tr class='total ruleItem' style="font-weight:600;background:#f5f7fa">
              <td colspan="2">总计</td>
              <td>{{feeTable.total.estiConsume}}</td>
              <td>{{feeTable.total.consumeTotal}}</td>
              <td>{{feeTable.total.residueBudget}}</td>
            </tr>
          </table>
          <div id = "airpieyes" style="width: 50%;float:left; height:400px;">
          </div>
        </div>
      </div>
      <div id="top10">
        <h2 class="table-tit">填充重点广告Top10</h2>
        <table class="tables">
          <tr>
            <th>广告主名称</th>
            <th>广告名称</th>
            <th>广告ID</th>
            <th>发券量</th>
            <th>预计消耗</th>
            <th>消耗</th>
            <th>剩余消耗</th>
            <th>ARPU</th>
          </tr>
          <template v-for="(index,item) in top10">
            <tr v-if="index<top10.length-1" class='ruleItem' track-by="$index" :key="index">
              <td>{{item.accountName}}</td>
              <td>{{item.advertName}}</td>
              <td>{{item.advertId}}</td>
              <td>{{item.launchCount}}</td>
              <td>{{item.estiConsume}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.arpu}}</td>
            </tr>
            <tr  v-else class='ruleItem total'  track-by="$index" :key="index" style="font-weight:600;background:#f5f7fa">
              <td colspan="3">合计</td>
              <td>{{item.launchCount}}</td>
              <td>{{item.estiConsume}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.arpu}}</td>
            </tr>
          </template>
        </table>
      </div>
      <div id="ignore">
        <h2 class="table-tit">可忽略Top10</h2>
        <table class="tables">
          <tr>
            <th>广告主名称</th>
            <th>广告名称</th>
            <th>广告ID</th>
            <th>发券量</th>
            <th>预计消耗</th>
            <th>消耗</th>
            <th>剩余消耗</th>
            <th>ARPU</th>
            <th>广告状态</th>
          </tr>
          <template v-for="(index,item) in ignoreTop10">
            <tr v-if="index<ignoreTop10.length-1"  :key="index" class='ruleItem'>
              <td>{{item.accountName}}</td>
              <td>{{item.advertName}}</td>
              <td>{{item.advertId}}</td>
              <td>{{item.launchCount}}</td>
              <td>{{item.estiConsume}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.arpu}}</td>
              <td>{{item.status}}</td>
            </tr>
            <tr v-else :key="index"  class='ruleItem total' style="font-weight:600;background:#f5f7fa">
              <td colspan="3">合计</td>
              <td>{{item.launchCount}}</td>
              <td>{{item.estiConsume}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.arpu}}</td>
              <td>--</td>
            </tr>
          </template>
        </table>
      </div>
      <div id="Indus">
        <h2 class="table-tit">行业表现</h2>
        <div style="width: 100%; height:600px;overflow-y:hidden;overflow-x:auto;">
          <div id="airIndustybar" style="width: 150%; height:600px;">
          </div>
        </div>
        <div id="airIndustypie" style="width:100%; height:500px;margin-top:40px">
        </div>
      </div>
      <div id="KA">
        <h2 class="table-tit">KA广告主</h2>
        <table class="tables">
          <tr>
            <th>广告主</th>
            <th>广告行业</th>
            <th>消耗</th>
            <th>发券</th>
            <th>ARPU</th>
          </tr>
          <template v-for="(index,item) in kaTableSplice">
            <tr v-if="item.accountName"  :key="index" class='ruleItem' >
              <td>{{item.accountName}}</td>
              <td>{{item.newTrade}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.launchCount}}</td>
              <td>{{item.arpu}}</td>
            </tr>
            <tr class="total"  v-else :key="index" style="font-weight:600;background:#f5f7fa">
              <td colspan="2">合计</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.launchCount}}</td>
              <td>{{item.arpu}}</td>
            </tr>
          </template>
          <tr v-if="kaTable.length > 10 && kaTableSplice.length !== kaTable.length" class="total" :key="index">
            <td @click="iosHeadAdd('ka')" colspan="10" style="font-size:28px;cursor:pointer">+</td>
          </tr>
        </table>
        <div id = "airmasterpie" style="width: 100%; height:400px;margin-top:40px" >
        </div>
      </div>
      <div id="IOSPIE">
        <h2 class="table-tit">IOS大盘</h2>
          <table  class="tables">
            <tr>
              <th>大盘发券</th>
              <th>大盘消耗</th>
              <th>大盘ARPU</th>
              <th>大盘CPC</th>
              <th>剩余预算</th>
              <th>流量缺口（发券）</th>
            </tr>
            <template v-for="(index,item) in iosAll">
              <tr class='ruleItem' :key="index">
                <td>{{item.launchPv}}</td>
                <td>{{item.consumeTotal}}</td>
                <td>{{item.arpu}}</td>
                <td>{{item.avgCpc}}</td>
                <td>{{item.residueBudget}}</td>
                <td>{{item.residueLaunch}}</td>
              </tr>
            </template>
            <tr style="display:none"></tr>
          </table>
          <div  id = "airiosline" style="width: 100%; ;height:400px; margin-top:20px">

          </div>
         <p class="mock">
              <span>
                <i class="af"></i>
                大盘发券
              </span>
              <span>
                <i class="at"></i>
                流量缺口（发券）
              </span>
          </p>
      </div>
      <div id="IOSINDU">
        <h2 class="table-tit">IOS行业</h2>
        <table class="tables">
          <tr>
            <th>行业</th>
            <th>行业发券</th>
            <th>行业ARPU</th>
            <th>行业CPC</th>
            <th>行业消耗</th>
            <th>剩余预算</th>
            <th>流量缺口（发券）</th>
            <th>消耗占比</th>
            <th class="top-media">TOP消耗媒体</th>
          </tr>
          <template v-for="(index,item) in iosTradeTableSplice">
            <tr v-if="item.newTrade"  :key="index" class='ruleItem' >
              <td>{{item.newTrade}}</td>
              <td>{{item.launchPv}}</td>
              <td>{{item.arpu}}</td>
              <td>{{item.avgCpc}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.residueLaunch}}</td>
              <td>{{item.consumePercent}}</td>
              <td  @mouseenter = "show(item)" @mouseleave = "hidd" class="rela" >
                <span>{{item.topApp && item.topApp.length>6?(item.topApp.substr(0,6) + '...') : item.topApp }}</span>
                <span v-show="curIndex === item" class="po">{{item.topApp}}</span>
              </td>
            </tr>
            <tr class="total"  v-else  :key="index" style="font-weight:600;background:#f5f7fa">
              <td colspan="2">平均</td>
              <td>{{item.arpu}}</td>
              <td>{{item.avgCpc ? item.avgCp : '--' }}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.residueLaunch}}</td>
              <td>{{item.consumePercent}}</td>
              <td>--</td>
            </tr>
          </template>
          <tr v-if="iosTradeTable.length > 10 && iosTradeTable.length !== iosTradeTableSplice.length " class="total" :key="index">
            <td @click="iosHeadAdd('industry')" colspan="10" style="font-size:28px;cursor:pointer">+</td>
          </tr>
        </table>
      </div>

      <div id = "airiospie" style="width: 100%; height:500px;margin-top:20px">
      </div>
      <div id="IOSMASTER" style="margin-bottom:300px">
        <h2 class="table-tit">IOS头部广告主</h2>
        <table class="tables">
          <tr>
            <th>广告主名称</th>
            <th>广告主id</th>
            <th>广告主发券</th>
            <th>广告主ARPU</th>
            <th>CPC</th>
            <th>CTR</th>
            <th>广告主消耗</th>
            <th>剩余预算</th>
            <th>流量缺口（发券）</th>
            <th class="top-media">TOP消耗媒体</th>
          </tr>
          <template v-for="(index,item) in iosHeadSplice">
             <tr v-if="item.accountName"  :key="index" class='ruleItem'>
              <td>{{item.accountName}}</td>
              <td>{{item.accountId}}</td>
              <td>{{item.launchPv}}</td>
              <td>{{item.arpu}}</td>
              <td>{{item.avgCpc}}</td>
              <td>{{item.ctr}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.residueLaunch}}</td>
              <td  @mouseenter = "show(item)" @mouseleave = "hidd" class="rela">
                <span>{{item.topApp && item.topApp.length>6?(item.topApp.substr(0,6) + '...') : item.topApp }}</span>
                <span v-show="curIndex === item" class="po">{{item.topApp}}</span>
              </td>
            </tr>
            <tr class="total" v-else :key="index" style="font-weight:600;background:#f5f7fa">
              <td colspan="2">合计</td>
              <td>{{item.launchPv}}</td>
              <td>{{item.arpu}}</td>
              <td>{{item.avgCpc ? item.avgCpc : '--'}}</td>
              <td>{{item.ctr ? item.ctr : '--'}}</td>
              <td>{{item.consumeTotal}}</td>
              <td>{{item.residueBudget}}</td>
              <td>{{item.residueLaunch}}</td>
              <td>--</td>
            </tr>
          </template>
          <tr v-if="iosHead.length > 10 && iosHead.length !== iosHeadSplice.length" class="total" :key="index">
            <td @click="iosHeadAdd('head')" colspan="10" style="font-size:28px;cursor:pointer">+</td>
          </tr>
        </table>
      </div>
  </div>
  <loading :show="loadingRouteData"></loading>
  <span class="backtop" @click="goAnchor('#top')">返回顶部</span>
</div>
</template>
<script>
import { formatDate } from 'components/utils/dateUtils.js';
import { _fixNum, getPrecent } from '../../../components/utils/cheatDataUtils.js';
import airIndustypie from './mixins/airIndustypie.js';
import airpieyes from './mixins/airpieyes.js';
import airmasterpie from './mixins/airmaterpie.js';
import airIndustybar from './mixins/airIndustybar.js';
import airiosline from './mixins/airiosline.js';
import airiospie from './mixins/airiospie.js';
import MessageBox from 'components/basic/MessageBox';
const nav = [
  {
    id: 'yester',
    label: '消耗情况'
  },
  {
    id: 'top10',
    label: '填充重点广告Top10'
  },
  {
    id: 'ignore',
    label: '可忽略Top10'
  },
  {
    id: 'Indus',
    label: '行业表现'
  },
  {
    id: 'KA',
    label: 'KA广告主'
  },
  {
    id: 'IOSPIE',
    label: 'IOS大盘'
  },
  {
    id: 'IOSINDU',
    label: 'IOS行业'
  },
  {
    id: 'IOSMASTER',
    label: 'IOS头部广告主'
  }
];
export default {
  mixins: [airpieyes, airmasterpie, airIndustypie, airIndustybar, airiosline, airiospie],
  data() {
    return {
      nav: nav,
      data: {},
      feeTable: {
        nospace: {},
        somehow: {},
        ignore: {},
        point: {},
        total: {}
      },
      top10: [],
      ignoreTop10: [],
      kaTable: [],
      kaTableSplice: [],
      kaTableCount: 1,
      shows: false,
      curIndex: '',
      iosAll: [],
      iosTradeTable: [],
      iosTradeTableSplice: [],
      iosTradeTableCount: 1,
      iosHead: [],
      iosHeadSplice: [],
      iosHeadCount: 1,
      loadingRouteData: true,
      curactive: 0,
      params: {
        date: this._getYesDay(formatDate(new Date() - 24 * 60 * 60 * 1000))
      }
    };
  },
  methods: {
    /**
     * 订单时间禁选今天以后的时间
     */
    disabledDate: function(date) {
      let now = new Date();
      return (date.getTime() + 24 * 60 * 60 * 1000) > now.getTime();
    },
    search() {
      this.getData();
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr);
      return formatDate(yes);
    },
    // ka广告主
    kaTableAdd() {
    },
    // ios行业
    iosTradeTableAdd() {
    },
    // ios头部广告主
    iosHeadAdd(type) {
      switch (type) {
        case 'head':
          this.iosHeadSplice = this.iosHead.slice();
          break;
        case 'industry':
          this.iosTradeTableSplice = this.iosTradeTable;
          break;
        case 'ka':
          this.kaTableSplice = this.kaTable;
          break;
      }
    },
    goAnchor(selector, index) {
      var anchor = this.$el.querySelector(selector);
      if (selector === '#top') {
        document.documentElement.scrollTop = anchor.offsetTop - 100;
      } else {
        document.documentElement.scrollTop = anchor.offsetTop - 40;
        this.curactive = index;
      }
    },
    show(item) {
      this.curIndex = item;
    },
    hidd() {
      this.curIndex = '';
    },
    fixNum(num, type = 2) {
      return _fixNum(num, type);
    },
    getData() {
      this.loadingRouteData = true;
      this.$http.get('/airport/data', {
        params: this.params
      }).then((res) => {
        if (typeof res.data === 'string') {
          res = JSON.parse(res.data);
        } else {
          res = res.data;
        }
        this.loadingRouteData = false;
        if (!res.success) {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
          return;
        }
        let data = res.data;
        // 昨日消耗情况 排序
        data.feeTable.forEach(ele => {
          switch (ele.mark) {
            case '无增长空间':
              this.feeTable.nospace = ele;
              break;
            case '一定程度增长':
              this.feeTable.somehow = ele;
              break;
            case '填充重点':
              this.feeTable.point = ele;
              break;
            case '可忽略':
              this.feeTable.ignore = ele;
              break;
            case '合计':
              this.feeTable.total = ele;
              break;
          }
        });
        let {keys, values} = Object;
        // 昨日消耗情况
        for (let ele of values(this.feeTable)) {
          for (let key of keys(ele)) {
            ele[key] = this.fixNum(ele[key]);
          }
        }
        // top10
        this.top10 = data.top10;
        this.top10.forEach(ele => {
          for (let key of keys(ele)) {
            if (key === 'advertId' || typeof ele[key] !== 'number') {
              ele[key] = ele[key];
            } else {
              ele[key] = key === 'launchCount' ? this.fixNum(ele[key], 0) : this.fixNum(ele[key]);
            }
          }
        });
        // 可忽略top10
        this.ignoreTop10 = data.ignoreTop10;
        this.ignoreTop10.forEach(ele => {
          for (let key of keys(ele)) {
            if (key === 'advertId' || typeof ele[key] !== 'number') {
              ele[key] = ele[key];
            } else {
              ele[key] = key === 'launchCount' ? this.fixNum(ele[key], 0) : this.fixNum(ele[key]);
            }
          }
        });
        // KA广告主
        this.kaTable = data.kaTable;
        this.kaTableSplice = data.kaTable.slice(0, 10);
        this.kaTable.forEach(ele => {
          for (let key of keys(ele)) {
            if (typeof ele[key] !== 'number') {
              ele[key] = ele[key];
            } else {
              ele[key] = key === 'launchCount' ? this.fixNum(ele[key], 0) : this.fixNum(ele[key]);
            }
          }
        });
        // IOS大盘
        this.iosAll = data.iosAll;
        this.iosAll.forEach(ele => {
          for (let key of keys(ele)) {
            ele[key] = key === 'launchPv' || key === 'residueLaunch' ? this.fixNum(ele[key], 0) : this.fixNum(ele[key]);
          }
        });
        // IOS行业
        this.iosTradeTable = data.iosTradeTable;
        this.iosTradeTableSplice = data.iosTradeTable.slice(0, 10);
        this.iosTradeTable.forEach((ele) => {
          for (let key of keys(ele)) {
            if (typeof ele[key] !== 'number') {
              ele[key] = ele[key];
            } else {
              if (key === 'launchPv' || key === 'residueLaunch') {
                ele[key] = this.fixNum(ele[key], 0);
              } else if (key === 'consumePercent') {
                ele[key] = getPrecent(ele[key]);
              } else {
                ele[key] = this.fixNum(ele[key]);
              }
            }
          }
        });
        // IOS头部广告主
        this.iosHead = data.iosHead;
        this.iosHeadSplice = data.iosHead.slice(0, 10);
        this.iosHead.forEach((ele) => {
          for (let key of keys(ele)) {
            if (key === 'accountId' || typeof ele[key] !== 'number') {
              ele[key] = ele[key];
            } else {
              if (key === 'launchPv' || key === 'residueLaunch') {
                ele[key] = this.fixNum(ele[key], 0);
              } else if (key === 'ctr') {
                ele[key] = getPrecent(ele[key]);
              } else {
                ele[key] = this.fixNum(ele[key]);
              }
            }
          }
        });
        // 昨日消耗饼图饼图
        this.inityeschart(data.feePie);
        // KA广告主消耗占比饼图
        this.initmasterchart(data.kaPie);
        // 行业消耗饼图
        this.airIndustypie(data.tradePie);
        // 行业消耗柱状图
        this.airIndustybar(data.tradeHistogram);
        // IOS发券面积图
        this.airiosline(data.iosArea);
        // 行业消耗饼图
        this.airiospie(data.iosTradePie);
      });
    }
  },
  ready() {
    this.getData();
  }
};
</script>
<style lang="less">
.air-container{
  .table-tit{
    margin-top: 30px;
    margin-bottom: 30px;
  }
  table{
    border:1px solid #eee;
    th{
      border-right:1px solid #eee;
      font-size:16px;
      &:nth-last-child(1) {
        border:none
      }
      background:#eee ;
    }
    tr{
      height:40px;
      line-height: 40px;
      border-bottom:1px solid #eee;
      td{
        font-size:14px;
        text-align: center;
        border-right:1px solid #eee;
      }
      &:nth-child(odd) {
        background: #f5f7f9;
      }
       &.total{
        background: none;
      }
    }
    .top-media{
      width: 150px;
    }
  }
}
.rela{
  position: relative;
  cursor: pointer;
  .po{
    position: absolute;
    display: block;
    width:200px;
    top:40px;
    left:-200px;
    background:#eee;
    z-index:100;
    text-align: left;
    padding:10px;
    border-radius:10px;
  }
}
.navbar{
  display: inline-block;
  line-height: 40px;
  margin-top:10px;
  margin-bottom: 10px;
  border:1px solid #999;
  position: sticky;
  top: 0;
  z-index: 888;
  background: #fff;
  box-shadow:0 15px 30px rgba(0,0,0,0.1);
  span{
    cursor:pointer;
    display: inline-block;
    padding:0 10px;
    border-right:1px solid #999;
    &:nth-last-child(1) {
      border:none;
    }
  }
}
.backtop{
  position: fixed;
  right:20px;
  bottom:20px;
  display: inline-block;
  width:40px;
  padding:0 10px;
  line-height:30px;
  background:coral;
  opacity: .7;
  color:#fff;
  cursor: pointer;
  z-index: 100;
}
.active{
  background:coral;
  color:#fff;
}
.mock{
  text-align: center;
  font-size:12px;
  span{
    margin-right:10px;
  }
  .af {
    display:inline-block;
    width:20px;
    height:10px;
    background: #356eb2
  }
  .at {
    display:inline-block;
    width:20px;
    height:10px;
    background: #b43532
  }

}
.time-top {
    margin-top:10px;
  }
</style>

