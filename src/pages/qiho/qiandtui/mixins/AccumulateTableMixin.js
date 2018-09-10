export default {
  data() {
    let columns = [
      {
        title: '商家名称',
        key: 'merchantName',
        width: 105
      },
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
        width: 80
      },
      {
        title: '广告ID',
        key: 'advertId',
        width: 60,
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
        sortable: true,
        width: 95
      },
      {
        title: '发券量',
        key: 'launchCount',
        sortable: true,
        width: 95
      },
      {
        title: '点击量',
        key: 'clickCount',
        sortable: true,
        width: 95
      },
      {
        title: '下单量',
        key: 'orderCount',
        sortable: true,
        width: 90
      },
      {
        title: 'CTR',
        key: 'ctr',
        sortable: true,
        width: 80
      },
      {
        title: 'CVR',
        key: 'cvr',
        sortable: true,
        width: 80
      },
      {
        title: 'CPC',
        key: 'cpc',
        sortable: true,
        width: 60
      },
      {
        title: 'CPA',
        key: 'cpa',
        sortable: true,
        width: 60
      },
      {
        title: 'ARPU',
        key: 'arpu',
        sortable: true,
        width: 60
      },
      {
        title: '操作',
        width: 80,
        render(row, column, index) {
          let str = '';
          if (index !== 0) {
            let merchantId = row.merchantId || null;
            let itemId = row.itemId || null;
            let advertId = row.advertId || null;
            str = `<a class="mr10" target="_blank" @click="detail(${merchantId},${itemId},${advertId})">查看详情</a>`;
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
    detail(merchantId, itemId, advertId) {
      this.$router.go({
        path: '/qiho/show/realtimedata',
        query: {
          merchantId: merchantId,
          itemId: itemId,
          advertId: advertId,
          extraDate: this.params.extraDate
        }
      });
    }
  }
};
