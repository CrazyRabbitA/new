<template>
 <div class="data-set">
   <data-base :source-type.sync="params.databaseId"></data-base>
   <div class="sql-content">
     <textarea class="sql-edit" v-model="params.queryTemp" cols="30" rows="10" placeholder="请输入SQL语句进行查询"></textarea>
   </div>
   <div class="form-filter-group nf">
     <p class="filter-label fl filter-label-add">图表类型：</p>
     <div class="chart-type-list">
       <span class="chart-type-item" :class="params.queryType === 1 ? 'active' : ''" @click="changeQueryType(1)">二维表</span>
       <span class="chart-type-item" :class="params.queryType === 2 ? 'active' : ''" @click="changeQueryType(2)">折线图（离线）</span>
       <span class="chart-type-item" :class="params.queryType === 3 ? 'active' : ''" @click="changeQueryType(3)">折线图（实时）</span>
     </div>
   </div>
  <d-button size="large" type="primary" @click="saveSql">下一步</d-button> 更改SQL或切换数据库后请重新点击“下一步”
</div>
</template>
<script>
import dataBase from '../dataBase';
export default {
  components: {
    dataBase
  },
  props: {
    params: {
      type: Object,
      default: null
    },
    changeQueryType: {
      type: Function,
      default: null
    },
    saveSql: {
      type: Function,
      default: null
    }
  }
};
</script>
<style lang="less" scoped>
.data-set {
  border-bottom: 1px #e3e3e3;
}
.filter-label-add {
  font-size: 14px;
  font-weight: bold;
  color: #444;
  width: 85px;
  text-align: left;
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
}
.chart-type-list {
  display: inline-flex;
  height: 33px;
  align-items: center;
  border: 1px solid #ccc;
  background-color:#efefef;
  cursor: pointer;
  .chart-type-item {
    padding: 0 20px;
    height: 33px;
    line-height: 33px;
    text-align: center;
    font-size: 14px;
    border-right: 1px solid #ccc;
    &:nth-last-child(1) {
      border-right: none;
    }
    &.active {
      color: #ef6b3b;
    }
    &:hover {
      color: #ef6b3b;
    }
  }
}
.form-filter-group {
  margin: 10px 0;
}
</style>

