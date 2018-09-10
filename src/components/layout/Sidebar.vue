<template>
  <aside id="app-sidebar">
    <topbar></topbar>
    <nav class="sidebar-nav">
      <ul class="nav-link">
        <li v-for="item in navList">
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
  data() {
    return {
      botBarHide: true,
      navList: [
        {
          title: '数据看板',
          id: 'datapanel',
          icon: '&#xe603;',
          href: '/datapanel'
        },
        {
          title: '实时监控',
          id: 'orders',
          icon: '&#xe600;',
          href: '/orders'
        },
        {
          title: '分析中心',
          id: 'express',
          icon: '&#xe60b;',
          href: '/express'
        },
        {
          title: '奇货',
          id: 'qiho',
          icon: '&#xe60c;',
          href: '/qiho'
        }
      ]
    };
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
    padding: 12px 0 6px 0;
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
