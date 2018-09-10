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
            title: '报表管理',
            icon: '&#xe692;',
            url: '/chart/list'
          },
          {
            title: '配置图表',
            icon: '&#xe68d;',
            url: '/chart/add'
          },
          {
            title: '角色管理',
            icon: '&#xe68d;',
            url: '/chart/usermange'
          },
          {
            title: '权限管理',
            icon: '&#xe68d;',
            url: '/chart/authormange'
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
<style scoped>
.main {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
}
</style>

