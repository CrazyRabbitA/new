<template>
  <div class="advance-table" v-if="showTable">
    <table class="table-wrap recommend-list mt10">
        <thead>
          <tr class="tr-header">
            <template v-for="(index, item) in columns">
              <th :key="index">{{item.title}}</th>
            </template>
            <th>分析时段值</th>
            <th>对比时段值</th>
            <th>影响值
               <d-tooltip content="量化指标对消耗的影响程度，可理解成当前指标波动造成了消耗上涨/下跌XXX元。"  type="disable">
                  <a class="iconhandle icon-positon">&#xe649;</a>
                </d-tooltip>
            </th>
            <th>影响系数
                <d-tooltip content="量化指标对消耗的影响程度，算法：当前影响值除以所有影响值的绝对值之和。"  type="disable">
                  <a class="iconhandle icon-positon">&#xe649;</a>
                </d-tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="tr-items" v-for="(index, item) in list" :key="index">
            <template v-for="(index, _item) in columns">
              <td :key="index">
                {{item[_item.dataIndex]}}
              </td>
            </template>
            <td>
              {{item.value}}
            </td>
            <td>
               {{item.compValue}}
            </td>
            <td v-if="(item.afValue).indexOf('-') === 0" class="down-green">
              {{item.afValue}}
            </td>
            <td v-else class="up-red">
              {{item.afValue}}
            </td>
            <td v-if="(item.afModulus).indexOf('-') === 0" class="down-green">
              {{item.afModulus}}
              <template v-for="(index, _item) in columns">
                <d-tooltip :content="contentFormat(item[_item.dataIndex], item.afValue)" type="disable">
                  <a class="iconhandle icon-positon ml40p">&#xe61f;</a>
                </d-tooltip>
              </template>
            </td>
            <td v-else class="up-red">
              {{item.afModulus}}
              <template v-for="(index, _item) in columns">
                <d-tooltip :content="contentFormat(item[_item.dataIndex], item.afValue)" type="disable">
                  <a class="iconhandle icon-positon ml40p">&#xe61f;</a>
              </d-tooltip>
            </template>
            </td>
            
          </tr>
        </tbody>
      </table>
    <tableempty v-if="!$loadingRouteData && (list && list.table && list.table.length === 0)"></tableempty>
  </div>
</template>
<script>
import { _fixNum } from 'components/utils/cheatDataUtils';
import Tooltip from 'iview/src/components/tooltip';
Vue.component('Tooltip', Tooltip);
import Vue from 'vue';

export default {
  props: {
    list: {
      type: Array,
      default: null
    },
    columns: {
      type: Array,
      default: null
    }
  },
  watch: {
    list() {
      if (this.list && this.list.length > 0) {
        this.showTable = true;
      }
    }
  },
  data() {
    return {
      showTable: false
    };
  },
  methods: {
    fixNum: _fixNum,
    contentFormat(text, val) {
      const key = val.indexOf('-') === 0 ? '下降' : '上涨';
      val = val.indexOf('-') === 0 ? val.slice(1) : val;
      return `假设其他指标不变的情况下，${text}的变化将导致消耗${key}${val}元`;
    }
  }
};
</script>
<style lang="less">
  .table-wrap {
    .tr-header th {
      position: relative;
      text-align: left;
      padding-right: 40px;
    }
    .tooltip-inner {
      text-align: left;
    }
    .ml40p {
      position: absolute;
      left: 55%;
    }
    .tr-items{
      td{
        text-align: left;
        padding-right: 40px;
        position: relative;
      }
      .td-relative {
        position: relative;
        left: -8%;
      }
    }
    .tr-header,.tr-items{
      .text-left{
        text-align: left;
        padding-right: 10px;
      }
    }
  }
  .tr-items .iconhandle, .tr-items .iconnav {
    color: #29b6b0;
  }
</style>