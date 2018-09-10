<template>
  <d-modal title="删除报警规则" type="delete" :show.sync="show">
    <template slot="modal-body">
      <div class="modal-body">
        <p>确认要删除此规则？</p>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer">
        <a class="btn btn-orange btn-pd-lg mr15" @click="obj.onOk">删除</a>
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
