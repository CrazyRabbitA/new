<template>
  <pagetitle title="推啊&奇货"></pagetitle>
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
          url: '/qiho/tuia/overall',
          title: '概况'
        },
        {
          url: '/qiho/tuia/goods',
          title: '商品'
        },
        {
          url: '/qiho/tuia/adplan',
          title: '广告计划'
        },
        {
          url: '/qiho/tuia/media',
          title: '媒体'
        },
        {
          url: '/qiho/tuia/coupon',
          title: '出券顺序'
        },
        {
          url: '/qiho/tuia/trend',
          title: '商品趋势'
        },
        {
          url: '/qiho/tuia/goodstime',
          title: '商品小时数据'
        },
        {
          url: '/qiho/tuia/advtime',
          title: '广告小时数据'
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
