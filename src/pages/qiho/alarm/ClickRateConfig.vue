<template>
  <div class="click-rate-config">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label">广告ID：</p>
        <input type="text" class="form-control" v-model="advertId">
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterGoods" class="margin8 d-button--qiho wide-button">查询</d-button>
      </div>
    </div>
    <pagetitle title="点击率设置"></pagetitle>
    <div class="configTable">
      <validator name="validator">
        <div class="form-groups-chunk">
          <div class="form-group">
            <label class="control-label label-required">广告ID：</label>
            <input type="text" class="form-control" v-model="params.advertId"
                  maxlength="10" :disabled="disabled"
                  v-validate:advertid="fields.advertid"
                  :class="{'form-control-dirty': $validator.advertid && $validator.advertid.dirty}">
            <invalidtip :show="hasValidationError('advertid', 'validator', hasSubmited)">{{firstValidationMessage('advertid', 'validator')}}</invalidtip>
          </div>
          <div class="form-group">
            <label class="control-label label-required">异常值剔除阈值：</label>
            <input type="text" class="form-control" v-model="params.outlier"
                  maxlength="10" 
                  placeholder="至多保留4位小数"
                  v-validate:outlier="fields.outlier"
                  :class="{'form-control-dirty': $validator.outlier && $validator.outlier.dirty}">
            <invalidtip :show="hasValidationError('outlier', 'validator', hasSubmited)">{{firstValidationMessage('outlier', 'validator')}}</invalidtip>
          </div>
          <div class="form-group">
            <label class="control-label label-required">点击率判断阈值：</label>
            <input type="text" class="form-control" v-model="params.clickRate"
                  maxlength="10" 
                  placeholder="至多保留4位小数"
                  v-validate:clickrate="fields.clickrate"
                  :class="{'form-control-dirty': $validator.clickrate && $validator.clickrate.dirty}">
            <invalidtip :show="hasValidationError('clickrate', 'validator', hasSubmited)">{{firstValidationMessage('clickrate', 'validator')}}</invalidtip>
          </div>
          <div class="form-group">
            <label class="control-label label-required">差异率判断阈值：</label>
            <input type="text" class="form-control" v-model="params.diffRate"
                  maxlength="10" 
                  placeholder="至多保留4位小数"
                  v-validate:diffrate="fields.diffrate"
                  :class="{'form-control-dirty': $validator.diffrate && $validator.diffrate.dirty}">
            <invalidtip :show="hasValidationError('diffrate', 'validator', hasSubmited)">{{firstValidationMessage('diffrate', 'validator')}}</invalidtip>
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
        outlier: {
          required: {
            rule: true,
            message: '请输入异常值剔除阈值'
          }
        },
        clickrate: {
          required: {
            rule: true,
            message: '请输入点击率判断阈值'
          }
        },
        diffrate: {
          required: {
            rule: true,
            message: '请输入差异率判断阈值'
          }
        }
      };
      return {
        data: {},
        fields: _fields,
        disabled: false,
        params: {
          advertId: null,
          outlier: '',
          clickRate: '',
          diffRate: ''
        },
        advertId: null,
        query: ''
      };
    },
    route: {
      data: function(transition) {
        if (transition.to.params.advertId) {
          this.advertId = transition.to.params.advertId;
          this.getClickRate(this.advertId, transition);
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      }
    },
    watch: {
      '$route.params.advertId': function(val) {
        this.advertId = val || '';
        this.getClickRate(this.advertId);
      }
    },
    methods: {
      /**
       * 商品过滤
       */
      filterGoods: function() {
        this.getClickRate(this.advertId);
      },

      /**
       * 获取商品列表
       */
      getClickRate: function(advertId, transition) {
        this.$http.post('/alarm/config/getClickRate', {advertId: advertId}, {emulateJSON: true}).then((res) => {
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
            this.params.advertId = data.advertId;
            this.params.outlier = data.outlier;
            this.params.clickRate = data.clickRate;
            this.params.diffRate = data.diffRate;
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
        this.$http.post('/alarm/config/saveClickRate', this.params).then((res) => {
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
     .click-rate-config{
       .configTable{
         width: 350px;
         margin: 0 auto;
        .control-label{
          width: 136px;
        }
        .form-control{
          width: 85%;
          margin-left: 30px;
          &.invalid{
            margin-top: 0;
          }
        }
        .form-groups-chunk{
          border: 0;
        }
       }
      .form-group{
        max-width: none;
        &.mt20{
          text-align: center;
          border-top: 1px dashed #d8d8d8;
          padding-top: 20px;
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
