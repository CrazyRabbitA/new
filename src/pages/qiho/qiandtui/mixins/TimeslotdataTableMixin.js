export default {
  data() {
    let columns = [
      {
        title: '商品ID',
        key: 'itemId',
        width: 60,
        render(row, column, index) {
          return row.itemId || '';
        }
      },
      {
        title: '商品名称',
        key: 'itemName',
        width: 120
      },
      {
        title: '广告ID',
        key: 'advertId',
        width: 80,
        render(row, column, index) {
          return row.advertId || '';
        }
      },
      {
        title: '时间',
        key: 'finishTime',
        width: 170
      },
      {
        title: '消耗',
        key: 'consumeTotal',
        width: 95
      },
      {
        title: '发券量',
        key: 'launchCount',
        width: 95
      },
      {
        title: '点击量',
        key: 'clickCount',
        width: 95
      },
      {
        title: '下单量',
        key: 'orderCount',
        width: 95
      },
      {
        title: 'CTR',
        key: 'ctr',
        width: 80
      },
      {
        title: 'CVR',
        key: 'cvr',
        width: 80
      },
      {
        title: 'CPC',
        key: 'cpc',
        width: 60
      },
      {
        title: 'CPA',
        key: 'cpa',
        width: 60
      },
      {
        title: 'ARPU',
        key: 'arpu',
        width: 60
      },
      {
        title: '操作',
        width: 120,
        render(row, column, index) {
          let itemId = row.itemId || null;
          let advertId = row.advertId || null;
          let extraDate = row.finishTime.substring(0, 4) + row.finishTime.substring(5, 7) + row.finishTime.substring(8, 10);
          let str = '<a class="mr10" target="_blank" data-time="' + extraDate + '"@click="detail(' + itemId + ',' + advertId + ',' + extraDate + ')">查看详情</a>';
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
      this.getSlotdataList(this.params);
    },
    detail(itemId, advertId, extraDate) {
      let extraDateStr = extraDate.toString();
      this.$router.go({
        path: '/qiho/show/realtimedata',
        query: {
          itemId: itemId,
          advertId: advertId,
          extraDate: extraDateStr.substring(0, 4) + '-' + extraDateStr.substring(4, 6) + '-' + extraDateStr.substring(6, 8)
        }
      });
    }
  }
};
