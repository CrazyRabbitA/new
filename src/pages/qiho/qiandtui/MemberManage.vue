<template>
  <pagetitle title="人员管理"></pagetitle>
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
          url: '/qiho/member/AE',
          title: 'AE管理'
        },
        {
          url: '/qiho/member/AEGroup',
          title: 'AE组管理'
        },
        {
          url: '/qiho/member/ADAndAE',
          title: '广告ID和AE'
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
