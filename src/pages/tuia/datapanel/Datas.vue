<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="数据看板" desc="" v-bind:subnav="subnav" v-bind:hide="subnavHide">
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
          title: '收入数据监控',
          icon: '&#xe692;',
          url: '/datapanel/income'
        },
        {
          title: '核心数据看板',
          icon: '&#xe687;',
          url: '/datapanel/bigpanel'
        },
        {
          title: '广告行业数据',
          icon: '&#xe690;',
          url: '/datapanel/advertdata'
        },
        {
          title: '广告KA数据',
          icon: '&#xe689;',
          url: '/datapanel/advertKaData'
        },
        {
          title: '新增数据',
          icon: '&#xe689;',
          url: '/datapanel/newAdd'
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
      self.subnavcfg.forEach(item => {
        window.CFG.forEach(_item => {
          if (item.url === _item.urls) {
            self.subnav.push(item);
          }
        });
      });
    }
  }
};
</script>
