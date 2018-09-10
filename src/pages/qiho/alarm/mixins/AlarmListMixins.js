export default {
  data() {
    let columns = [
      {
        title: '广告ID',
        key: 'advertId',
        width: 200
      },
      {
        title: '报警',
        key: 'alarmName',
        width: 200
      },
      {
        title: '时间',
        key: 'gmtCreateStr',
        width: 300
      },
      {
        title: '详情',
        render(row, column, index) {
          let str = `<a class="mr10" href="javascript:void(0)" @click="showDetail('${row.advertId}','${row.alarmName}','${row.adConcume}','${row.adConcumeFluctuate}','${row.launchCount}','${row.launchFluctuate}','${row.clickCount}','${row.clickFluctuate}','${row.orderCount}','${row.orderFluctuate}','${row.offer}','${row.offerFluctuate}','${row.reason}')">详情</a>`;
          return str;
        }
      }
    ];
    return {
      columns: columns,
      data: {},
      tabledata: []
    };
  },
  methods: {
    sortchange(sort) {
      this.params.sortContent = sort.key;
      this.params.sortOrder = sort.order;
      this.params.pageNum = 1;
      this.getAlamList(this.params);
    }
  }
};
