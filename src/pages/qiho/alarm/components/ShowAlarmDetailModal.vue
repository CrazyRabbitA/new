<template>
  <div class="alarm">
    <d-modal :title="title" :show.sync="show" width="500" :on-close="onClose" :on-ok="onOk" :modal-params="modalParams" class="agent-edit-modal">
      <template slot="modal-body">
        <div class="modal-body agent-model">
          <div class="form-row">
            <label class="form-label">广告ID:</label>{{modalParams.advertId}}
          </div>
          <div class="form-row">
            <label class="form-label">报警触发:</label>{{modalParams.alarmName}}
          </div>
           <div class="form-row alarm-table">
            <label class="form-label">报警原因:</label>
            <div class="cont-table">
              <p><span class="form-span">消耗</span><span class="span_con">{{modalParams.adConcume}}</span><span class="form-span1">波动</span>{{modalParams.adConcumeFluctuate}}%</p>
              <p><span class="form-span">发券量</span><span class="span_con">{{modalParams.launchCount}}</span><span class="form-span1">波动</span>{{modalParams.launchFluctuate}}%</p>
              <p><span class="form-span">点击量</span><span class="span_con">{{modalParams.clickCount}}</span><span class="form-span1">波动</span>{{modalParams.clickFluctuate}}%</p>
              <p><span class="form-span">下单量</span><span class="span_con">{{modalParams.orderCount}}</span><span class="form-span1">波动</span>{{modalParams.orderFluctuate}}%</p>
              <p><span class="form-span">出价</span><span class="span_con">{{modalParams.offer}}</span><span class="form-span1">波动</span>{{modalParams.offerFluctuate}}%</p>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">原因定位:</label>{{modalParams.reason}}
          </div>
        </div>
      </template>
    </d-modal>
  </div>
</template>
<script>
import validationMixins from 'components/utils/validationMixins';

export default {
  props: {
    modalParams: {
      required: true,
      type: Object,
      default: {
        advertId: '',
        alarmName: '',
        adConcume: '',
        adConcumeFluctuate: '',
        launchCount: '',
        launchFluctuate: '',
        clickCount: '',
        clickFluctuate: '',
        orderCount: '',
        orderFluctuate: '',
        offer: '',
        offerFluctuate: ''
      }
    },
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
    onClose: {
      type: Function,
      default: null
    },
    onOk: {
      type: Function,
      default: null
    }
  },
  mixins: [validationMixins],
  data() {
    return {
      params: {
        id: '',
        agentName: '',
        contactName: '',
        contactMobile: ''
      },
      hasSubmited: false,
      isEdit: false,
      disabled: false
    };
  }
};
</script>
<style lang="less">
  .alarm{
    .modal-body{
      &.agent-model{
        max-height: 500px;
        min-height: 400px;
        overflow-y: auto;
      }
      .form-row{
        margin-bottom: 20px;
        .form-label{
          margin-right: 10px;
          display: inline-block;
          width: 65px;
        }
        
        &.alarm-table{
          overflow: hidden;
          .form-label,.cont-table{
            float: left;
          }
          .cont-table{
            display: inline-block;
            .form-span{
              width: 70px;
              display: inline-block;
            }
            .span_con{
              display: inline-block;
              min-width: 80px;
            }
            .form-span1{
              width: 60px;
              display: inline-block;
              margin-left: 30px;
            }
            p{
              margin-bottom: 20px;
            }
          }
        }
      }
    }
    .modal-footer{
      display: none;
    }
  }
</style>