<template>
<div id='scroll' class="adv-page">
  <pagetitle title="广告效果分析" class="adv-effect-title"></pagetitle>
  <div class="data-type">
    <h2>请选择要分析的后端数据类型</h2>
    <div class="radio-group">
      <label for="" class="radio-label">
        <input type="radio" name="datatype" class="radio-control datatype-radio"  v-model="params.analyseType" value="0"/>
          落地页转化
      </label>
    </div>
    <div class="radio-group">
      <label for="" name="strategy" class="radio-label">
        <input type="radio" class="radio-control datatype-radio" name="datatype" v-model="params.analyseType" value="1"/>
          安装APP
      </label>
    </div>
    <div class="radio-group">
      <label for="" name="strategy" class="radio-label">
        <input type="radio" class="radio-control datatype-radio" name="datatype" v-model="params.analyseType" value="2"/>
          启动APP
      </label>
    </div>
    <div class="radio-group">
      <label for="" name="strategy" class="radio-label">
        <input type="radio" class="radio-control datatype-radio" name="datatype" v-model="params.analyseType" value="3"/>
          注册账号
      </label>
    </div>
    <div class="radio-group">
      <label for="" name="strategy" class="radio-label">
        <input type="radio" class="radio-control datatype-radio" name="datatype" v-model="params.analyseType" value="4"/>
          激活账号
      </label>
    </div>
    <div class="radio-group">
      <label for="" name="strategy" class="radio-label">
        <input type="radio" class="radio-control datatype-radio" name="datatype" v-model="params.analyseType" value="5"/>
          登录账号
      </label>
    </div>
    <div class="radio-group">
      <label for="" name="strategy" class="radio-label">
        <input type="radio" class="radio-control datatype-radio" name="datatype" v-model="params.analyseType" value="6"/>
          用户付费
      </label>
    </div>
  </div>
  <validator name="validator" @valid="valid = true" @invalid="valid = false">
    <div class="search-area cf">
      <daterangepicker :error-show.sync="errorShow" :start.sync="params.startDate" :end.sync="params.endDate" :range="30"></daterangepicker>
      <div class="form-filter-group cf">
          <p class="filter-label fl">计划ID：</p>
          <input type="text" class="form-control fl" placeholder="请输入计划ID" :class="{'form-control-dirty': $validator.input && $validator.input.advertId}" v-model= "params.advertId" v-validate:advertid="fields.advertid">
          <invalidtip :show="hasValidationError('advertid', 'validator', hasSubmited)">{{firstValidationMessage('advertid', 'validator')}}</invalidtip>
      </div>
      <div class="form-filter-group cf">
          <p class="filter-label fl filter-label-strategid">策略ID：</p>
          <input type="text" class="form-control fl" placeholder="请输入策略ID" :class="{'form-control-dirty': $validator.input && $validator.input.packageId}" v-model= "params.packageId" v-validate:packageid="fields.packageid">
          <invalidtip :show="hasValidationError('packageid', 'validator', hasSubmited)">{{firstValidationMessage('packageid', 'validator')}}</invalidtip>
      </div>
      <d-button class="searchfilter" size="large" type="warning" @click="search" >查询</d-button>
      <template v-if="isCanAnalyze">
        <div class="fr adv-effect-area-right">
          <div class="form-filter-group cf">
              <p class="filter-label fl">目标成本：</p>
              <p class="adv-effect-input-group cf">
                <input type="text" class="form-control adv-effect-input-group-input" placeholder="请输入目标成本" v-model= "params.costPay" ><span class="unit">元</span>
              </p>
          </div>
          <d-button class="searchfilter" size="large" type="warning" @click="anyzel">根据已选条件分析</d-button>
        </div>
      </template>
    </div>
 </validator>
  <div class="info-data">
    <table>
        <tr class="tr-header">
          <td width="30%">推广计划名称:<span class="padlf6">{{data.basics.advertName || '-'}}</span></td>
          <td width="25%">配置名称:<span class="padlf6">{{data.basics.packageName || '-'}}</span></td>
          <td width="25%" style="padding-right:10px">消耗:
            <span class="padlf6 ">{{data.basics.consumeTotal ? data.basics.consumeTotal + '元': '-'}}</span>
            <span class="adview" @click.native.stop="openmask($event)" style="cursor:pointer; float:right"> <i  class="iconanaly ads">&#xe60e;</i> 分析视图</span>
          </td>
          <td rowspan="6" width="30%"  class="cost-info ">
            <p class="cost-item">建议CPC出价：<span class="cost">{{sucostpay || '--'}}元</span></p>
            <p class="tip-cpc">Tips：输入目标成本，勾选定向条件，根据已选条件分析，可得建议CPC出价</p>
            <div class="download-cfg" @click="downloadCfgBag">导出配置包</div>
          </td>
        </tr>
        <tr class="tr-items">
          <td>ARPU<span class="padlf20">{{data.basics.arpu || '-'}}</span></td>
          <td>发券<span class="padlf20">{{data.basics.launchCount || '-'}}</span></td>
          <td v-if="sucostpay ==''" >成功率<span class="padlf20">{{data.basics.sucFitrate || '-'}}</span></td>
          <td v-else >成功率<span class="padlf20">-</span></td>

        </tr>
         <tr class="tr-items">
          <td>点击单价<span class="padlf20">{{data.basics.clickPrice || '-'}}</span></td>
          <td>点击<span class="padlf20">{{data.basics.tuiaConsumerCount || '-'}}</span></td>
          <td>点击率<span class="padlf20">{{data.basics.clickRatio || '-'}}</span></td>

        </tr>
         <tr class="tr-items">
          <td>转化成本<span class="padlf20">{{data.basics.transCost || '-'}}</span></td>
          <td>转化<span class="padlf20">{{data.basics.effectPv || '-'}}</span></td>
          <td>转化率<span class="padlf20">{{data.basics.transRatio || '-'}}</span></td>
        </tr>
        <tr class="tr-header">
          <td width="30%">大盘数据</td>
          <td></td>
          <td  style="text-align:right;padding-right:10px" width="18%">
            <span class="bigdata" style="cursor:pointer" @click.native.stop="openmask($event)"><i  class="iconanaly">&#xe60e;</i>  分析视图</span>
          </td>
        </tr>
        <tr class="tr-items">
          <td>日均发券UV<span class="padlf20">{{data.dashboard.launchPvAvg || '-'}}</span></td>
          <td>日均点击UV<span class="padlf20">{{data.dashboard.efclickPvAvg || '-'}}</span></td>
          <td>点击均价<span class="padlf20">{{data.dashboard.clickPrice ? data.dashboard.clickPrice : '-'}}</span></td>
        </tr>
    </table>
  <div class="cfg-info" v-if="data.packages && data.packages.length > 0">
     <h2 class="cfg-title">广告配置信息</h2>
     <template v-for="(index, item) in data.packages">
       <span class="cfg-item" :key="index">
          {{item.packageName}} (ID：{{item.packageId}})
       <span>
     </template>
  </div>
  <div class="bar">
    <bar-chart  :chart-id="'appsChart'" :check-list.sync="appsData.checkList" :cost-pay="showBarColor" :cost-check="costCheck" :data-obj="appsData"></bar-chart>
  </div>
  <div class="bar slotChart">
    <bar-chart  :chart-id="'slotChart'" :check-list.sync="slotData.checkList" :cost-pay="showBarColor" :cost-check="costCheck" :data-obj="slotData"></bar-chart>
  </div>
  <div class="bar">
    <bar-chart   :chart-id="'timeIntervalChart'" :check-list.sync="timeIntervalData.checkList" :cost-check="costCheck" :cost-pay="showBarColor" :data-obj="timeIntervalData"></bar-chart>
  </div>
  <div class="bar">
    <bar-chart  :chart-id="'provincesChart'" :check-list.sync="provincesData.checkList" :cost-check="costCheck" :cost-pay="showBarColor" :data-obj="provincesData"></bar-chart>
  </div>

  <div class="bar bar-left">
    <bar-chart  :chart-id="'priceSectionChart'" :check-list.sync="priceSectionData.checkList" :cost-check="costCheck" :cost-pay="showBarColor" :class-object="classObject" :data-obj="priceSectionData"></bar-chart>
  </div>
  <div class="bar bar-middle">
    <bar-chart  :chart-id="'timesChart'" :check-list.sync="timesData.checkList" :cost-check="costCheck" :cost-pay="showBarColor" :class-object="classObject"  :data-obj="timesData"></bar-chart>
  </div>
  <div class="bar bar-right">
    <bar-chart  :chart-id="'platformsChart'" :check-list.sync="platformsData.checkList" :cost-check="costCheck" :cost-pay="showBarColor"  :class-object="classObject"  :data-obj="platformsData"></bar-chart>
  </div>
  <div class="bar">
    <bar-chart  :chart-id="'brandName'" :check-list.sync="brandNameData.checkList" :cost-check="costCheck" :cost-pay="showBarColor" :class-object="classObject" :data-obj="brandNameData"></bar-chart>
  </div>
  <div class="bar bar-left">
    <bar-chart  :chart-id="'appFlowType'" :check-list.sync="appFlowTypeData.checkList" :cost-check="costCheck" :cost-pay="showBarColor" :class-object="classObject" :data-obj="appFlowTypeData"></bar-chart>
  </div>
  <loading :show="$loadingRouteData"></loading>
  <analymask :chartdata="chartDatas" @to-parent="isshow"  :show.sync="show" :title="title"></analymask>

  <!-- <component :is="curview" :title = "title" :show.sync="show" :on-close="onClose" ></component> -->
  </div>
</template>

<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
import barChart from './components/barChart.vue';
import validationMixins from 'components/utils/validationMixins';
import { formatDate } from 'components/utils/dateUtils';
import analymask from './components/analymask.vue';
// 媒体
const appsData = {
  chartType: 'apps',
  title: '媒体',
  variance: '',
  isShowSortItem: true,
  isShowFilterItem: true,
  sortItemName: '排序方式',
  filterItemName: '按消耗占比展示',
  sortItem: 'advToLow',
  filterItem: 'TOP10',
  sortItemArr: [
    {
      label: '按消耗占比由高到低',
      id: 'advToLow'
    },
    {
      label: '按转化成本由低到高',
      id: 'costToHigh'
    },
    {
      label: '按转化成本由高到低',
      id: 'costToLow'
    }
  ],
  filterItemArr: [
    {
      label: 'TOP10',
      id: 'TOP10'
    },
    {
      label: 'TOP30',
      id: 'TOP30'
    },
    {
      label: 'TOP50',
      id: 'TOP50'
    },
    {
      label: '全部',
      id: 'other'
    }
  ],
  chartData: [],
  checkList: [],
  consumeTotal: 0
};
// 广告位
const slotData = {
  chartType: 'slot',
  title: '广告位',
  variance: '',
  isShowSortItem: true,
  isShowFilterItem: true,
  sortItemName: '排序方式',
  filterItemName: '按消耗占比展示',
  sortItem: 'advToLow',
  filterItem: 'TOP10',
  sortItemArr: [
    {
      label: '按消耗占比由高到低',
      id: 'advToLow'
    },
    {
      label: '按转化成本由低到高',
      id: 'costToHigh'
    },
    {
      label: '按转化成本由高到低',
      id: 'costToLow'
    }
  ],
  filterItemArr: [
    {
      label: 'TOP10',
      id: 'TOP10'
    },
    {
      label: 'TOP30',
      id: 'TOP30'
    },
    {
      label: 'TOP50',
      id: 'TOP50'
    },
    {
      label: '全部',
      id: 'other'
    }
  ],
  chartData: [],
  checkList: [],
  consumeTotal: 0
};
// 时段
const timeIntervalData = {
  chartType: 'timeInterval',
  title: '时段',
  variance: '',
  isShowSortItem: true,
  isShowFilterItem: false,
  sortItemName: '排序方式',
  filterItemName: '按消耗占比展示',
  sortItem: 'time',
  sortItemArr: [
    {
      label: '按时间段排序',
      id: 'time'
    },
    {
      label: '按消耗占比由高到低',
      id: 'advToLow'
    },
    {
      label: '按转化成本由低到高',
      id: 'costToHigh'
    },
    {
      label: '按转化成本由高到低',
      id: 'costToLow'
    }
  ],
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
// 地域
const provincesData = {
  title: '地域',
  variance: '',
  chartType: 'provinces',
  isShowSortItem: true,
  isShowFilterItem: false,
  sortItemName: '排序方式',
  sortItem: 'advToLow',
  sortItemArr: [
    {
      label: '按消耗占比由高到低',
      id: 'advToLow'
    },
    {
      label: '按转化成本由低到高',
      id: 'costToHigh'
    },
    {
      label: '按转化成本由高到低',
      id: 'costToLow'
    }
  ],
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
// 设备
const priceSectionData = {
  title: '设备',
  variance: '',
  chartType: 'priceSection',
  isShowSortItem: false,
  isShowFilterItem: false,
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
// 次序
const timesData = {
  title: '次序',
  variance: '',
  chartType: 'times',
  isShowSortItem: false,
  isShowFilterItem: false,
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
// 操作系统
const platformsData = {
  title: '操作系统',
  variance: '',
  chartType: 'platforms',
  isShowSortItem: false,
  isShowFilterItem: false,
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
// 手机品牌
const brandNameData = {
  title: '手机品牌',
  variance: '',
  chartType: 'brandName',
  isShowSortItem: true,
  isShowFilterItem: false,
  sortItemName: '排序方式',
  sortItem: 'advToLow',
  sortItemArr: [
    {
      label: '按消耗占比由高到低',
      id: 'advToLow'
    },
    {
      label: '按转化成本由低到高',
      id: 'costToHigh'
    },
    {
      label: '按转化成本由高到低',
      id: 'costToLow'
    }
  ],
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
// 流量来源
const appFlowTypeData = {
  title: '流量来源',
  variance: '',
  chartType: 'appFlowType',
  isShowSortItem: false,
  isShowFilterItem: false,
  chartData: [],
  consumeTotal: 0,
  checkList: []
};
export default {
  mixins: [validationMixins],
  components: {
    barChart,
    analymask
  },
  data() {
    return {
      curview: analymask,
      title: '',
      show: false,
      valid: false,
      sucostpay: '',
      showBarColor: 0,
      fields: {
        advertid: {
          required: {
            rule: true,
            message: '不能为空'
          },
          pattern: {
            rule: '/^[0-9]*$/',
            message: '请输入正确的计划ID'
          }
        },
        packageid: {
          pattern: {
            rule: '/^[0-9]*$/',
            message: '请输入正确的策略ID'
          }
        },
        costpay: {
          required: {
            rule: true,
            message: '不能为空'
          },
          pattern: {
            rule: '/^[0-9]*$/',
            message: '请输入正确的成本'
          }
        }
      },
      data: {
        basics: {},
        // 大盘数据
        dashboard: {}
      },
      params: {
        advertId: '',
        packageId: '',
        // 数据类型
        startDate: this._getYesDay(formatDate(new Date())),
        endDate: this._getYesDay(formatDate(new Date())),
        apps: '',
        slotId: '', // 广告位
        times: '',
        timeInterval: '',
        priceSection: '',
        provinces: '',
        platforms: '',
        costPay: '',
        brandName: '',
        appFlowType: '',
        analyseType: '0'
      },
      costCheck: 1,
      isAnalyze: false,
      classObject: {
        class: {
          height: '500px'
        },
        barWidth: 20
      },
      appsData: appsData,
      slotData: slotData,
      timesData: timesData,
      platformsData: platformsData,
      timeIntervalData: timeIntervalData,
      provincesData: provincesData,
      priceSectionData: priceSectionData,
      brandNameData: brandNameData, // 手机品牌
      appFlowTypeData: appFlowTypeData, // 流量来源
      isCanAnalyze: false,
      errorShow: false,
      // 图表数据
      chartDatas: {},
      dataParams: {}
    };
  },
  methods: {
    onClose() {
      this.showmask = false;
    },
    openmask(e) {
      const clsName = e.target.className;
      this.dataParams = this.getParams();
      const that = this;
      // 没有数据的时候返回
      if (Object.keys(this.data.basics).length === 0) {
        return;
      }
      this.$loadingRouteData = true;
      that.getChartList(clsName, this.dataParams);
    },
    getChartList(cls, dataParams) {
      // 广告数据
      if (cls === 'adview' || cls === 'iconanaly ads') {
        this.$http.post('/effect/analyse/view', dataParams).then(
          res => {
            const resdata = JSON.parse(res.data);
            if (!resdata.success) {
              this.show = false;
              this.$loadingRouteData = false;
              MessageBox({
                title: resdata.desc,
                type: 'error'
              });
              this.show = false;
              return;
            }
            this.$loadingRouteData = false;
            this.chartDatas = JSON.parse(res.data).data;
            this.title = `${this.data.basics.advertName ||
              this.data.basics.packageName}分析视图`;
            this.show = true;
          },
          res => {
            this.$loadingRouteData = false;
            MessageBox({
              title: '网络错误！',
              type: 'error'
            });
          }
        );
      } else {
        // 大盘数据
        this.$http.post('/eyes/flow/effect/statistic/view', dataParams).then(
          res => {
            const resdata = JSON.parse(res.data);
            if (!resdata.success) {
              MessageBox({
                title: resdata.desc,
                type: 'error'
              });
              this.$loadingRouteData = false;
              this.show = false;
              return;
            }
            this.$loadingRouteData = false;
            this.title = `${this.params.startDate}至${
              this.params.endDate
            }流量分析视图`;
            this.chartDatas = JSON.parse(res.data).data;
            this.show = true;
          },
          res => {
            this.$loadingRouteData = false;
            MessageBox({
              title: '网络错误！',
              type: 'error'
            });
          }
        );
      }
      // this.show = true;
    },
    // 遮罩层显示
    isshow(data) {
      this.show = data;
    },
    getDataList() {
      this.hasSubmited = true;
      if (this.valid === false) {
        this.hasSubmited = false;
        MessageBox({
          title: '请确认输入是否正确！',
          type: 'error'
        });
        return;
      }
      this.$loadingRouteData = true;
      this.$http.post('/effect/analyse', this.params).then(
        res => {
          res = res.json();
          if (res.success) {
            this.isCanAnalyze = true;
            // table
            res.data.basics.arpu = res.data.basics.arpu.toFixed(2);
            res.data.basics.clickPrice = res.data.basics.clickPrice.toFixed(2);
            if (isNaN(res.data.basics.transCost)) {
              res.data.basics.transCost = '无转化';
            } else if (Number(res.data.basics.transCost) === Infinity) {
              res.data.basics.transCost = '无穷大';
            } else {
              res.data.basics.transCost = res.data.basics.transCost.toFixed(2);
            }
            // 发券
            res.data.basics.launchCount = _fixNum(
              res.data.basics.launchCount,
              0
            );
            // 点击
            res.data.basics.tuiaConsumerCount = _fixNum(
              res.data.basics.tuiaConsumerCount,
              0
            );
            //
            res.data.basics.effectPv = _fixNum(res.data.basics.effectPv, 0);
            res.data.basics.sucFitrate = this._precent(
              res.data.basics.sucFitrate
            );
            res.data.basics.clickRatio = this._precent(
              res.data.basics.clickRatio
            );
            if (res.data.basics.transRatio === '--') {
              res.data.basics.transRatio = '--';
            } else {
              res.data.basics.transRatio = this._precent(
                res.data.basics.transRatio
              );
            }

            // 大盘数据
            res.data.dashboard.efclickPvAvg = _fixNum(
              res.data.dashboard.efclickPvAvg,
              0
            );
            res.data.dashboard.clickPrice = res.data.dashboard.clickPrice.toFixed(
              2
            );
            res.data.dashboard.launchPvAvg = _fixNum(
              res.data.dashboard.launchPvAvg,
              0
            );
            this.data = res.data;
            // 媒体图
            this.appsData.chartData = this.data.apps;
            this.appsData.variance = this._precent(
              res.data.variance.appVariance
            );
            this.appsData.consumeTotal = this.data.basics.consumeTotal;
            // 广告位
            this.slotData.chartData = this.data.slot;
            this.slotData.variance = this._precent(
              res.data.variance.slotVariance
            );
            this.slotData.consumeTotal = this.data.basics.consumeTotal;
            // 时间段图
            this.timeIntervalData.chartData = this.data.timeInterval;
            this.timeIntervalData.variance = this._precent(
              res.data.variance.hourVariance
            );
            this.timeIntervalData.consumeTotal = this.data.basics.consumeTotal;
            // 地域图
            this.provincesData.chartData = this.data.provinces;
            this.provincesData.variance = this._precent(
              res.data.variance.provinceVariance
            );
            this.provincesData.consumeTotal = this.data.basics.consumeTotal;
            // 设备图
            this.priceSectionData.chartData = this.data.priceSection;
            this.priceSectionData.variance = this._precent(
              res.data.variance.priceVariance
            );
            this.priceSectionData.consumeTotal = this.data.basics.consumeTotal;
            // 次序图
            this.timesData.chartData = this.data.times;
            this.timesData.variance = this._precent(
              res.data.variance.timesVariance
            );
            this.timesData.consumeTotal = this.data.basics.consumeTotal;
            // 操作系统图
            this.platformsData.chartData = this.data.platforms;
            this.platformsData.variance = this._precent(
              res.data.variance.platformVariance
            );
            this.platformsData.consumeTotal = this.data.basics.consumeTotal;
            // 手机品牌
            this.brandNameData.chartData = this.data.brandName;
            this.brandNameData.variance = this._precent(
              res.data.variance.brandNameVariance
            );
            this.brandNameData.consumeTotal = this.data.basics.consumeTotal;
            // 流量来源
            this.appFlowTypeData.chartData = this.data.appFlowType;
            this.appFlowTypeData.variance = this._precent(
              res.data.variance.appFlowTypeVariance
            );
            this.appFlowTypeData.consumeTotal = this.data.basics.consumeTotal;
            // 成本
            if (this.params.costPay && this.params.costPay > 0) {
              this.showBarColor = Number(this.params.costPay);
              if (isNaN(res.data.basics.transCost)) {
                this.sucostpay = '';
              } else {
                this.sucostpay = this._floatDiv(
                  this.params.costPay,
                  res.data.basics.transCost
                );
                this.sucostpay = this._accMul(
                  this.sucostpay,
                  res.data.basics.clickPrice
                ).toFixed(2);
              }
            }
            // 分析出现颜色框
            if (this.isAnalyze) {
              this.costCheck = this.costCheck + 1;
              this.isAnalyze = false;
            }
            this.$loadingRouteData = false;
          } else {
            this.$loadingRouteData = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    resetParams() {
      this.params.appFlowType = '';
      this.params.apps = '';
      this.params.brandName = '';
      this.params.costPay = '';
      // this.params.packageId = '';
      this.params.platforms = '';
      this.params.priceSection = '';
      this.params.provinces = '';
      this.params.slotId = '';
      this.params.timeInterval = '';
      this.params.times = '';
    },
    getParams() {
      this.params.apps = this.appsData.checkList.join(',');
      if (this.params.apps.charAt(this.params.apps.length - 1) === ',') {
        this.params.apps = this.params.apps.substr(
          0,
          this.params.apps.length - 1
        );
      }
      // 广告位
      this.params.slotId = this.slotData.checkList.join(',');
      if (this.params.slotId.charAt(this.params.slotId.length - 1) === ',') {
        this.params.slotId = this.params.slotId.substr(
          0,
          this.params.slotId.length - 1
        );
      }
      this.params.times = this.timesData.checkList.join(',');
      this.params.timeInterval = this.timeIntervalData.checkList.join(',');
      this.params.priceSection = this.priceSectionData.checkList.join(',');
      this.params.provinces = this.provincesData.checkList.join(',');
      this.params.platforms = this.platformsData.checkList.join(',');
      this.params.brandName = this.brandNameData.checkList.join(',');
      this.params.appFlowType = this.appFlowTypeData.checkList.join(',');
      return this.params;
    },
    anyzel() {
      this.$loadingRouteData = true;
      this.isAnalyze = true;
      let reg = /^\d+(\.\d+)?$/;
      if (this.params.costPay === '' || !reg.test(this.params.costPay)) {
        this.$loadingRouteData = false;
        MessageBox({
          title: '请确认目标成本！',
          type: 'error'
        });
        return;
      }
      this.params.apps = this.appsData.checkList.join(',');
      if (this.params.apps.charAt(this.params.apps.length - 1) === ',') {
        this.params.apps = this.params.apps.substr(
          0,
          this.params.apps.length - 1
        );
      }
      // 广告位
      // 广告位
      this.params.slotId = this.slotData.checkList.join(',');
      if (this.params.slotId.charAt(this.params.slotId.length - 1) === ',') {
        this.params.slotId = this.params.slotId.substr(
          0,
          this.params.slotId.length - 1
        );
      }
      this.params.times = this.timesData.checkList.join(',');
      this.params.timeInterval = this.timeIntervalData.checkList.join(',');
      this.params.priceSection = this.priceSectionData.checkList.join(',');
      this.params.provinces = this.provincesData.checkList.join(',');
      this.params.platforms = this.platformsData.checkList.join(',');
      this.params.brandName = this.brandNameData.checkList.join(',');
      this.params.appFlowType = this.appFlowTypeData.checkList.join(',');
      this.getDataList();
    },
    search() {
      if (this.errorShow) {
        MessageBox({
          title: '时间范围不能超过30天！',
          type: 'error'
        });
        return;
      }
      this.resetParams();
      this.getDataList();
    },
    downloadCfgBag() {
      if (!this.isCanAnalyze) {
        this.$loadingRouteData = false;
        MessageBox({
          title: '请先查询！',
          type: 'error'
        });
        return;
      }
      if (this.params.advertId === '') {
        this.$loadingRouteData = false;
        MessageBox({
          title: '请输入广告ID！',
          type: 'error'
        });
        return;
      }
      this.params.apps = this.appsData.checkList.join(',');
      if (this.params.apps.charAt(this.params.apps.length - 1) === ',') {
        this.params.apps = this.params.apps.substr(
          0,
          this.params.apps.length - 1
        );
      }
      // 广告位
      this.params.slotId = this.slotData.checkList.join(',');
      if (this.params.slotId.charAt(this.params.slotId.length - 1) === ',') {
        this.params.slotId = this.params.slotId.substr(
          0,
          this.params.slotId.length - 1
        );
      }
      this.params.times = this.timesData.checkList.join(',');
      this.params.timeInterval = this.timeIntervalData.checkList.join(',');
      let priceSection = this.priceSectionData.checkList.join(',');
      priceSection = priceSection.replace('+', '%2B');
      this.params.provinces = this.provincesData.checkList.join(',');
      this.params.platforms = this.platformsData.checkList.join(',');
      this.params.brandName = this.brandNameData.checkList.join(',');
      this.params.appFlowType = this.appFlowTypeData.checkList.join(',');
      let goLink =
        '/effect/analyse/export?times=' +
        this.params.times +
        '&timeInterval=' +
        this.params.timeInterval +
        '&priceSection=' +
        priceSection +
        '&provinces=' +
        this.params.provinces +
        '&platforms=' +
        this.params.platforms +
        '&apps=' +
        this.params.apps +
        '&brandName=' +
        this.params.brandName +
        '&advertId=' +
        this.params.advertId +
        '&price=' +
        this.sucostpay +
        '&slotId=' +
        this.params.slotId +
        '&appFlowType=' +
        this.params.appFlowType +
        '&analyseType=' +
        this.params.analyseType;
      window.open(goLink);
    },
    _precent(num) {
      return parseFloat((num * 100).toPrecision(4)).toFixed(2) + '%';
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(yes);
    },
    _floatDiv(arg1, arg2) {
      let t1 = 0;
      let t2 = 0;
      let r1, r2;
      try {
        t1 = arg1.toString().split('.')[1].length;
      } catch (e) {}
      try {
        t2 = arg2.toString().split('.')[1].length;
      } catch (e) {}
      r1 = Number(arg1.toString().replace('.', ''));
      r2 = Number(arg2.toString().replace('.', ''));
      var _num = r1 / r2 * Math.pow(10, t2 - t1);
      return _num.toFixed(4);
    },
    _accMul(arg1, arg2) {
      let m = 0;
      let s1 = arg1.toString();
      let s2 = arg2.toString();
      try {
        m += s1.split('.')[1].length;
      } catch (e) {}
      try {
        m += s2.split('.')[1].length;
      } catch (e) {}
      return (
        Number(s1.replace('.', '')) *
        Number(s2.replace('.', '')) /
        Math.pow(10, m)
      );
    }
  }
};
</script>

<style lang="less">
.adv-page {
  .data-type{
    margin-top:10px;
    height:80px;
    h2{

      font-weight: normal;
      font-size:18px;
      margin-bottom:10px;
    }

    .radio-group{
      float:left;
      margin-right:20px;
      input{
        cursor: pointer;
      }
    }
  }
  .main {
    background-color: #fff;
    padding: 20px;
    margin: 20px;
  }
  .slotChart {
    .d-checkbox-control {
      display: inline-block !important;
    }
  }
  .adv-effect-title {
    border-bottom: 0px solid #fff;
  }
  .search-area {
    padding: 10px 0;
    .d-button {
      float: left;
    }
    .date-range {
      float: left;
      .datepicker {
        width: 140px;
        .datepicker-input {
          width: 140px !important;
        }
      }
    }
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      .invalid {
        margin: 0 15px 0 0;
        color: #f30;
      }
      .filter-label {
        font-size: 14px;
        font-weight: bold;
        color: #444;
        width: 100px;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        text-align: right;
      }
      .filter-label {
        width: 70px !important;
      }
      .filter-label-strategid {
        width: 60px !important;
      }
      .form-control {
        width: 120px;
        margin-right: 15px;
      }
      .iconhandle {
        right: 26px !important;
      }
      .adv-effect-input-group {
        position: relative;
        width: 226px;
        margin-right: 16px;
        .adv-effect-input-group-input {
          border-radius: 2px 0 0 2px;
        }
        .form-control:focus + .unit {
          border-color: #a8e7e7;
        }
        .unit {
          position: absolute;
          top: 0;
          right: 0;
          width: 36px;
          border: 1px solid #ccc;
          height: 34px;
          border-radius: 0 2px 2px 0;
          background: #fff;
          font-size: 14px;
          color: #444;
          line-height: 32px;
          text-align: center;
          border-left: 0;
        }
      }
    }
  }
  .info-data {
    .padlf20 {
      padding-left: 20px;
      float: right;
      padding-right: 15px;
    }
    .padlf6 {
      padding-left: 6px;
    }

    table {
      border: 1px solid #ccc;
      height: 211px;

      tbody {
        .tr-header {
          td {
            padding-left: 20px;
            font-size: 14px;
          }

          .cost-info {
            position: relative;
            background: #fff;
            border: 1px dashed #999;

            .cost-item {
              // line-height: 40px;
              padding-bottom: 10px;
              .cost {
                font-size: 16px;
                color: #ef6b3b;
              }
            }
            .tip-cpc {
              line-height: 20px;
            }
            .download-cfg {
              position: absolute;
              right: 10px;
              bottom: 10px;
              width: 100px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              color: #fff;
              border-radius: 5px;
              background: #ff795c;
              cursor: pointer;
              &:hover {
                background: #ff8970;
              }
            }
          }
        }
        border-bottom: 1px solid #ccc;
        .tr-items {
          border-bottom: 1px dashed #bbb;
          font-size: 14px;
          &:hover {
            background: #fff;
          }
          &:last-child {
            border-bottom: none;
          }
          td {
            border-right: 1px dashed #bbb;
            padding-left: 20px;
          }
        }
      }
    }
  }
  .cfg-info {
    padding: 10px 0px;
    .cfg-title {
      padding: 10px 0px;
    }
    .cfg-item {
      padding: 10px 0px;
      font-size: 14px;
      display: inline-block;
      width: 20%;
      text-align: left;
    }
  }
  @media screen and (max-width: 1468px) {
    .adv-effect-area-right {
      float: left !important;
      width: 100%;
    }
  }
  .bar {
    margin-top: 30px;
  }
  .bar-left {
    width: 32%;
    height: 440px;
    margin-right: 10px;
    display: inline-block;
  }
  .bar-middle {
    width: 32%;
    height: 440px;
    margin-right: 10px;
    display: inline-block;
  }
  .bar-right {
    width: 32%;
    height: 440px;
    display: inline-block;
  }
}
</style>
