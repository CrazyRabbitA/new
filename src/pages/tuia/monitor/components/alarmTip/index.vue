<template>
  <d-modal title="" type="delete" :show.sync="show">
    <template slot="modal-body">
      <div class="modal-body">
        <p>当前报警条件过去7日报警次数<span class="red">{{obj.count}}</span>次，是否确认添加？</p>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer">
        <a class="btn btn-orange btn-pd-lg mr15" @click="obj.onOk">添加</a>
        <a class="btn btn-default btn-pd-lg" @click="close">取消</a>
      </div>
    </template>
  </d-modal>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';

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
  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.red {
  color: red;
}
</style>
