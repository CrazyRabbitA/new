<template>
  <div class="data-base-select">
    <d-select :options.sync="sourceTypeArr" :value.sync="sourceType"></d-select>
  </div>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';

export default {
  props: {
    sourceType: [String, Number]
  },
  data() {
    return {
      sourceTypeArr: []
    };
  },
  ready() {
    this.getDataBase();
  },
  methods: {
    getDataBase() {
      this.$http.get('/chart/database', {}).then(
        res => {
          res = res.json();
          if (res.success) {
            res.data.map(item => {
              item.label = item.databaseName;
            });
            this.sourceTypeArr = [];
            this.sourceTypeArr = res.data;
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
<style scoped>
.data-base-select {
  padding: 10px 0;
}
</style>



