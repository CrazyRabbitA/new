<template>
  <d-modal :title="'确认删除'" :show.sync="show" type="delete" width="300">
    <template slot="modal-body">
      <div class="modal-body">
        <p>{{obj.name}}</p>
      </div>
    </template>
    <template slot="modal-footer">
      <!-- <div class="modal-footer">
        <a href="javascript:;" class="btn mr20 btn-white" @click="cClick()">{{okText}}</a>
        <a href="javascript:;" class="btn btn-default" @click="show = false">取消</a>
      </div> -->
      <div class="modal-footer cf" slot="modal-footer">
        <d-button type="warning"  @click="cClick()">{{okText}}</d-button>
        <d-button type="warning"  @click="show = false">取消</d-button>
    </div>
    </template>
  </d-modal>
</template>

<script>
export default {
  props: {
    okText: {
      type: String,
      default: '确定'
    },
    show: {
      type: Boolean
    },
    onOk: {
      default: () => {
      }
    },
    obj: {
      default: () => {
      }
    },
    showClose: {
      type: Boolean
    }
  },
  created() {
  },
  methods: {
    cClick() {
      if (this.onOk) {
        this.onOk(this.obj.id);
        return;
      }
      this.show = false;
    }
  }
};
</script>
<style lang="less">
  .btn-white {
    background: #FFF;
    border: 1px solid #BBB;
    color: #444;
  }
  .btn-white:hover {
    background: #ff795c;
    border: 1px solid #ff795c;
    color: #fff;
  }
</style>
