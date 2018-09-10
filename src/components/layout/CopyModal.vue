<template>
  <modal title="获取链接" :show.sync="show" effect="fade" width="570" class="copy-modal">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="form-group">
          <label class="control-label">URL链接：</label>
          <input type="text" class="form-control" readonly v-model="url" v-el:url-input>
          <a href="javascript:void(0)" class="btn btn-green btn-lg copy-btn" @click="copyUrl">复制</a>
        </div>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer cf">
      </div>
    </template>
  </modal>
</template>

<script>
import modal from '../basic/Modal';
import tip from '../basic/Tip';
import coerceBoolean from 'components/utils/coerceBoolean.js';
import messagebox from '../basic/MessageBox.js';

export default {
  components: {
    modal,
    tip
  },

  computed: {
    redirectUrl: function() {
      return 'setting?appId=' + duiba.appId + '#!/interface';
    }
  },

  props: {
    show: {
      required: true,
      twoWay: true,
      default: true,
      coerce: coerceBoolean
    },
    url: {
      required: true,
      default: ''
    }
  },

  methods: {
    close: function() {
      this.show = false;
    },

    copyUrl: function() {
      this.$els.urlInput.select();
      try {
        var successful = document.execCommand('copy');
        if (successful) {
          messagebox({
            title: '复制成功！',
            type: 'success'
          });
        }
      } catch (err) {}
    }
  }
};
</script>

<style lang="less">
.copy-modal {
  .modal-body {
    padding: 20px 30px;
  }

  .tip {
    margin-bottom: 10px;
  }

  .copy-btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .form-group {
    padding-left: 90px;
    padding-right: 70px;
  }

  .control-label {
    width: 80px;
    font-weight: normal;
  }

  .modal-footer {
    padding: 0 30px 20px;
  }

  .copy-tip {
    background-color: #eee;
    padding: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    line-height: 2;

    ol {
      margin-left: 75px;
      list-style-type: decimal;
      list-style-position: inside;
    }
  }
}
</style>
