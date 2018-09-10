<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="分析中心"
            desc=""
            v-bind:subnav="subnav"
            v-bind:hide="subnavHide"
    >
    </subnav>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
  <hidebar v-bind:hide.sync="subnavHide"></hidebar>
</template>

<script>
  export default {
    ready: function() {
      this.getNavList();
    },
    data() {
      return {
        currentView: '',
        subnavcfg: [
          {
            title: '广告效果分析',
            icon: '&#xe689;',
            url: '/analyze/advEffect'
          },
          {
            title: '媒体离线数据',
            icon: '&#xe688;',
            url: '/analyze/mediaoffline'
          },
          {
            title: '广告流量统计',
            icon: '&#xe690;',
            url: '/analyze/advFlow'
          },
          {
            title: '热力图分析',
            icon: '&#xe691;',
            url: '/analyze/HeatMap'
          },
          {
            title: '用户路径分析',
            icon: '&#xe6cd;',
            url: '/analyze/roadMap'
          },
          {
            title: '消耗波动分析',
            icon: '&#xe692;',
            url: '/analyze/consumefluctuate'
          },
          {
            title: '航站楼-数据产出',
            icon: '&#xe687;',
            url: '/analyze/airport'
          }
        ],
        subnav: [],
        subnavHide: false
      };
    },
    methods: {
      getNavList() {
        let self = this;
        self.subnav = [];
        self.subnavcfg.forEach((item) => {
          window.CFG.forEach((_item) => {
            if (item.url === _item.urls) {
              self.subnav.push(item);
            }
          });
        });
      }
    }
  };
</script>
<style lang="less" scoped>
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
}
</style>

