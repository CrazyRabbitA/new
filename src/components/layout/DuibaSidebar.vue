<template>
  <aside id="app-sidebar">
    <topbar :app-show-id="'duiba'"></topbar>
    <nav class="sidebar-nav">
      <ul class="nav-link">
        <li v-for="item in navList" track-by="$index">
          <a v-link="{ path: item.href, activeClass: 'active' }">
            <i class="iconnav">{{{item.icon}}}</i>
            {{item.title}}
          </a>
        </li>
      </ul>
    </nav>
    <Bottombar v-bind:type="type" v-bind:hide.sync="botBarHide"></Bottombar>
  </aside>
</template>

<script>
import Bottombar from './Bottombar';
import topbar from './Topbar';

export default {
  props: ['type'],
  components: {
    Bottombar,
    topbar
  },
  ready: function() {
    this.getNavList();
  },
  data() {
    return {
      botBarHide: true,
      navListCfg: [
        {
          title: '数据看板',
          id: 'duibadatapanel',
          icon: '&#xe68a;',
          href: '/duibadatapanel'
        },
        {
          title: '实时监控',
          id: 'duibamonitor',
          icon: '&#xe693;',
          href: '/duibamonitor'
        },
        {
          title: '报表中心',
          id: '/duibachartcenter',
          icon: '&#xe692;',
          href: '/duibachartcenter'
        }
      ],
      navList: []
    };
  },
  methods: {
    getNavList() {
      let self = this;
      self.navList = [];
      self.navListCfg.forEach((item) => {
        window.CFG.forEach((_item) => {
          if (item.href === _item.urls) {
            self.navList.push(item);
          }
        });
      });
    }
  }
};
</script>

<style lang="less">
#app-sidebar {
  width: 80px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  background-color: #333;
  z-index: 1001;

  .iconnav {
    font-size: 20px;
    display: block;
    padding: 10px 0 6px 0;
  }
}

.nav-link a{
  display: block;
  color: #fff;
  height: 60px;
  text-align: center;
  font-size: 12px;
  opacity: .6;
  &:hover {
    background: rgba(92, 92, 92, 0.2);
    opacity: 1;
  }

  &.active {
    background-color: #5c5c5c;
    color: #fff;
    opacity: 1;
  }
}
</style>
