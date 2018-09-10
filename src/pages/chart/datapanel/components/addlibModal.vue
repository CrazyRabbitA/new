<template>
  <d-modal :title="title" :show.sync="show" width="400" class="addlib-modal" :on-close="onClose">
    <div class="modal-body quota-modal-body" slot="modal-body">
      <validator name="validator">
        <div v-if="obj.type==='top1'">
          <div class="form-group">
            <label class="control-label label-required">一级目录：</label>
            <input type="text" class="form-control" :class="{'form-control-dirty': $validator.categoryname && $validator.categoryname.dirty}" v-model="obj.categoryName" :value="obj.categoryName" v-validate:categoryname="fields.categoryname" placeholder="请输入目录名">
            <invalidtip :show="hasValidationError('categoryname', 'validator', hasSubmited)">{{firstValidationMessage('categoryname', 'validator')}}</invalidtip>
          </div>
        </div>  
        <div v-if="obj.type==='top2'">
           <div class="top">
            一级目录：{{obj.name}}
          </div>  
          <div class="form-group">
            <label class="control-label label-required">子目录：</label>
            <input type="text" class="form-control" :class="{'form-control-dirty': $validator.categoryname && $validator.categoryname.dirty}" v-model="obj.categoryName" :value="obj.categoryName" v-validate:categoryname="fields.categoryname" placeholder="请输入目录名">
            <invalidtip :show="hasValidationError('categoryname', 'validator', hasSubmited)">{{firstValidationMessage('categoryname', 'validator')}}</invalidtip>
          </div>
        </div>
        <div v-if="obj.type==='edit'">
          <div class="form-group">
            <label class="control-label label-required">目录名：</label>
            <input type="text" class="form-control" :class="{'form-control-dirty': $validator.categoryname && $validator.categoryname.dirty}" v-model="obj.categoryName" :value="obj.categoryName" v-validate:categoryname="fields.categoryname" placeholder="请输入目录名">
            <invalidtip :show="hasValidationError('categoryname', 'validator', hasSubmited)">{{firstValidationMessage('categoryname', 'validator')}}</invalidtip>
          </div>
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
    onOk: {
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
      fields: {
        categoryname: {
          required: {
            rule: true,
            message: '目录名不能为空'
          }
        }
      }
    };
  },
  methods: {
    onClose() {
      this.obj.show = false;
    },
    onSave() {
      this.$loadingRouteData = false;
      if (this.$validator.invalid) {
        this.hasSubmited = true;
        this.$setValidationErrors(this.$validator.errors);
        return;
      }
      let desc = '添加成功';
      let url = '/chart/category';
      let params = this.obj;
      if (this.obj.type === 'edit') {
        url = '/chart/category/edit';
        desc = '编辑成功';
        params = {
          id: this.obj.parentId,
          categoryName: this.obj.categoryName
        };
      }
      this.$http.post(url, params
      ).then(
        res => {
          res = res.json();
          if (res.success) {
            this.$loadingRouteData = false;
            MessageBox({
              title: desc,
              type: 'success'
            });
            this.onOk();
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
.form-group {
  .control-label {
    width: 100px;
  }
  input[type="text"] {
    width: 200px;
  }
  .invalid {
    margin: 0px;
  }
}
.top {
  font-size: 14px;
  font-weight: bold;
  color: #444;
  line-height: 34px;
  padding-left: 24px;
}
</style>