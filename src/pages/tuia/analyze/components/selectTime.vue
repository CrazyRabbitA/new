<template>
  <div class="time-select-cpm cf">
    <div class="form-filter-group" @click="timeRangChange">
        <p class="filter-label">时间：</p>
        <daterangepicker :start.sync="timeObj.startDate" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="timeObj.endDate" :disabled-date="disabledDate" width="190px"></daterangepicker>
    </div>
    <div class="time-tap-warp" v-show = 'isshow'>
      <ul>
        <template v-for="item in taps" track-by="$index">
          <li @click="changeTime(item.action)" :class="{active: item.action===curSelect}">{{item.title}}</li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import dateUtil from 'components/utils/getCurDate';
const taps = [
  {
    title: '近1天',
    action: 1
  },
  {
    title: '近7天',
    action: 7
  },
  {
    title: '近15天',
    action: 15
  },
  {
    title: '近30天',
    action: 30
  }
];
export default {
  props: {
    timeObj: {
      type: Object,
      default: () => {
        return {
          startDate: '',
          endDate: ''
        };
      }
    },
    buttonTime: {
      type: Boolean,
      default: true
    },
    isshow: {
      type: Boolean,
      default: true
    }
  },
  ready() {
    this.timeObj.startDate = this.getOrderDate(1);
    this.timeObj.endDate = this.getOrderDate(1);
  },
  watch: {
    timeObj: {
      handler: function(val, oldVal) {
        if (!this.buttonTime) {
          this.curSelect = '?';
        }
      },
      deep: true
    }
  },
  data() {
    return {
      taps: taps,
      curSelect: 1
    };
  },
  methods: {
    /**
     * 订单时间设置
     */
    getOrderDate(offset) {
      var myDate = new Date();
      myDate.setDate(myDate.getDate() - offset);
      return dateUtil({
        date: myDate
      });
    },
    /**
     * 订单时间禁选今天以后的时间
     */
    disabledDate: function(date) {
      var now = new Date();
      return date.getTime() > (now.getTime() - 24 * 60 * 60 * 1000);
    },
    /**
     * 改变时间
     */
    timeRangChange() {
      this.buttonTime = false;
    },
    changeTime(offset) {
      this.timeObj.startDate = this.getOrderDate(offset);
      this.timeObj.endDate = this.getOrderDate(1);
      this.curSelect = offset;
      this.buttonTime = true;
    }
  }
};
</script>
<style lang="less" scoped>
.time-select-cpm {
   margin-top: 20px;
  .form-filter-group {
      margin-bottom: 18px;
      font-size: 0px;
      float: left;
      .filter-label {
          font-size: 14px;
          font-weight: bold;
          color: #444;
          width: 84px;
          text-align: left;
          display: inline-block;
          vertical-align: top;
          margin-top: 10px;
          &.long {
            width: 120px;
            text-align: left;
          }
      }
      .form-control {
          width: 120px;
          display: inline-block;
          margin-right: 10px;
      }
      .datepicker-input {
          width: 160px !important;
      }
      .iconhandle {
          right: 26px !important;
      }
  }
  .time-tap-warp {
    ul {
      display: inline-block;
      margin-left: 60px;
      border-right: 1px solid #e3e3e3;
    }
    li {
      display: inline-block;
      border: 1px solid #e3e3e3;
      background-color: #f7f6f2;
      border-right: none;
      height: 34px;
      line-height: 34px;
      padding: 0 14px;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #ef6b3b;
      }
      &.active {
        background-color: #ef6b3b;
        color: #fff;
        border: 1px solid #ef6b3b;
      }
    }
  }
}
</style>

