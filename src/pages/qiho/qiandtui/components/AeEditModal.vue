<template>
  <d-modal :title="title" :show.sync="show" width="500" class="ae-edit-modal">
    <template slot="modal-body">
      <div class="modal-body">
        <validator name="validator">
          <div class="form-group">
            <label class="control-label label-required">AE名称:</label>
            <input type="text" class="form-control"  maxlength="10" v-model="params.aeName" v-validate:aename="fields.aename"
              :class="{'form-control-dirty': $validator.aename && $validator.aename.dirty}">
            <invalidtip :show="hasValidationError('aename', 'validator', hasSubmited)">{{firstValidationMessage('aename', 'validator')}}</invalidtip>
          </div>
          <div class="form-group">
            <label class="control-label label-required">角色分配:</label>
            <dselect :options.sync="typeOptions" :value.sync="params.aeRole"></dselect>
            <input type="hidden" class="form-control"  v-model="params.aeRole" v-validate:aerole="fields.aerole"
                :class="{'form-control-dirty': $validator.aerole && $validator.aerole.dirty}">
            <invalidtip :show="hasValidationError('aerole', 'validator', hasSubmited)">{{firstValidationMessage('aerole', 'validator')}}</invalidtip>
          </div>
        </validator>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer cf">
        <d-button type="primary" @click="onSave">确定</d-button>
        <d-button type="default" @click="onClose">取消</d-button>
      </div>
    </template>
  </d-modal>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
import validationMixins from 'components/utils/validationMixins';

export default {
  props: {
    title: {
      required: true,
      default: '',
      type: String
    },
    show: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  mixins: [validationMixins],
  data() {
    return {
      params: {
        aeName: '',
        aeRole: ''
      },
      hasSubmited: false,
      fields: {
        aename: {
          required: {
            rule: true,
            message: '此项不能为空'
          }
        },
        aerole: {
          required: {
            rule: true,
            message: '此项不能为空'
          }
        }
      },
      typeOptions: [
        {
          id: 1,
          label: '组员'
        },
        {
          id: 2,
          label: '组长'
        }
      ]
    };
  },
  ready() {
  },
  methods: {
    onClose() {
      this.show = false;
    },
    onSave: function() {
      if (this.$validator.invalid) {
        this.$setValidationErrors(this.$validator.errors);
        this.hasSubmited = true;
        return;
      }
      this.$http.post('/ae/save', this.params).then((res) => {
        res = res.json();
        this.show = false;
        if (res.success) {
          MessageBox({
            title: '操作成功！',
            type: 'success'
          });
          this.$dispatch('pageRefresh');
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, () => {
        this.show = false;
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
  .ae-edit-modal{
    .invalid{
      margin: 0 auto;
      color: #333;
    }
  }
</style>