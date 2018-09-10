<template>
  <d-modal :title="title" :show.sync="show" width="600" class="domainmodal" :on-close="onClose">
    <div class="modal-body quota-modal-body" slot="modal-body">
      <validator name="validator">
        <div class="form-group">
          <label class="control-label label-required">域名：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.domain && $validator.domain.dirty}" v-model="domainEditObj.domain" :value="domainEditObj.domain" v-validate:domain="fields.domain" placeholder="请输入域名">
          <invalidtip :show="hasValidationError('domain', 'validator', hasSubmited)">{{firstValidationMessage('domain', 'validator')}}</invalidtip>
        </div>
        <div class="form-group">
          <label class="control-label label-required">IP：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.ip && $validator.ip.dirty}" v-model="domainEditObj.ip" :value="domainEditObj.ip" v-validate:ip="fields.ip" placeholder="多个IP之间用英文逗号隔开">
          <invalidtip :show="hasValidationError('ip', 'validator', hasSubmited)">{{firstValidationMessage('ip', 'validator')}}</invalidtip>
        </div>
        <div class="form-group form-group-radio">
          <label class="control-label label-required">状态：</label>
          <span><input type="radio" name="status" v-model="domainEditObj.domainStatus" value="0">已注册</span>
          <span><input type="radio" name="status" v-model="domainEditObj.domainStatus" value="1">已备案</span>
          <span><input type="radio" name="status" v-model="domainEditObj.domainStatus" value="2">已使用</span>
          <span><input type="radio" name="status" v-model="domainEditObj.domainStatus" value="3">已废弃</span>
        </div>
        <div class="form-group form-group-radio">
          <label class="control-label label-required">证书：</label>
          <span><input type="radio" name="cert" v-model="domainEditObj.cert" value="0">有</span>
          <span><input type="radio" name="cert" v-model="domainEditObj.cert" value="1">无</span>
        </div>
        <div class="form-group form-group-radio">
          <label class="control-label label-required">备案：</label>
          <span><input type="radio" name="record" v-model="domainEditObj.record" value="0">企业</span>
          <span><input type="radio" name="record" v-model="domainEditObj.record" value="1">个人</span>
        </div>
        <div class="form-group">
          <label class="control-label">屏蔽情况：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.situation && $validator.situation.dirty}" v-model="domainEditObj.situation" :value="domainEditObj.situation" v-validate:situation="fields.situation" placeholder="请输入屏蔽情况">
          <invalidtip :show="hasValidationError('situation', 'validator')">{{firstValidationMessage('situation', 'validator')}}</invalidtip>
        </div>
        <div class="form-group">
          <label class="control-label">备注：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.remark && $validator.remark.dirty}" v-model="domainEditObj.remark" :value="domainEditObj.remark" v-validate:status="fields.remark" placeholder="请输入备注">
          <invalidtip :show="hasValidationError('remark', 'validator')">{{firstValidationMessage('remark', 'validator')}}</invalidtip>
        </div>
      </validator>   
    </div>
    <div class="modal-footer cf" slot="modal-footer">
      <d-button type="primary" :disabled="btnvalid" @click="onSave">确定</d-button>
      <d-button type="primary" :disabled="btnvalid" @click="onClose">取消</d-button>
    </div>
  </d-modal>
</template>
<script>
import validationMixins from 'components/utils/validationMixins';
import MessageBox from 'components/basic/MessageBox';
export default {
  mixins: [validationMixins],
  props: {
    show: {
      required: true,
      default: false
    },
    onClose: {
      type: Function,
      default: null
    },
    domainEditObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      fields: {
        domain: {
          required: {
            rule: true,
            message: '域名不能为空'
          }
        },
        ip: {
          required: {
            rule: true,
            message: 'IP地址不能为空'
          },
          pattern: {
            rule: '/[0-9.,]$/',
            message: '请填写正确的IP'
          }
        },
        situation: {
          maxlength: {
            rule: 50,
            message: '最多支持50个字符'
          }
        },
        remark: {
          maxlength: {
            rule: 50,
            message: '最多支持50个字符'
          }
        }
      }
    };
  },
  methods: {
    onSave() {
      this.$loadingRouteData = false;
      if (this.$validator.invalid) {
        this.hasSubmited = true;
        this.$setValidationErrors(this.$validator.errors);
        return;
      }
      let desc = '添加成功';
      let url = '/domain/add';
      if (this.domainEditObj.id !== void (0)) {
        url = '/domain/edit';
        desc = '编辑成功';
      }
      this.$http.post(url, this.domainEditObj
      ).then(
        res => {
          res = res.json();
          if (res.success) {
            // 获取页码
            this.$loadingRouteData = false;
            MessageBox({
              title: desc,
              type: 'success'
            });
            this.onClose();
          } else {
            this.$loadingRouteData = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          this.loadshow = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.form-group-radio {
  input[type="radio"] {
    margin: 0 6px;
  }
  padding-top: 8px;
}
.form-group {
  input[type="text"] {
    width: 300px;
  }
  .invalid {
    margin: 0px;
  }
}
</style>