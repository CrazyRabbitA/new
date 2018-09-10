<template>
  <div class="core-page">
      <pagetitle class="incometitle" title="核心数据" ></pagetitle>
      <div class="chart-wrapper">
          <core-component  :key="i" v-for="i in chartCount"></core-component>
      </div> 
      <!-- <button class="add-chart" @click="addChart">+添加图表</button> -->
  </div>
</template>
<script>
  import coreComponent from './components/coreComponent.vue';
  export default {
    components: {coreComponent},
    data() {
      return {
        chartCount: 1,
        chartid: 'canvas1'
      };
    },
    methods: {
      addChart() {
        this.chartCount++;
      }
    }
  };
</script>
<style lang="less" >
.core-page{
  .add-chart{
      background: #FFC715;
      outline:none;
      padding:5px 10px;
      border:1px solid #eee;
      border-radius:3px;
      cursor:pointer;
      display: block;
      margin-left:46px;
      margin-top:20px;
  }
}

</style>

