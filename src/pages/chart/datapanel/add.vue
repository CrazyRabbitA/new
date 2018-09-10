<template>
  <div class="add-cahrt">
    <pagetitle class="incometitle" :title="title" ></pagetitle>
    <filter :edit-data.sync="data" v-if="showCfg"></filter>
  </div>
</template>
<script>
import filter from './components/filter';
import MessageBox from 'components/basic/MessageBox';

export default {
  components: {
    filter
  },
  data() {
    return {
      title: '新建数据表格',
      data: {},
      showCfg: false
    };
  },
  route: {
    data() {
      if (this.$route.params.id && this.$route.params.id !== 'undefined') {
        this.id = this.$route.params.id;
        this.title = '修改数据表格';
        this.getEditCfg();
      } else {
        this.showCfg = true;
      }
    }
  },
  methods: {
    // 获取配置
    getEditCfg() {
      this.$http.get(`/chart/config?id=${this.id}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
            this.showCfg = true;
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
          this.$loadingRouteData = false;
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>


</style>

