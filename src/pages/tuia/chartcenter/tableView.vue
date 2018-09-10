<template>
   <table-view :id="chartQueryId" :slot-id="slotId" :date="date"></table-view>
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
      // slotId: '',
      // date: ''
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


