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
            title: '大盘数据',
            icon: '&#xe692;',
            url: '/wwjdatapanel/indexdata'
          },
          {
            title: 'ROI数据',
            icon: '&#xe68d;',
            url: '/wwjdatapanel/roidata'
          },
          {
            title: '新用户主路径转化',
            icon: '&#xe692;',
            url: '/wwjdatapanel/newuser'
          },
          {
            title: '用户主路径转化',
            icon: '&#xe692;',
            url: '/wwjdatapanel/userswitch'
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
