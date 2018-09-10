<template>
  <pagetitle title="实时数据平台"></pagetitle>
  <div class="page-content datacenter-app">
    <type-tabs :tabs="typeTabs"></type-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import TypeTabs from './components/TypeTabs';
export default {
  components: {
    TypeTabs
  },
  data() {
    return {
      typeTabs: [
        {
          url: '/qiho/show/realtimedata',
          title: '概况'
        },
        {
          url: '/qiho/show/accumulatedata',
          title: '商品累积数据'
        },
        {
          url: '/qiho/show/timeslotdata',
          title: '商品时段数据'
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
</style>
