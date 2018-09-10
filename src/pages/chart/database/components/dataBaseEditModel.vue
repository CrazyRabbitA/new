<template>
  <d-modal :title="title" :show.sync="show" width="600" class="domainmodal" :on-close="onClose">
    <div class="modal-body quota-modal-body" slot="modal-body">
      <validator name="validator">
        <div class="form-group">
          <label class="control-label label-required">数据源：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.databasename && $validator.databasename.dirty}" v-model="obj.databaseName" :value="obj.databaseName" v-validate:databaseName="fields.databasename" placeholder="请输入数据源">
          <invalidtip :show="hasValidationError('databasename', 'validator', hasSubmited)">{{firstValidationMessage('databasename', 'validator')}}</invalidtip>
        </div>
        <div class="form-group">
          <label class="control-label label-required">数据源别名：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.databaseAlias && $validator.databaseAlias.dirty}" v-model="obj.databaseAlias" :value="obj.databaseAlias" v-validate:databaseAlias="fields.databasealias" placeholder="请输入数据源别名">
          <invalidtip :show="hasValidationError('databasealias', 'validator', hasSubmited)">{{firstValidationMessage('databasealias', 'validator')}}</invalidtip>
        </div>
        <div class="form-group">
          <label class="control-label label-required">类型：</label>
          <d-select :options.sync="driverTypeArr" :value.sync="obj.driverType"></d-select>
        </div>

        <div class="form-group">
          <label class="control-label label-required">url：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.url && $validator.url.dirty}" v-model="obj.url" :value="obj.url" v-validate:url="fields.url" placeholder="请输入url">
          <invalidtip :show="hasValidationError('url', 'validator', hasSubmited)">{{firstValidationMessage('url', 'validator')}}</invalidtip>
        </div>
        <div class="form-group">
          <label class="control-label label-required">用户名：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.databaseUsername && $validator.databaseUsername.dirty}" v-model="obj.databaseUsername" :value="obj.databaseUsername" v-validate:databaseUsername="fields.databaseusername" placeholder="请输入用户名">
          <invalidtip :show="hasValidationError('databaseusername', 'validator', hasSubmited)">{{firstValidationMessage('databaseusername', 'validator')}}</invalidtip>
        </div>
        <div class="form-group">
          <label class="control-label label-required">密码：</label>
          <input type="text" class="form-control" :class="{'form-control-dirty': $validator.databasePassword && $validator.databasePassword.dirty}" v-model="obj.databasePassword" :value="obj.databasePassword" v-validate:databasePassword="fields.databasepassword" placeholder="请输入密码">
          <invalidtip :show="hasValidationError('databasepassword', 'validator', hasSubmited)">{{firstValidationMessage('databasepassword', 'validator')}}</invalidtip>
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
const driverTypeArr = [
  {
    label: 'MySQL',
    id: 1
  },
  {
    label: 'KYLIN',
    id: 2
  }
];
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
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      driverTypeArr: driverTypeArr,
      fields: {
        databasename: {
          required: {
            rule: true,
            message: '数据源不能为空'
          }
        },
        databasealias: {
          required: {
            rule: true,
            message: '数据源别名不能为空'
          }
        },
        url: {
          required: {
            rule: true,
            message: 'url地址不能为空'
          }
        },
        databaseusername: {
          required: {
            rule: true,
            message: '用户名不能为空'
          }
        },
        databasepassword: {
          required: {
            rule: true,
            message: '密码不能为空'
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
      let url = '/chart/database/add';
      if (this.obj.id !== void (0)) {
        url = '/chart/database/edit';
        desc = '编辑成功';
      }
      this.$http.post(url, this.obj
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
  .label-required {
    width: 110px;
  }
  input[type="text"] {
    width: 300px;
  }
  .invalid {
    margin: 0px;
  }
}
</style>
