<template>
  <sidebar></sidebar>
  <div v-bind:class="{
    'content': true,
    'content-big': subnavHide
  }">
    <subnav title="投放监控"
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
            title: '查询列表',
            icon: '&#xe68d;',
            url: '/alarm/monitor/configlist'
          },
          {
            title: '点击率设置',
            icon: '&#xe68d;',
            url: '/alarm/monitor/clickRate'
          },
          {
            title: 'CPA设置',
            icon: '&#xe68d;',
            url: '/alarm/monitor/cpa'
          },
          {
            title: '消耗设置',
            icon: '&#xe68d;',
            url: '/alarm/monitor/consume'
          },
          {
            title: '报警列表',
            icon: '&#xe68d;',
            url: '/alarm/monitor/alarmlist'
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

