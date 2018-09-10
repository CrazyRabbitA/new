<template>
  <div class="time-select-cpm cf">
    <div class="date-tags">
      <div @click="dateTagsChange(1)" class="date-tags-item" :class="{active: dateTagsType === 1}">按日</div>
      <div @click="dateTagsChange(2)" class="date-tags-item" :class="{active: dateTagsType === 2}">按周</div>
    </div>
    <div class="form-filter-group" @click="timeRangChange">
        <p class="filter-label">时间：</p>
        <daterangepicker :start.sync="timeObj.startDate" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="timeObj.endDate" :disabled-date="disabledDate" width="190px"></daterangepicker>
    </div>
    <div class="time-tap-warp">
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
    title: '近七天',
    action: 7
  },
  {
    title: '近15天',
    action: 15
  },
  {
    title: '近30天',
    action: 30
  },
  {
    title: '近3个月',
    action: 90
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
    dateTagsType: {}
  },
  ready() {
    this.timeObj.startDate = this.getOrderDate(7);
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
      curSelect: 7
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
    disabledDate(date) {
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
      if (this.dateTagsType === 1) {
        this.timeObj.startDate = this.getOrderDate(offset);
        this.timeObj.endDate = this.getOrderDate(1);
      } else {
        const myDate = new Date();
        const week = myDate.getDay();
        this.timeObj.startDate = this.getOrderDate(offset * 7 + week - 1);
        this.timeObj.endDate = this.getOrderDate(week);
      }
      this.curSelect = offset;
      this.buttonTime = true;
    },
    dateTagsChange(id) {
      this.dateTagsType = id;
      if (id === 2) {
        this.curSelect = 4;
        this.changeTime(4);
        this.taps = [
          {
            title: '近4周',
            action: 4
          },
          {
            title: '近8周',
            action: 8
          }
        ];
      } else {
        this.curSelect = 7;
        this.changeTime(7);
        this.taps = taps;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.time-select-cpm {
  margin-top: 20px;
  .date-tags {
    position: absolute;
    top: 35px;
    right: 130px;
    width: 150px;
    height: 34px;
    .date-tags-item {
      float: left;
      width: 75px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #e3e3e3;
      background-color: #f7f6f2;
      cursor: pointer;
    }
    div.active {
      color: #fff;
      background-color: #ef6b3b;
      border: 1px solid #ef6b3b;
    }
  }
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

