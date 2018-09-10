<template>
  <div class="heatmap-warp">
    <pagetitle class="heatmap-title" title="热力图数据"></pagetitle>
    <div class="map-type">
      <ul class="map-wrapper">
        <li
          :class= "{ active:item.index === curIndex }"
          v-for="(index,item) in mapTypes"
          @click = "changeType(index)"
          :key="index">{{item.label}}</li>
      </ul>
    </div>
    <heatmapact v-if="curIndex === 0"></heatmapact>
    <heatmapland v-if="curIndex === 1"></heatmapland>
  </div>
</template>
<script>
import heatmapland from './components/heatmapland';
import heatmapact from './components/heatmapact';
const mapTypes = [
  {
    label: '活动页面',
    index: 0
  },
  {
    label: '落地页',
    index: 1
  }
  // {
  //   label: '游戏',
  //   index: 2
  // },
  // {
  //   label: '主会场',
  //   index: 3
  // },
  // {
  //   label: '直投页',
  //   index: 4
  // },
  // {
  //   label: '广告弹层',
  //   index: 5
  // }
];
export default {
  components: {
    heatmapland,
    heatmapact
  },
  data() {
    return {
      mapTypes: mapTypes,
      pageType: 0,
      curIndex: 0
    };
  },
  methods: {
    changeType(index) {
      this.curIndex = index;
      this.pageType = index;
    }
  }
};
</script>
<style lang="less">
.heatmap-title{
  margin-bottom: 10px;
}
</style>
