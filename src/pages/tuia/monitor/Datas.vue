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
            title: '媒体维度',
            icon: '&#xe68d;',
            url: '/monitor/mediadimension'
          },
          {
            title: '广告位维度',
            icon: '&#xe691;',
            url: '/monitor/adslotDimension'
          },
          {
            title: '活动维度',
            icon: '&#xe690;',
            url: '/monitor/activitydimension'
          },
          {
            title: '活动媒体维度',
            icon: '&#xe688;',
            url: '/monitor/activityMediaDimension'
          },
          {
            title: '活动广告位维度',
            icon: '&#xe68e;',
            url: '/monitor/activityAdslotDimension'
          },
          {
            title: '广告转化成本',
            icon: '&#xe6ad;',
            url: '/monitor/advcost'
          },
          {
            title: '广告实时数据',
            icon: '&#xe692;',
            url: '/monitor/advRealTime'
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
