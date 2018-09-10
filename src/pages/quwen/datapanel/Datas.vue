<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="数据看板"
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
            title: '核心数据监控',
            icon: '&#xe68a;',
            url: '/quwendatapanel/coredata'
          },
          {
            title: '核心数据',
            icon: '&#xe68a;',
            url: '/quwendatapanel/core'
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
