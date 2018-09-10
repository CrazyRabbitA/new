import convertUtils from 'components/utils/convertUtils';

export default {
  data() {
    let columns = [
      {
        title: '出券顺序',
        key: 'times',
        sortable: 'custom',
        width: 130
      },
      {
        title: '发券量',
        key: 'launchCount',
        sortable: 'custom',
        width: 130
      },
      {
        title: '点击量',
        key: 'clickCount',
        sortable: 'custom',
        width: 130
      },
      {
        title: '点击率',
        key: 'clickRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '预估点击收益',
        key: 'estiClickProfit',
        sortable: 'custom',
        width: 130
      },
      {
        title: '消耗',
        key: 'adConcume',
        sortable: 'custom',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.adConcume);
        }
      },
      {
        title: '预估ARPU',
        key: 'estiArpu',
        sortable: 'custom',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.estiArpu);
        }
      },
      {
        title: 'ARPU',
        key: 'arpu',
        sortable: 'custom',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.arpu);
        }
      },
      {
        title: '下单量',
        key: 'orderCount',
        sortable: 'custom',
        width: 130
      },
      {
        title: '下单率',
        key: 'orderRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '24小时下单率方差',
        key: 'varHourSuc',
        sortable: 'custom',
        width: 200
      },
      {
        title: '三日下单率方差',
        key: 'var3Suc',
        sortable: 'custom',
        width: 200
      },
      {
        title: '七日下单率方差',
        key: 'var7Suc',
        sortable: 'custom',
        width: 200
      },
      {
        title: 'CPA',
        key: 'cpa',
        sortable: 'custom',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.cpa);
        }
      },
      {
        title: '出单量',
        key: 'issueCount',
        sortable: 'custom',
        width: 130
      },
      {
        title: '出单率',
        key: 'issueRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '保底签收率',
        key: 'keepSuccessRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '总签收量',
        key: 'successCt',
        sortable: 'custom',
        width: 130
      },
      {
        title: '订单完成率',
        key: 'orderCompleteRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '预估总签收率',
        key: 'estiSuccessRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '总签收率',
        key: 'successRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: 'ROI',
        key: 'itemRoi',
        sortable: 'custom',
        width: 130
      },
      {
        title: '三日ROI方差',
        key: 'var3Roi',
        sortable: 'custom',
        width: 200
      },
      {
        title: '七日ROI方差',
        key: 'var7Roi',
        sortable: 'custom',
        width: 200
      },
      {
        title: '次日地区签收率',
        key: 'onedaySuccessRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '三日地区签收率',
        key: 'threedaySuccessRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '五日地区签收率',
        key: 'fivedaySuccessRate',
        sortable: 'custom',
        width: 130
      },
      {
        title: '其他地区签收率',
        key: 'otherSuccessRate',
        sortable: 'custom',
        width: 130
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
      this.getCouponList(this.params);
    }
  }
};
