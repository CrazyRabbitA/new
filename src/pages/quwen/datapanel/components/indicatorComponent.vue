<template>
  <div >
    <p class="ins"><span>指标:</span></p>
    <d-select
        class="select"
        @select='selectindicators'
        :options.sync="indicators"
        :value.sync ="indicatorsTypeItem" ></d-select>
        <p class="data-type3">
            <span
                @click="changeIndicators(index,item)"
                :class="{'isActive':item.active}"
                v-for="(index,item) in showindicators"
                :key="index">{{item.label}}</span>
        </p>
  </div>
</template>
<script>
import { formatDate } from 'components/utils/dateUtils';
// import selectcomponent from './selectComponent';
export default {
  data() {
    const showindicators = [
      {
        label: 'APP启动用户数',
        id: 'appStartUser',
        active: true
      },
      {
        label: '用户登录数',
        id: 'loginUser',
        active: false
      },
      {
        label: '人均访问时长',
        id: 'avgVisitDuration',
        active: false
      },
      {
        label: '人均点击文章数',
        id: 'articleClickAvg',
        active: false
      },
      {
        label: '次日留存率',
        id: 'dayStayRate',
        active: false
      },
      {
        label: '周留存率',
        id: 'weekStayRate',
        active: false
      }
    ];
    return {
      params: {
        startDate: this._getYesDay(formatDate(new Date())),
        endDate: this._getYesDay(formatDate(new Date()))
      },
      showindicators: showindicators,
      indicators: [],
      indicatorsTypeItem: 'appStartUser'
    };
  },
  methods: {
    changeIndicators(index, item) {
      // this.$emit('getin')
      this.showindicators.map((ditem, i) => {
        if (i === index) {
          ditem.active = true;
          this.indicatorsTypeItem = ditem.id;
        } else {
          ditem.active = false;
        }
        return ditem;
      });
      this.$emit('getindica', this.indicatorsTypeItem);
      // 回传调用
    },
    selectindicators() {
      let label = '';
      const arrs = this.indicators.filter(ele => {
        return ele.id === this.indicatorsTypeItem;
      });
      label = arrs[0].label;
      this.$emit('gettext', label);
      this.$emit('getindica', this.indicatorsTypeItem);
      this.showindicators.map(item => {
        item.active = false;
        if (item.id === this.indicatorsTypeItem) {
          item.active = true;
        }
        return item;
      });
    },
    getIndicators() {
      this.$http.get('/quwen/coreDataIndicators').then(res => {
        const data = res.json().data.coreDataIndicators;
        let entries = Object.entries(data);
        this.indicators = entries.map(ele => {
          return {
            label: ele[1],
            id: ele[0]
          };
        });
        this.$emit('gettotal', data);
      });
    },
    _getYesDay(dateStr) {
      let yes = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(yes);
    }
  },
  ready() {
    this.getIndicators();
  }
};
</script>
<style lang="less" >
.chart-page {
  .select-menu{
    max-height: 280px !important;
  }
  .data-wrapper {
    height: 60px;
    margin-top: 10px;
    p {
      float: left;
      &:nth-child(2),
      &:nth-child(3) {
        margin-left: 30px;
        height: 34px;
        padding-top: 4px;
        box-sizing: border-box;
        span {
          cursor: pointer;
          display: inline-block;
          padding: 4px 20px;
          border: 1px solid #999;
          border-right: none;
          &:nth-last-child(1) {
            border-right: 1px solid #999;
          }
        }
      }
    }
  }
  .add-dimension {
    background: rgb(224, 59, 59);
    display: block !important;
    text-align: center;
    line-height: 34px;
    width: 44px;
    height: 34px;
    border: none;
    font-size: 24px;
    color: #fff;
    border-radius: 3px;
    margin-left: 46px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .isActive {
    background: #ffc715;
  }
  .add-dimension {
    display: inline-block;
    background: #ffc715;
  }
  .data-type3 {
    margin-left: 30px;
    height: 34px;
    padding-top: 4px;
    box-sizing: border-box;
    span {
      cursor: pointer;
      display: inline-block;
      padding: 4px 10px;
      border: 1px solid #999;
      border-right: none;
      &:nth-last-child(1) {
        border-right: 1px solid #999;
      }
    }
  }
  .select {
    float: left;
  }
}
</style>

