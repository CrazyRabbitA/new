export default {
  data() {
    let columns = [
      {
        title: '广告ID',
        key: 'advertId',
        width: 200
      },
      {
        title: '广告名称',
        key: 'advertName',
        width: 400
      },
      {
        title: '报警选项',
        key: 'alarmName',
        width: 200
      },
      {
        title: '操作',
        render(row, column, index) {
          let str = '';
          if (row.alarmName === 'CPA熔断' || row.alarmName === 'CPA放量') {
            str = `<a class="mr10" v-link="{ path: '/alarm/monitor/cpa/${row.advertId}'}">编辑</a><a class="mr10" @click="delConfigConfirm(${row.id})">删除</a>`;
          } else if (row.alarmName === '点击率') {
            str = `<a class="mr10" v-link="{ path: '/alarm/monitor/clickRate/${row.advertId}'}">编辑</a><a class="mr10" @click="delConfigConfirm(${row.id})">删除</a>`;
          } else if (row.alarmName === '消耗') {
            str = `<a class="mr10" v-link="{ path: '/alarm/monitor/consume/${row.advertId}'}">编辑</a><a class="mr10" @click="delConfigConfirm(${row.id})">删除</a>`;
          }
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
      this.getAlamConfigList(this.params);
    },
    delConfigConfirm(id) {
      this.deleteConfigModal.id = id;
      this.deleteConfigModal.show = true;
    }
  }
};
