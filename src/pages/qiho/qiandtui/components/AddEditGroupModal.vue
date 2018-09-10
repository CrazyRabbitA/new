<template>
  <d-modal :title="title" :show.sync="show" width="500" class="ae-edit-modal">
    <template slot="modal-body">
      <div class="modal-body">
        <validator name="validator">
          <div class="form-group">
            <label class="control-label label-required">组长:</label>
            <dselect :options.sync="leaderOptions" :value.sync="params.leaderId" key="aeName" id-name="id" trigger="click"></dselect>
            <input type="hidden" class="form-control"  v-model="params.leaderId" v-validate:leaderid="fields.leaderid"
                :class="{'form-control-dirty': $validator.leaderid && $validator.leaderid.dirty}">
            <invalidtip :show="hasValidationError('leaderid', 'validator', hasSubmited)">{{firstValidationMessage('leaderid', 'validator')}}</invalidtip>
          </div>
          <div class="form-group">
            <label class="control-label label-required">组员: </label>
            <div class="form-filter-group" style="width: 345px;">
              <div id="choosetypes">
                <div class="info clearfix choosetypes" @click="choosetypeClick()">
                  <template v-for="item in memberOptions">
                    <span class="label-type" v-if="item.isSelect">{{item.aeName}}</span>
                  </template>
                </div>
                <div class="checktypelist" v-show="checktypeshow">
                  <ul>
                    <li v-for="item in memberOptions" @click="changeStatus(item)">
                      <dcheckbox :checked.sync="item.isSelect"></dcheckbox>
                      {{item.aeName}}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <input type="hidden" class="form-control"  v-model="memberIds" v-validate:memberids="fields.memberids"
                :class="{'form-control-dirty': $validator.memberids && $validator.memberids.dirty}">
            <invalidtip :show="hasValidationError('memberids', 'validator', hasSubmited)">{{firstValidationMessage('memberids', 'validator')}}</invalidtip>
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
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mixins: [validationMixins],
  data() {
    return {
      params: {
        leaderId: '',
        memberIds: ''
      },
      hasSubmited: false,
      fields: {
        leaderid: {
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
      leaderOptions: [],
      checktypeshow: false,
      memberIds: '',
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
    this.getAEList(1);
    this.getAEList(2);
  },
  computed: {
    memberIds: function() {
      let arr = [];
      this.memberOptions.forEach((item) => {
        if (item.isSelect) {
          arr.push(item.id);
        }
      });
      return arr.join(',');
    }
  },
  methods: {
     // 流水类型 点击
    choosetypeClick: function() {
      this.checktypeshow = !this.checktypeshow;
    },
    changeStatus(item) {
      item.isSelect = !item.isSelect;
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
          list.unshift({
            id: '',
            aeName: '请选择'
          });
          if (role === 1) {
            this.$set('memberOptions', list);
            if (this.item) {
              let members = this.item.members || [];
              members = members.map((item) => {
                return item.id;
              });
              this.memberOptions.forEach((d) => {
                if (members.indexOf(d.id) !== -1) {
                  d.isSelect = true;
                }
              });
            }
          } else {
            this.params.leaderId = this.item && this.item.leaderId || '';
            this.$set('leaderOptions', list);
          }
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
    onClose() {
      this.show = false;
    },
    onSave: function() {
      if (this.$validator.invalid) {
        this.$setValidationErrors(this.$validator.errors);
        this.hasSubmited = true;
        return;
      }
      this.$http.post('/ae/group/save', {
        leaderId: this.params.leaderId,
        memberIds: this.memberIds
      }).then((res) => {
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
    .select-menu{
      position: relative;
      top: 0;
      max-height: 134px;
    }
    .invalid{
      margin: 0 auto;
      color: #333;
    }
    .choosetypes {
      min-height: 32px;
      line-height: 32px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 2px;
      overflow: hidden;
    }
    .checktypelist {
      width: 100%;
      height: 200px;
      background-color: #fff;
      z-index: 10;
      box-shadow: 2px 2px 8px 1px #ccc;
      padding: 10px;
      overflow: hidden;
      ul {
        height: 200px;
        overflow-y: scroll;
        li {
          height: 36px;
          line-height: 36px;
          position: relative;
          padding-left: 24px;
          .checkbox-control {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
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