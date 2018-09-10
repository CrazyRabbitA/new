<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="数据"
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
    data() {
      return {
        routepath: '',
        currentView: '',
        subnav: [
          {
            title: '推啊&奇货',
            icon: '&#xe68d;',
            url: '/qiho/tuia/'
          },
          {
            title: '投放定制化数据',
            icon: '&#xe68d;',
            url: '/qiho/put/'
          },
          {
            title: '实时数据平台',
            icon: '&#xe68d;',
            url: '/qiho/show/'
          },
          {
            title: '人员管理',
            icon: '&#xe68d;',
            url: '/qiho/member/'
          }
        ],
        subnavHide: false
      };
    },

    methods: {}
  };
</script>
<style>
  .main {
    background-color: #fff;
    padding: 20px;
    margin: 20px;
  }   
</style>

