import convertUtils from 'components/utils/convertUtils';

export default {
  data() {
    let columns = [
      {
        title: '日期',
        key: 'wholeCurTime',
        width: 150
      },
      {
        title: '发券量',
        key: 'launchCount',
        width: 130
      },
      {
        title: '点击率',
        key: 'clickRate',
        width: 130
      },
      {
        title: '消耗',
        key: 'adConcume',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.adConcume);
        }
      },
      {
        title: 'ARPU',
        key: 'arpu',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.arpu);
        }
      },
      {
        title: '下单量',
        key: 'orderCount',
        width: 130
      },
      {
        title: '下单率',
        key: 'orderRate',
        width: 130
      },
      {
        title: 'CPA',
        key: 'cpa',
        width: 130,
        render(row, column, index) {
          return convertUtils.toRmb(row.cpa);
        }
      },
      {
        title: '出单量',
        key: 'issueCount',
        width: 130
      },
      {
        title: '总签收量',
        key: 'successCt',
        width: 130
      },
      {
        title: '总签收率',
        key: 'successRate',
        width: 130
      },
      {
        title: 'ROI',
        key: 'itemRoi',
        width: 130
      },
      {
        title: '次日签收率',
        key: 'onedayAllRate',
        width: 130
      },
      {
        title: '三日签收率',
        key: 'threedayAllRate',
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
      this.getStatisticList(this.params);
    }
  }
};
