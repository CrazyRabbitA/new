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
    <pagetitle title="消耗设置"></pagetitle>
    <div class="configTable">
      <validator name="validator">
        <div class="form-groups-chunk">
          <div class="form-group long">
            <label class="control-label">广告ID：</label>
            <input type="text" class="form-control" v-model="params.advertId"
                  maxlength="10" :disabled="disabled"
                  v-validate:advertid="fields.advertid"
                  :class="{'form-control-dirty': $validator.advertid && $validator.advertid.dirty}">
            <invalidtip :show="hasValidationError('advertid', 'validator', hasSubmited)">{{firstValidationMessage('advertid', 'validator')}}</invalidtip>
          </div>
          <div class="line"></div>
          <!-- <div class="bigTitle">工作日：</div> -->
          <div class="form-group long">
            <label class="control-label"><div class="sec-title">工作日:</div>剔除异常值阈值：</label>
           <input type="text" class="form-control" v-model="params.workdayOutlier"
                  maxlength="10"
                  v-validate:workdayoutlier="fields.workdayoutlier"
                  :class="{'form-control-dirty': $validator.workdayoutlier && $validator.workdayoutlier.dirty}">
            <invalidtip :show="hasValidationError('workdayoutlier', 'validator', hasSubmited)">{{firstValidationMessage('workdayoutlier', 'validator')}}</invalidtip>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="默认2.00，参考范围1.00-3.00<br>说明：|Yi-Y均值|>阈值*Y标准差，剔除。阈值越大，剔除的异常值越少。">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="form-group long">
            <label class="control-label">报警阈值：</label>
            <input type="text" class="form-control" v-model="params.workdayAlert"
                  maxlength="10"
                  v-validate:workdayalert="fields.workdayalert"
                  :class="{'form-control-dirty': $validator.workdayalert && $validator.workdayalert.dirty}">
            <invalidtip :show="hasValidationError('workdayalert', 'validator', hasSubmited)">{{firstValidationMessage('workdayalert', 'validator')}}</invalidtip>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="默认2.00，参考范围1.00-3.00<br>说明：|Y-Y均值|>阈值*Y标准差，报警。阈值越大，报警几率越小。">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="line"></div>
          <!-- <div class="bigTitle">双休日：</div> -->
          <div class="form-group long">
            <label class="control-label"><div class="sec-title">双休日:</div>剔除异常值阈值：</label>
            <input type="text" class="form-control" v-model="params.playdayOutlier"
                  maxlength="10"
                  v-validate:playdayoutlier="fields.playdayoutlier"
                  :class="{'form-control-dirty': $validator.playdayoutlier && $validator.playdayoutlier.dirty}">
            <invalidtip :show="hasValidationError('playdayoutlier', 'validator', hasSubmited)">{{firstValidationMessage('playdayoutlier', 'validator')}}</invalidtip>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="默认2.00，参考范围1.00-3.00<br>说明：|Yi-Y均值|>阈值*Y标准差，剔除。阈值越大，剔除的异常值越少。">
                <d-button type="text" class="instruction">?</d-button>
              </d-tooltip>
            </div>
          </div>
          <div class="form-group long">
            <label class="control-label">报警阈值：</label>
            <input type="text" class="form-control" v-model="params.playdayAlert"
                  maxlength="10"
                  v-validate:playdayalert="fields.playdayalert"
                  :class="{'form-control-dirty': $validator.playdayalert && $validator.playdayalert.dirty}">
            <invalidtip :show="hasValidationError('playdayalert', 'validator', hasSubmited)">{{firstValidationMessage('playdayalert', 'validator')}}</invalidtip>
            <div class="tooltip-container">
              <d-tooltip placement="right" content="默认2.00，参考范围1.00-3.00<br>说明：|Y-Y均值|>阈值*Y标准差，报警。阈值越大，报警几率越小。">
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
        workdayoutlier: {
          required: {
            rule: true,
            message: '请输入工作日 剔除异常值阈值'
          }
        },
        workdayalert: {
          required: {
            rule: true,
            message: '请输入工作日 报警阈值'
          }
        },
        playdayoutlier: {
          required: {
            rule: true,
            message: '请输入双休日 剔除异常值阈值'
          }
        },
        playdayalert: {
          required: {
            rule: true,
            message: '请输入双休日 报警阈值'
          }
        }
      };
      return {
        data: {},
        fields: _fields,
        disabled: false,
        advertId: null,
        params: {
          advertId: null,
          workdayOutlier: '2.00',
          workdayAlert: '2.00',
          playdayOutlier: '2.00',
          playdayAlert: '2.00'
        },
        query: ''
      };
    },
    route: {
      data: function(transition) {
        if (transition.to.params.advertId) {
          this.advertId = transition.to.params.advertId;
          this.getConsume(this.advertId, transition);
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      }
    },
    watch: {
      '$route.params.advertId': function(val) {
        this.advertId = val || '';
        this.getConsume(this.advertId);
      }
    },
    methods: {
      /**
       * 商品过滤
       */
      filterGoods: function() {
        this.getConsume(this.advertId);
      },

      /**
       * 获取商品列表
       */
      getConsume: function(advertId, transition) {
        this.$http.post('/alarm/config/getConsume', {advertId: advertId}, {emulateJSON: true}).then((res) => {
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
              // 工作日 剔除异常值阈值
              this.params.workdayOutlier = data.workdayOutlier;
              // 工作日 报警阈值
              this.params.workdayAlert = data.workdayAlert;
              // 双休日 剔除异常值阈值
              this.params.playdayOutlier = data.playdayOutlier;
              // 双休日 报警阈值
              this.params.playdayAlert = data.playdayAlert;
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
        this.$http.post('/alarm/config/saveConsume', this.params).then((res) => {
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
            width: 106px;
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
          margin-left: 35px;
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
            width: 307px;
            padding-left: 51px;
          }
          .form-control{
            margin-left: 224px;
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
