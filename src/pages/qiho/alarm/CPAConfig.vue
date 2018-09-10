<template>
  <div class="cpa-config">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label">广告ID：</p>
        <input type="text" class="form-control" v-model="advertId">
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterGoods" class="margin8 d-button--qiho wide-button">查询</d-button>
      </div>
    </div>
    <pagetitle title="CPA设置"></pagetitle>
    <div class="configTable">
      <validator name="validator">
        <div class="form-groups-chunk">
          <div class="form-group">
            <label class="control-label">广告ID：</label>
            <input type="text" class="form-control" v-model="params.advertId"
                  maxlength="10" :disabled="disabled"
                  v-validate:advertid="fields.advertid"
                  :class="{'form-control-dirty': $validator.advertid && $validator.advertid.dirty}">
            <invalidtip :show="hasValidationError('advertid', 'validator', hasSubmited)">{{firstValidationMessage('advertid', 'validator')}}</invalidtip>
          </div>
          <div class="form-group short">
            <label class="control-label">目标CPA：</label>
            <input type="text" class="form-control" v-model="cpaCur"
                  maxlength="10"
                  v-validate:cpacur="fields.cpacur"
                  :class="{'form-control-dirty': $validator.cpacur && $validator.cpacur.dirty}">
            <invalidtip :show="hasValidationError('cpacur', 'validator', hasSubmited)">{{firstValidationMessage('cpacur', 'validator')}}</invalidtip>
            <span class="fr_span">元</span>
          </div>
          <div class="line"></div>
          <div class="bigTitle">熔断：</div>
          <div class="form-group">
            <label class="control-label">CPA上限：</label>
            <input type="text" class="form-control" v-model="params.cpaUpper"
                  maxlength="10"
                  v-validate:cpaupper="fields.cpaupper"
                  :class="{'form-control-dirty': $validator.cpaupper && $validator.cpaupper.dirty}">
            <invalidtip :show="hasValidationError('cpaupper', 'validator', hasSubmited)">{{firstValidationMessage('cpaupper', 'validator')}}</invalidtip>
            <span class="fr_span">%</span>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="熔断CPA=目标CPA*(1+CPA上限)">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="line"></div>
          <div class="bigTitle">放量：</div>
          <div class="form-group long">
            <label class="control-label"><div class="sec-title">基本指标</div>CPA下限：</label>
            <input type="text" class="form-control" v-model="params.cpaLower"
                  maxlength="10"
                  v-validate:cpalower="fields.cpalower"
                  :class="{'form-control-dirty': $validator.cpalower && $validator.cpalower.dirty}">
            <invalidtip :show="hasValidationError('cpalower', 'validator', hasSubmited)">{{firstValidationMessage('cpalower', 'validator')}}</invalidtip>
            <span class="fr_span">%</span>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="放量CPA=目标CPA*(1-CPA下限)">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="form-group long">
            <label class="control-label"><div class="sec-title">CPA稳定性</div>稳定CPA：</label>
            <input type="text" class="form-control" v-model="params.stableConsume"
                  maxlength="10"
                  v-validate:stableconsume="fields.stableconsume"
                  :class="{'form-control-dirty': $validator.stableconsume && $validator.stableconsume.dirty}">
            <invalidtip :show="hasValidationError('stableconsume', 'validator', hasSubmited)">{{firstValidationMessage('stableconsume', 'validator')}}</invalidtip>
            <span class="fr_span">小时</span>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="维持在放量CPA标准的小时数">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="form-group long">
            <label class="control-label"><div class="sec-title">消耗速度</div>预期投放时长：</label>
            <input type="text" class="form-control" v-model="params.investPreset"
                  maxlength="10"
                  v-validate:investpreset="fields.investpreset"
                  :class="{'form-control-dirty': $validator.investpreset && $validator.investpreset.dirty}">
            <invalidtip :show="hasValidationError('investpreset', 'validator', hasSubmited)">{{firstValidationMessage('investpreset', 'validator')}}</invalidtip>
            <span class="fr_span">小时</span>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="前一天预期消耗完预算的小时数">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="form-group long act">
            <label class="control-label">实际投放时长：</label>
            <span class="fr_con">{{ params.investActual }}</span>
            <span class="fr_span">小时</span>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="前一天实际消耗完预算的小时数">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="form-group long">
            <label class="control-label">百分比：</label>
            <input type="text" class="form-control" v-model="params.investPercent"
                  maxlength="10"
                  v-validate:investpercent="fields.investpercent"
                  :class="{'form-control-dirty': $validator.investpercent && $validator.investpercent.dirty}">
            <invalidtip :show="hasValidationError('investpercent', 'validator', hasSubmited)">{{firstValidationMessage('investpercent', 'validator')}}</invalidtip>
            <span class="fr_span">%</span>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="实际投放时长/预期投放时长<百分比时，报警">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
        </div>
      </validator>
    </div>
     <div class="form-group mt20">
      <div>
        <d-button type="primary" class="d-button--qiho" size="large" @click="onSave">提交</d-button>
      </div>
    </div>
  </div>
</template>
<script>
  import validationMixins from 'components/utils/validationMixins';
  import MessageBox from 'components/basic/MessageBox';

  export default {
    mixins: [validationMixins],
    data() {
      let _fields = {
        advertid: {
          required: {
            rule: true,
            message: '请输入广告ID'
          }
        },
        cpacur: {
          required: {
            rule: true,
            message: '请输入目标CPA'
          }
        },
        cpaupper: {
          required: {
            rule: true,
            message: '请输入CPA上限'
          }
        },
        cpalower: {
          required: {
            rule: true,
            message: '请输入CPA下限'
          }
        },
        stableconsume: {
          required: {
            rule: true,
            message: '请输入稳定消耗'
          }
        },
        investpreset: {
          required: {
            rule: true,
            message: '请输入预期投放时长'
          }
        },
        investpercent: {
          required: {
            rule: true,
            message: '请输入百分比'
          }
        }
      };
      return {
        data: {},
        fields: _fields,
        disabled: false,
        cpaCur: '',
        params: {
          advertId: null,
          cpaCur: '',
          cpaUpper: '',
          cpaLower: '',
          stableConsume: '',
          investPreset: '',
          investActual: 0,
          investPercent: ''
        },
        advertId: null,
        query: ''
      };
    },
    route: {
      data: function(transition) {
        if (transition.to.params.advertId) {
          this.advertId = transition.to.params.advertId;
          this.getCpa(this.advertId, transition);
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      }
    },
    watch: {
      '$route.params.advertId': function(val) {
        this.advertId = val || '';
        this.getCpa(this.advertId);
      }
    },
    methods: {
      /**
       * 商品过滤
       */
      filterGoods: function() {
        this.getCpa(this.advertId);
      },

      /**
       * 获取商品列表
       */
      getCpa: function(advertId, transition) {
        this.$http.post('/alarm/config/getCpa', {advertId: advertId}, {emulateJSON: true}).then((res) => {
          res = res.json();
          if (res.success) {
            let data = res.data;
            if (transition) {
              transition.next({
                'data': data
              });
            } else {
              this.$set('data', data);
            }
            if (data) {
              // 广告id
              this.params.advertId = data.advertId;
              // 目标cpa
              this.cpaCur = data.cpaCur / 100;
              // cpa上限
              this.params.cpaUpper = data.cpaUpper;
              // cpa下限
              this.params.cpaLower = data.cpaLower;
              // 稳定消耗
              this.params.stableConsume = data.stableConsume;
              // 预期投放时长
              this.params.investPreset = data.investPreset;
              // 实际投放时长
              this.params.investActual = data.investActual;
              // 百分比
              this.params.investPercent = data.investPercent;
            }
          } else {
            transition && transition.next();
            this.data = null;
          }
        }, (res) => {
          // error callback
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
        * 保存
      */
      onSave: function() {
        if (this.$validator.invalid) {
          this.$setValidationErrors(this.$validator.errors);
          this.hasSubmited = true;
          return;
        }
        this.params.cpaCur = parseInt((parseFloat(this.cpaCur) * 100).toFixed(0));
        this.$http.post('/alarm/config/saveCpa', this.params).then((res) => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '保存成功！',
              type: 'success'
            });
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, () => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      // 支持中文，数字，大小写字母
      isValid: function(str) {
        var g = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        return g.test(str);
      }
    }
  };
</script>

<style lang="less">
  .datacenter-app{
     .cpa-config{
        .configTable{
          .line{
            height: 10px;
            background: #fafafa;
          }
          .bigTitle{
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .control-label{
            width: 136px;
          }
          .form-control{
            width: 72px;
            margin-left: 30px;
            &.invalid{
              margin-top: 0;
            }
          }
          .form-groups-chunk{
            border: 0;
            max-width: none;
          }
          .sec-title{
            float: left;
            font-size: 16px;
          }
          p.invalid{
            margin-left: 28px;
          }
        }
      .form-group{
        max-width: none;
        position: relative;
        &.mt20{
          text-align: center;
          border-top: 1px dashed #d8d8d8;
          padding-top: 20px;
        }
        .fr_span{
          position: absolute;
          left: 228px;
          top: 8px;
        }
        .tooltip-container{
          float: left;
          margin-left: 50px;
          .d-button.instruction{
            margin-top: 8px;
          }
          .tooltip-inner{
            font-size: 14px;
            padding: 10px;
          }
        }
        input.form-control{
          float: left;
        }
        &.long{
          .control-label{
            width: 314px;
            padding-left: 51px;
          }
          .form-control{
            margin-left: 203px;
          }
          .fr_span{
            left: 393px;
          }
        }
        &.short{
          p.invalid{
            margin-left: 50px;
          }
        }
        &.act{
          height: 34px;
          line-height: 34px;
          .fr_con{
            display: block;
            width: 72px;
            height: 34px;
            padding: 0 10px;
            position: absolute;
            left: 309px;
            text-align: center;
          }
          .fr_span{
            top: 0;
          }
          .tooltip-container{
            margin-left: 324px;
          }
        }
        p.invalid{
          display: inline-block;
          margin-left: 14px;
        }
      }
      .bottomline{
        .form-filter-group{
          .filter-label{
            width: 60px;
          }
          .form-control{
            float: none;
            width: 280px;
            margin: 0;
          }
        }
        .margin8{
          margin-left: 8px;
        }
      }
    }
    .tuiafilter{
      padding: 20px 0;
    }
    .tr-items td {
      padding: 15px 10px 15px 0;
      vertical-align: middle;
    }
    .listTable {
      overflow: hidden;
      .tabCont {
        overflow-x: auto;
        white-space: nowrap;
      }
      .table-goods {
        margin-top: 5px;
        .tr-header th {
          padding-right: 20px;
        }
      }
    }
    th {
      overflow: visible;
      .ivu-table-cell {
        white-space: nowrap;
      }
    }
  }
</style>
