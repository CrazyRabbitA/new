<template>
  <d-modal :title="title" :show.sync="show" width="500" class="ae-edit-modal">
    <template slot="modal-body">
      <div class="modal-body">
        <validator name="validator">
          <div class="form-group">
            <label class="control-label label-required">广告ID:</label>
            <input type="text" class="form-control"  v-model="params.adId" v-show="!item">
            <input type="text" class="form-control"  v-model="params.adId" v-show="item" readonly>
            <input type="hidden" class="form-control"  v-model="params.adId" v-validate:adid="fields.adid"
                :class="{'form-control-dirty': $validator.adid && $validator.adid.dirty}" v-show="item" readonly>
            <invalidtip :show="hasValidationError('adid', 'validator', hasSubmited)">{{firstValidationMessage('adid', 'validator')}}</invalidtip>
          </div>
          <div class="form-group">
            <label class="control-label label-required">AE名称:</label>
            <dselect :options.sync="memberOptions" :value.sync="params.aeId" key="aeName" id-name="aeId"  trigger="click"></dselect>
            <input type="hidden" class="form-control"  v-model="params.aeId" v-validate:aeid="fields.aeid"
                :class="{'form-control-dirty': $validator.aeid && $validator.aeid.dirty}">
            <invalidtip :show="hasValidationError('aeid', 'validator', hasSubmited)">{{firstValidationMessage('aeid', 'validator')}}</invalidtip>
          </div>
        </validator>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer cf">
        <d-button type="primary" @click="onSave">确定</d-button>
        <d-button type="default" @click="show = false">取消</d-button>
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
    },
    item: {
      type: Object,
      default: {}
    }
  },
  mixins: [validationMixins],
  data() {
    return {
      checktypeshow: false,
      params: {
        adId: '',
        aeId: ''
      },
      hasSubmited: false,
      fields: {
        adid: {
          required: {
            rule: true,
            message: '此项不能为空'
          }
        },
        aeid: {
          required: {
            rule: true,
            message: '此项不能为空'
          }
        }
      },
      memberOptions: [],
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
    this.params.aeId = this.item && this.item.aeId || '';
    this.params.adId = this.item && this.item.adId || '';
    this.getAEList();
  },
  methods: {
    onClose() {
      this.show = false;
    },
    getAEList(role) {
      // role  1=组员、2=组长 ,
      this.$http.post('/ae/findByParam', {
        aeRole: role,
        pageNum: 1,
        pageSize: 10000
      }).then((res) => {
        res = res.json();
        if (res.success) {
          let list = res.data.list || [];
          list.length && list.forEach((item) => {
            item.isSelect = false;
          });
          this.$set('memberOptions', list);
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
    onSave: function() {
      if (this.$validator.invalid) {
        this.$setValidationErrors(this.$validator.errors);
        this.hasSubmited = true;
        return;
      }
      this.$http.post('/ae/ad/save', this.params).then((res) => {
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
    .modal-dialog{
      min-height: 400px;
    }
    .select-menu{
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
    }
    .choosetypes {
      min-height: 32px;
      line-height: 32px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 2px;
      overflow: hidden;
    }
    .label-type {
      display: inline-block;
      line-height: 25px;
      background-color: #ccc;
      border-radius: 5px;
      margin: 4px 5px 0;
      padding: 0 5px;
      position: relative;
      .remove-icon {
        position: absolute;
        top: -12px;
        right: -8px;
      }
    }
  }
</style>