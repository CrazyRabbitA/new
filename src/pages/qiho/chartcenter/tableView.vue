<template>
   <table-view :id="chartQueryId" :type="4"></table-view>
</template>
<script>
import tableView from '../../../components/common/tableView';
export default {
  components: {
    tableView
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


