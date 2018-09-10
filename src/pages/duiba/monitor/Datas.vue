<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="实时监控"
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
            title: '大盘数据',
            icon: '&#xe68e;',
            url: '/duibamonitor/market'
          },
          {
            title: '主会场',
            icon: '&#xe68d;',
            url: '/duibamonitor/resources'
          },
          {
            title: '首页资源位',
            icon: '&#xe691;',
            url: '/duibamonitor/hotspot'
          },
          {
            title: '独立活动',
            icon: '&#xe690;',
            url: '/duibamonitor/activity'
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
