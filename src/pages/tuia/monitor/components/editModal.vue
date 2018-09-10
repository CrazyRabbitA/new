<template>
  <d-modal title="修改报警规则" type="delete" width="1046" :show.sync="show">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="cf">
          <div class="form-filter-group cf filter-label-alarm-warp">
            <p class="filter-label fl filter-label-alarm">报警规则：</p>
            <d-select :options.sync="obj.ruleTypeArr" :value.sync="obj.ruleType"></d-select>
          </div>
          <div class="form-filter-group cf form-filter-time-select">
            <p class="filter-label fl filter-label-alarm">生效时段：</p>
            <div class="fl">
              <time-range :select-node.sync="obj.timeSlice"></time-range>
            </div>
          </div>
          <div class="form-filter-group cf">
            <p class="filter-label fl filter-label-alarm">阈值：</p>
            <input type="text" class="form-control fl filter-alertvalue" placeholder="请输入阈值" v-model="obj.alertValue">
          </div>
        </div>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer">
        <a class="btn btn-orange btn-pd-lg mr15" @click="obj.onOk">确定</a>
        <a class="btn btn-default btn-pd-lg" @click="close">取消</a>
      </div>
    </template>
  </d-modal>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
import timeRange from './timeRange';

export default {
  props: {
    show: {
      type: Boolean,
      coerce: coerceBoolean,
      required: true,
      default: false
    },
    obj: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    timeRange
  },
  methods: {
    close() {
      this.obj.alertValue = '';
      this.show = false;
    }
  }
};
</script>
<style lang="less">
 .select-group {
  width: 260px;
  margin-right: 30px;
  .select-menu {
    max-height: 230px;
  }
}
.filter-label-alertvalue {
  width: 50px !important;
}
.filter-alertvalue {
  width: 130px !important;
}
</style>
