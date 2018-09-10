<template>
  <d-modal :title="'报警规则（添加多条规则，同时生效）:'" effect="fade" :show.sync="show" width="1100" class="alarmmodal" :on-ok="submit" :on-close="onClose">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="cf inp-filter">
          <div class="form-filter-group cf" v-if="alarmmodal.showInput && alarmmodal.showInput.activity">
            <p class="filter-label fl filter-label-alarm">活动ID：</p>
            <input type="text" class="form-control fl form-control-alarm" placeholder="不输入则为全局" v-model= "alarmmodal.activityId">
          </div>
          <div class="form-filter-group cf" v-if="alarmmodal.showInput && alarmmodal.showInput.app">
            <p class="filter-label fl filter-label-alarm">媒体ID：</p>
            <input type="text" class="form-control fl form-control-alarm" placeholder="不输入则为全局" v-model= "alarmmodal.appId">
          </div>
          <div class="form-filter-group cf" v-if="alarmmodal.showInput && alarmmodal.showInput.slot">
            <p v-if="alarmmodal.dimensionType === 6" class="filter-label fl  filter-label-alarm">广告ID：</p>
            <p v-else class="filter-label fl  filter-label-alarm">广告位ID：</p>
            <input type="text" class="form-control fl form-control-alarm" placeholder="不输入则为全局" v-model= "alarmmodal.slotId">
          </div>
          <div class="form-filter-group cf quota">
            <p class="filter-label fl filter-label-alarm">指标：</p>
            <d-select :options.sync="currentQuotaArr" :value.sync="alarmmodal.quota" @select="getQuota"></d-select>
          </div>
        </div>
        <div class="block-search inp-filter">
          <div class="form-filter-group cf">
            <p class="filter-label fl filter-label-alarm">报警规则：</p>
            <d-select :options.sync="ruleTypeArr" :value.sync="params.ruleType"></d-select>
          </div>
          <div class="form-filter-group cf">
            <p class="filter-label fl   filter-label-alarm">阈值：</p>
            <input type="text" class="form-control fl form-control-alarm" placeholder="请输入数值(支持百分数，小数，整数)" v-model= "params.alertValue">
          </div>
          <div class="form-filter-group cf form-filter-time-select">
            <p class="filter-label fl   filter-label-alarm">生效时段：</p>
            <div class="fl">
              <time-range :select-node.sync="params.timeSlice"></time-range>
            </div>
          </div>
          <div class="cf">
            <d-button class="searchfilter fl" size="large" type="warning" @click="addRule">添加</d-button>
            <d-button class="searchfilter fl" size="large" type="warning" @click="search">查询</d-button>
            <d-button class="searchfilter fl" size="large" type="warning" @click="ruleCheck" v-if="isCanCheck">合理性校验</d-button>
            <span class="searchfilter fl longTime" v-if="isCanCheck">（单次校验时间较长，请耐心等待结果）</span>
          </div>
        </div>
        <div class="rule-list">
          <template v-for="(index, item) in data" track-by="$index">
          </template>
          <table class="recommend-list mt20">
            <thead>
              <tr class="tr-header">
                <template v-for="column in columns">
                  <th v-if="alarmmodal.showInput && alarmmodal.showInput.activity && column.dataIndex === 'activityId'">
                    {{column.title}}
                  </th>
                  <th v-if="alarmmodal.showInput && alarmmodal.showInput.activity && column.dataIndex === 'activityTitle'">
                    {{column.title}}
                  </th>
                  <th v-if="alarmmodal.showInput && alarmmodal.showInput.app && column.dataIndex === 'appId'">
                    {{column.title}}
                  </th>
                  <th v-if="alarmmodal.showInput && alarmmodal.showInput.app && column.dataIndex === 'appName'">
                    {{column.title}}
                  </th>
                  <th v-if="alarmmodal.showInput && alarmmodal.showInput.slot && column.dataIndex === 'slotId'">
                    <template v-if="alarmmodal.dimensionType === 6">
                      广告ID
                    </template>
                    <template v-else>
                      {{column.title}}
                    </template>
                  </th>
                  <th v-if="alarmmodal.showInput && alarmmodal.showInput.slot && column.dataIndex === 'slotName'">
                    <template v-if="alarmmodal.dimensionType === 6">
                      广告名称
                    </template>
                    <template v-else>
                      {{column.title}}
                    </template>
                  </th>
                  <th v-if="column.dataIndex !== 'activityId' && column.dataIndex !== 'appId' && column.dataIndex !== 'slotId' && column.dataIndex !== 'activityTitle' && column.dataIndex !== 'appName' && column.dataIndex !== 'slotName'">
                    {{column.title}}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody v-if="data && data.length !== 0">
              <tr class="tr-items" v-for="(index, item) in data" track-by="$index">
                <template v-for="column in columns">
                  <template v-if="column.action">
                    <td class="td-actions">
                      <p>
                        <tooltip content="编辑">
                          <a href="javascript:void(0)" @click="editClick(item)" class="iconhandle">&#xe601;</a>
                        </tooltip>
                        <tooltip content="删除" type="delete">
                          <a href="javascript:void(0)" @click="deleteClick(item.id)" class="iconhandle delete">&#xe61d;</a>
                        </tooltip>
                      </p>
                    </td>
                  </template>
                  <template v-else>
                    <template v-if="column.render">
                      <template v-if="alarmmodal.showInput && alarmmodal.showInput.activity && column.dataIndex === 'activityId'">
                        <td>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                      <template v-if="alarmmodal.showInput && alarmmodal.showInput.activity && column.dataIndex === 'activityTitle'">
                        <td>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                      <template v-if="alarmmodal.showInput && alarmmodal.showInput.app && column.dataIndex === 'appId'">
                        <td>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                      <template v-if="alarmmodal.showInput && alarmmodal.showInput.app && column.dataIndex === 'appName'">
                        <td>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                      <template v-if="alarmmodal.showInput && alarmmodal.showInput.slot && column.dataIndex === 'slotId'">
                        <td>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                      <template v-if="alarmmodal.showInput && alarmmodal.showInput.slot && column.dataIndex === 'slotName'">
                        <td>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                      <template v-if="column.dataIndex !== 'activityId' && column.dataIndex !== 'appId' && column.dataIndex !== 'slotId' && column.dataIndex !== 'activityTitle' && column.dataIndex !== 'appName' && column.dataIndex !== 'slotName'">
                        <!-- 生效时段 -->
                        <td v-if="column.dataIndex === 'timeNode'" class="td-actions">
                          <tooltip :content="column.render(item[column.dataIndex])">
                            <a href="javascript:void(0)" class="iconnav">&#xe68d;</a>
                          </tooltip>
                        </td>
                        <td v-else>{{column.render(item[column.dataIndex])}}</td>
                      </template>
                    </template>
                    <template v-else>
                      <td>{{item[column.dataIndex]}}</td>
                    </template>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
          <tableempty v-if="!alarmLoadingRouteData && (data && data.length === 0)"></tableempty>
          <d-pagination :total="totalList" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" ></d-pagination>
        </div>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer">
        <loading :show="alarmLoadingRouteData"></loading>
      </div>
    </template>
  </d-modal>
  <component :is="currentView" :obj="alarmObj" :show.sync="alarmObj.show"></component>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
import MessageBox from 'components/basic/MessageBox';
import delModal from './delModal';
import editModal from './editModal';
import alarmTipModal from './alarmTip';
import Tooltip from 'components/basic/Tooltip';
import timeRange from './timeRange';

const columns = [
  {
    title: '活动ID',
    dataIndex: 'activityId',
    render: (text) => {
      if (text) {
        return text;
      }
      return '大盘';
    }
  },
  {
    title: '活动名称',
    dataIndex: 'activityTitle',
    render: (text) => {
      if (text) {
        return text;
      }
      return '-';
    }
  },
  {
    title: '媒体ID',
    dataIndex: 'appId',
    render: (text) => {
      if (text) {
        return text;
      }
      return '大盘';
    }
  },
  {
    title: '媒体名称',
    dataIndex: 'appName',
    render: (text) => {
      if (text) {
        return text;
      }
      return '-';
    }
  },
  {
    title: '广告位ID',
    dataIndex: 'slotId',
    render: (text) => {
      if (text) {
        return text;
      }
      return '大盘';
    }
  },
  {
    title: '广告位名称',
    dataIndex: 'slotName',
    render: (text) => {
      if (text) {
        return text;
      }
      return '-';
    }
  },
  {
    title: '指标',
    dataIndex: 'quota',
    render: (text) => {
      if (text) {
        let renderText = text;
        quotaArr.forEach((item) => {
          if (text === item.rank) {
            renderText = item.label;
          }
        });
        return renderText;
      } else {
        return '-';
      }
    }
  },
  {
    title: '报警规则',
    dataIndex: 'ruleType',
    render: (text) => {
      if (text) {
        let label;
        ruleTypeArr.forEach(item => {
          if (item.id === text) {
            label = item.label;
          }
        });
        return label;
      }
      return '-';
    }
  },
  {
    title: '阈值',
    dataIndex: 'alertValue'
  },
  {
    title: '生效时段',
    dataIndex: 'timeNode',
    render: (text) => {
      let tpl = '';
      text.forEach(item => {
        tpl += item + '<br>';
      });
      return tpl;
    }
  },
  {
    title: '过去7天报警数次数',
    dataIndex: 'alertCount'
  },
  {
    title: '操作',
    action: true
  }
];
const dimensionArr = ['媒体维度规则', '广告位维度规则', '活动维度规则', '活动媒体维度规则', '活动广告位维度规则'];
const ruleTypeArr = [
  {
    label: '请选择报警规则',
    id: 0
  },
  {
    label: '上升百分比（比昨日同时段值）',
    id: 1
  },
  {
    label: '上升百分比（比七日同时段均值）',
    id: 2
  },
  {
    label: '上升百分比（比上一个时段值）',
    id: 3
  },
  {
    label: '上升百分比（比上周同日同时段）',
    id: 9
  },
  {
    label: '下降百分比（比昨日同时段值）',
    id: 4
  },
  {
    label: '下降百分比（比七日同时段均值）',
    id: 5
  },
  {
    label: '下降百分比（比上一个时段值）',
    id: 6
  },
  {
    label: '下降百分比（比上周同日同时段）',
    id: 10
  },
  {
    label: '最大值',
    id: 7
  },
  {
    label: '最小值',
    id: 8
  }];
const quotaArr = [
  {
    label: '广告位请求成功pv',
    id: 'actSucResponseCount',
    rank: 1
  },
  {
    label: '广告位曝光pv',
    id: 'actExposeCount',
    rank: 2
  },
  {
    label: '广告位曝光uv',
    id: 'actExposeUv',
    rank: 39
  },
  {
    label: '广告位点击pv',
    id: 'actClickCount',
    rank: 3
  },
  {
    label: '广告位点击uv',
    id: 'actClickUv',
    rank: 4
  },
  {
    label: '广告位点击率',
    id: 'advertClickRate',
    rank: 5
  },
  {
    label: '广告位访问pv',
    id: 'sdkPv',
    rank: 6
  },
  {
    label: '广告位访问uv',
    id: 'sdkUv',
    rank: 7
  },
  {
    label: '广告位CTR（UV）',
    id: 'ctr',
    rank: 40
  },
  {
    label: '活动请求pv',
    id: 'actRequestCount',
    rank: 8
  },
  {
    label: '活动请求uv',
    id: 'actRequestUv',
    rank: 9
  },
  {
    label: '活动参与pv',
    id: 'participateCount',
    rank: 10
  },
  {
    label: '活动参与uv',
    id: 'participateUv',
    rank: 11
  },
  {
    label: '广告位参与率',
    id: 'actParticipateRate',
    rank: 36
  },
  {
    label: '参与率',
    id: 'participateRate',
    rank: 12
  },
  {
    label: '复参数',
    id: 'dupliParticipateRate',
    rank: 13
  },
  {
    label: '每UV发券',
    id: 'launchPerSdkUv',
    rank: 14
  },
  {
    label: '活动广告券请求pv',
    id: 'advertRequestCount',
    rank: 15
  },
  {
    label: '每UV券请求',
    id: 'arcPsu',
    rank: 42
  },
  {
    label: '请求成功率',
    id: 'requestParticipateRate',
    rank: 16
  },
  {
    label: '发券成功率',
    id: 'launchRequestRate',
    rank: 17
  },
  {
    label: '活动广告发券量',
    id: 'launchCount',
    rank: 18
  },
  {
    label: '付费券占比',
    id: 'plpPlc',
    rank: 43
  },
  {
    label: '广告券曝光pv',
    id: 'advertExposureCount',
    rank: 19
  },
  {
    label: '广告券点击pv',
    id: 'advertClickCount',
    rank: 20
  },
  {
    label: '每UV券点击',
    id: 'clickPerSdk',
    rank: 21
  },
  {
    label: '广告券点击率',
    id: 'clickExposureRate',
    rank: 22
  },
  {
    label: '每uv收益',
    id: 'advertFeePerSdkUv',
    rank: 37
  },
  {
    label: '广告消耗',
    id: 'advertFee',
    rank: 23
  },
  {
    label: 'arpu值',
    id: 'arpu',
    rank: 44
  },
  {
    label: '付费券arpu值',
    id: 'acPplp',
    rank: 45
  },
  {
    label: '广告券曝光量',
    id: 'exposureCount',
    rank: 24
  },
  {
    label: '广告券点击量',
    id: 'clickCount',
    rank: 25
  },
  {
    label: '广告券计费点击量',
    id: 'efClickCount',
    rank: 26
  },
  {
    label: '计费点击uv',
    id: 'efClickUv',
    rank: 27
  },
  {
    label: '点击率',
    id: 'clickRate',
    rank: 28
  },
  {
    label: '消耗',
    id: 'consumeTotal',
    rank: 29
  },
  {
    label: '落地页访问pv',
    id: 'visitPv',
    rank: 30
  },
  {
    label: '落地页访问uv',
    id: 'visitUv',
    rank: 31
  },
  {
    label: '落地页效果pv',
    id: 'effectPv',
    rank: 32
  },
  {
    label: '落地页效果uv',
    id: 'effectUv',
    rank: 33
  },
  {
    label: 'CVR',
    id: 'cvr',
    rank: 34
  },
  {
    label: '点击单价',
    id: 'clickPrice',
    rank: 41
  },
  {
    label: '计费点击均价',
    id: 'chargeClickAvg',
    rank: 35
  },
  {
    label: '转化成本',
    id: 'effectCost',
    rank: 38
  }];
export default {
  components: {
    timeRange,
    Tooltip,
    delModal,
    editModal,
    alarmTipModal
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    close: {
      default: null
    },
    onChange: {
      type: Function,
      default: () => {}
    },
    alarmmodal: {
      type: Object,
      default: () => {}
    },
    isCanCheck: {
      type: Boolean,
      default: true
    }
  },
  ready() {
    this.currentQuotaArr = [];
    this.quotaArr.forEach((item) => {
      this.alarmmodal.quotaArr.forEach((key) => {
        if (item.id === key.id) {
          this.currentQuotaArr.push(item);
        }
      });
    });
    this.currentQuotaArr.unshift({
      label: '全部',
      id: 0,
      rank: 0
    });
    this.getQuota();
    this.getRule();
  },
  data() {
    return {
      alarmLoadingRouteData: false,
      data: {},
      columns: columns,
      dimensionArr: dimensionArr,
      ruleTypeArr: ruleTypeArr,
      quotaArr: quotaArr,
      currentQuotaArr: [],
      isShowDelModal: false,
      delRuleId: '',
      isShowEditModal: false,
      editRuleId: '',
      totalList: 0,
      $loadingRouteData: false,
      alarmObj: {
        show: false,
        alertValue: '',
        ruleTypeArr: ruleTypeArr,
        ruleType: 0,
        timeSlice: [],
        onOk: () => {}
      },
      currentView: '',
      params: {
        timeSlice: [],
        pageNum: 1,
        pageSize: 5,
        dimensionType: '',
        appId: '',
        activityId: '',
        slotId: '',
        quota: '',
        alertValue: '',
        ruleType: 0,
        extId: 0
      }
    };
  },
  methods: {
    submit() {
      this.show = false;
    },
    onClose() {
      if (this.close) {
        this.close();
      } else {
        this.show = false;
      }
    },
    onPageChange(page) {
      this.params.pageNum = page;
      this.getRule();
    },
    search() {
      this.getRule(1);
    },
    getQuota() {
      let quotaType;
      this.currentQuotaArr.forEach((item, index) => {
        if (item.id === this.alarmmodal.quota) {
          quotaType = item.rank;
        }
      });
      this.params.quota = quotaType;
    },
    addRule() {
      if (this.params.quota === 0) {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '请选择指标！',
          type: 'error'
        });
        return;
      }
      if (this.params.ruleType === 0) {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '请选择报警规则！',
          type: 'error'
        });
        return;
      }
      if (this.params.alertValue === '') {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '请输入阈值！',
          type: 'error'
        });
        return;
      }
      this.params.dimensionType = this.alarmmodal.dimensionType;
      this.params.appId = Number(this.alarmmodal.appId) || '';
      this.params.activityId = Number(this.alarmmodal.activityId) || '';
      this.params.slotId = Number(this.alarmmodal.slotId) || '';
      this.alarmLoadingRouteData = true;
      this.$http.post('/rule/add', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.params.ruleType = 0;
          this.params.alertValue = '';
          // 关闭弹层
          this.alarmObj.show = false;
          this.getRule();
          MessageBox({
            title: res.desc,
            type: 'success'
          });
        } else {
          this.alarmLoadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    getRule(page) {
      if (page) {
        this.params.pageNum = page;
      }
      this.params.dimensionType = this.alarmmodal.dimensionType;
      this.params.appId = Number(this.alarmmodal.appId) || '';
      this.params.activityId = Number(this.alarmmodal.activityId) || '';
      this.params.slotId = Number(this.alarmmodal.slotId) || '';
      this.alarmLoadingRouteData = true;
      this.$http.post('/rule/queryList', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.alarmLoadingRouteData = false;
          this.data = res.data.list;
          this.params.ruleType = 0;
          this.params.alertValue = '';
          this.totalList = res.data.total;
        } else {
          this.alarmLoadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    ruleCheck() {
      if (this.params.quota === 0) {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '请选择指标！',
          type: 'error'
        });
        return;
      }
      if (this.params.ruleType === 0) {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '请选择报警规则！',
          type: 'error'
        });
        return;
      }
      if (this.params.alertValue === '') {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '请输入阈值！',
          type: 'error'
        });
        return;
      }
      this.params.dimensionType = this.alarmmodal.dimensionType;
      this.params.appId = Number(this.alarmmodal.appId) || '';
      this.params.activityId = Number(this.alarmmodal.activityId) || '';
      this.params.slotId = Number(this.alarmmodal.slotId) || '';
      this.alarmLoadingRouteData = true;
      this.$http.post('/rule/preCheck', this.params).then((res) => {
        res = res.json();
        if (res.success) {
          this.alarmLoadingRouteData = false;
          this.ruleCheckModal(res.data);
        } else {
          this.alarmLoadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    // 合理性校验报警规则框
    ruleCheckModal(count) {
      this.currentView = '';
      this.alarmObj.show = false;
      this.$nextTick(() => {
        this.currentView = 'alarmTipModal';
        this.alarmObj.show = true;
        this.alarmObj.count = count;
        this.alarmObj.onOk = this.addRule;
      });
    },
    // 编辑报警规则框
    editClick(item) {
      this.currentView = '';
      this.alarmObj.show = false;
      this.$nextTick(() => {
        this.editRuleId = item.id;
        this.currentView = 'editModal';
        this.alarmObj.ruleType = item.ruleType;
        this.alarmObj.alertValue = item.alertValue;
        this.alarmObj.timeSlice = item.timeSlice;
        this.alarmObj.show = true;
        this.alarmObj.onOk = this.editRule;
      });
    },
    editRule() {
      this.$http.post('/rule/editRule', {
        id: this.editRuleId,
        alertValue: this.alarmObj.alertValue,
        ruleType: this.alarmObj.ruleType,
        timeSlice: this.alarmObj.timeSlice
      }).then((res) => {
        res = res.json();
        if (res.success) {
          this.currentView = '';
          this.alarmObj.alertValue = '';
          this.editRuleId = '';
          this.params.ruleType = 0;
          this.params.alertValue = '';
          this.getRule();
          MessageBox({
            title: res.desc,
            type: 'success'
          });
        } else {
          this.alarmLoadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    deleteClick(id) {
      this.currentView = 'delModal';
      this.alarmObj.onOk = this.delRule;
      this.alarmObj.show = true;
      this.delRuleId = id;
    },
    delRule() {
      this.$http.post('/rule/delete', {
        id: this.delRuleId
      }).then((res) => {
        res = res.json();
        if (res.success) {
          this.currentView = '';
          this.delRuleId = '';
          this.params.ruleType = 0;
          this.params.alertValue = '';
          this.getRule();
          MessageBox({
            title: res.desc,
            type: 'success'
          });
        } else {
          this.alarmLoadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.alarmLoadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    }
  }
};
</script>

<style lang="less">
.alarmmodal {
  .longTime {
    padding-top: 9px;
  }
  .modal-dialog {
    height: 558px !important;
  }
  .modal-title {
    margin-bottom: 16px;
  }
  .modal-dialog {
    height: 470px;
  }
  .modal-content {
    padding-left:10px;
    padding-right: 10px;
  }
  .select-group {
    width: 260px;
    margin-right: 30px;
  }
  .searchfilter {
    margin-right: 10px;
    &:first-child {
      margin-left: 80px;
    }
  }
}
.inline{
  display: inline-block;
  vertical-align: middle;
}
.inp-filter{
  .form-filter-group {
    margin-bottom: 18px;
    float: left;
    .filter-label-alarm{
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 80px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
    }
    .form-control-alarm {
      width: 260px;
      margin-right: 30px;
    }
    .datepicker-input {
      width: 160px !important;
    }
    .iconhandle {
      right: 26px !important;
    }
    &.form-filter-time-select {
      width: 986px;
    }
  }
  .select-group {
    .select-menu {
      max-height: 350px;
    }
  }
}
.add-rule {
  margin: 10px 20px;
  padding: 10px 20px;
  text-align: center;
  border: 1px dashed #d8d8d8;
  cursor: pointer;
}
.rule-list {
  padding: 0px 20px 10px 20px;
  text-align: left;
  .rule-item {
    span {
      padding-right: 20px;
    }
  }
  .row-noresult {
    padding: 10px 0 10px;
  }
}
.block-search {
  width: 873px;
  .d-button + .d-button {
    margin-left: 0px;
  }
}
.td-actions {
  position: relative;
}
</style>
