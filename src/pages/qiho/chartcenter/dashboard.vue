<template>
   <dashboard :biz="4"></dashboard>
</template>
<script>
import dashboard from '../../../components/common/dashboard';
export default {
  components: {
    dashboard
  },
  data() {
    return {
      chartQueryId: ''
    };
  },
  route: {
    data() {
      if (this.$route.params.id && this.$route.params.id !== 'undefined') {
        this.chartQueryId = this.$route.params.id;
      }
    }
  }
};
</script>


