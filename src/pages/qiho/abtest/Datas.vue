<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="测试效果日报"
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
            title: 'ABTest',
            icon: '&#xe68d;',
            url: '/abtest/reports'
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

