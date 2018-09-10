<template>
  <d-modal :title="title" :show.sync="show" width="600" :height="100" :on-close="onClose" class="batchdown">
    <template slot="modal-body">
      <div class="modal-body">
        <div class="form-group">
          <label class="control-label">订单创建时间：</label>
          <daterangepicker  :start.sync="myParams.startTime"  formats="yyyy-MM-dd" :error-show.sync="errorShow" :end.sync="myParams.endTime" width="180px" :disabled-date="disabledDate"></daterangepicker>
          <!--<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>-->
        </div>
      </div>
    </template>
    <template slot="modal-footer">
      <div class="modal-footer cf">
         <d-button type="primary" @click="toUrl" class="expBtn">导&nbsp;出</d-button>
      </div>
    </template>
  </d-modal>
</template>
<script>
import coerceBoolean from 'components/utils/coerceBoolean';
import dateUtil from 'components/utils/getCurDate';

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
      coerce: coerceBoolean,
      default: false
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      myParams: {
        startTime: dateUtil({
          date: new Date()
        }),
        endTime: dateUtil({
          date: new Date()
        })
      }
    };
  },
  methods: {
    toUrl: function() {
      window.location.href = '/logistics/statisticsDayExport?startTime=' + this.myParams.startTime + '&endTime=' + this.myParams.endTime;
    }
  }
};
</script>
<style lang="less" scoped>
  .batchdown {
    .d-button{
      float: right;
      margin-right: 20px;
    }
    button.d-button.expBtn {
        margin-right: 50%;
    }
    .filename{
      cursor: not-allowed;
      background: #f4f4f4;
      border-color: #ececec;
      color: #d8d8d8;
    }
    .progress {
      position: relative;
      text-align: center;
      .progressbg {
        position: absolute;
        top: 0;
        left: 0;
        background: #29b6b0;
        height: 32px;
        width: 0;
        opacity: 0.5;
        transition: width .5s ease-in-out;
      }
    }
    .control-label{
      width:108px;
    }
    .date-range{
      height: 34px;
    }
  }
</style>