<template>
  <modal :show.sync="show" :title="title" effect="fade" :type="type" >
    <template slot="modal-body">
      <div class="modal-body">
        <template v-if="type === 'submit'">
          <p>
            {{desc}}
            <span class="people-count">{{count}}</span>
            人
          </p>
        </template>
        <template v-else>
          <p>{{{desc}}}</p>
        </template>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer">
        <a class="btn btn-green btn-pd-lg mr15" v-if="!iknow" :class="{'btn-orange': type === 'delete'}" @click="onOk">{{ okText }}</a>
        <a class="btn btn-default btn-pd-lg" @click="close" >{{ cancelText }}</a>
      </div>
    </template>
  </modal>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean';

export default {

  props: {
    title: {
      required: true,
      type: String
    },
    desc: {
      required: true,
      type: String
    },
    type: {
      type: String
    },
    onOk: {
      type: Function,
      default() {}
    },
    okText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    iknow: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    count: {
      type: Number
    }
  },
  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>
<style>
  .people-count{
    color:#29b6b0;
  }
</style>