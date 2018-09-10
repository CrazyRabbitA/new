<template>
  <pagetitle title="ABtest"></pagetitle>
  <div class="page-content datacenter-app">
    <div class="report-type-warp">
      <type-tabs :tabs="typeTabs"></type-tabs>
    </div>  
    <router-view></router-view>
  </div>
</template>

<script>
import TypeTabs from '../qiandtui/components/TypeTabs';
export default {
  components: {
    TypeTabs
  },
  data() {
    return {
      typeTabs: [
        {
          url: '/abtest/reports/sku',
          title: '价格测试报表'
        }
      ]
    };
  }
};

</script>
<style lang="less" scoped>
 .datacenter .type-tabs + .reporttitle {
  margin-top: 20px;
 }
 .report-type-warp {
   display: none;
 }
</style>
