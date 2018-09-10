<template>
<div>
  <div class="advance-table">
    <table class="recommend-list mt10">
      <thead>
        <tr class="tr-header">
            <template v-for="(index, item) in columnsTrade">
              <th :key="index">               
                 <label class="trade-warp">
                    {{item.title}}
                     <d-tooltip v-if="item.tooltip" :content="item.content" type="disable">
                      <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                    </d-tooltip>
                    <span class="sort-arrow" v-if="item.sortable">
                      <i class="iconhandle sort-icon" :class="{on: params.order === 'ASC'}" @click="handleSort('ASC')">&#xe617;</i>
                      <i class="iconhandle sort-icon" :class="{on: params.order=== 'DESC'}" @click="handleSort('DESC')">&#xe618;</i>
                    </span>
                </label>
              </th>
            </template>
             <th>操作</th>
        </tr>
      </thead>
      <tbody v-if="showTable">
        <tr class="tr-items" v-for="(index, item) in backList" :key="index">
          <template v-for="column in columnsTrade" >
            <td  v-if="column.render">
              {{column.render(item[column.dataIndex], item)}}
            </td>
            <td v-else>
              {{item[column.dataIndex]}}
            </td>
          </template>
          <td>
            <a @click="analysisShow(item.trade, item)">分析行业下广告</a>
          </td>
        </tr>
      </tbody>
    </table>
    <tableempty v-if="!showTable"></tableempty>
  </div>
  <advert-modal :show.sync="isShowAnalysisModal" :date-tags-type="dateTagsType" v-ref:advert :url="url" :mark="mark" :obj="params" ></advert-modal>
  <d-pagination v-if="showTable" :total="totalList" :current-page="pageNum" :page-size="pageSize" @change="onPageChange" ></d-pagination>
</div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import advertModal from './advertModal';
import MessageBox from 'components/basic/MessageBox';

const columns = {
  'lcParc': [
    {
      title: '行业',
      dataIndex: 'trade'
    },
    {
      title: '分析时段发券量',
      dataIndex: 'currentValue',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '对比时段发券量',
      dataIndex: 'contrastValue',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '变化值',
      dataIndex: 'variation',
      sortable: true,
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '占比',
      tooltip: true,
      content: '当前维度变化值占总变化值的占比',
      dataIndex: 'proportion',
      render: (row) => {
        return getPrecent(row);
      }
    }
  ],
  'plpPlc': [
    {
      title: '行业',
      dataIndex: 'trade'
    },
    {
      title: '分析时段值',
      dataIndex: 'currentValue',
      render: (row, item) => {
        return `${getPrecent(row)} (${item.quota11}/${item.quota21})`;
      }
    },
    {
      title: '对比时段值',
      dataIndex: 'contrastValue',
      render: (row, item) => {
        return `${getPrecent(row)} (${item.quota12}/${item.quota22})`;
      }
    },
    {
      title: '影响值',
      dataIndex: 'afValue',
      render: (row) => {
        return getPrecent(row);
      }
    },
    {
      title: '影响系数',
      dataIndex: 'afModulus',
      render: (row) => {
        return getPrecent(row);
      }
    }
  ],
  'acPplp': [
    {
      title: '行业',
      dataIndex: 'trade'
    },
    {
      title: '分析时段值',
      dataIndex: 'currentValue',
      tooltip: true,
      content: '括号内百分比为行业消耗占大盘消耗的占比',
      render: (row, record) => {
        return `${_fixNum(row, 4)} (${getPrecent(record.currentAdproportion)})`;
      }
    },
    {
      title: '对比时段值',
      dataIndex: 'contrastValue',
      tooltip: true,
      content: '括号内百分比为行业消耗占大盘消耗的占比',
      render: (row, record) => {
        return `${_fixNum(row, 4)} (${getPrecent(record.contrastAdproportion)})`;
      }
    },
    {
      title: '影响值',
      dataIndex: 'afValue',
      render: (row) => {
        return _fixNum(row, 4);
      }
    },
    {
      title: '影响系数',
      dataIndex: 'afModulus',
      render: (row) => {
        return getPrecent(row);
      }
    }
  ]
};
export default {
  components: {
    advertModal
  },
  props: {
    list: {
      type: Array,
      default: null
    },
    params: {
      type: Object,
      default: {}
    },
    url: {
      type: Object,
      default: null
    },
    mark: {
      type: String,
      default: ''
    }
  },
  watch: {
    list() {
      if (this.list && this.list.length > 0) {
        this.showTable = true;
        this.totalList = this.list.length;
        this.columnsTrade = this.columns[this.mark];
        this.onPageChange(1);
      }
    }
  },
  ready() {
    if (this.list && this.list.length > 0) {
      this.showTable = true;
      this.totalList = this.list.length;
      // this.params.order = '';
      this.columnsTrade = this.columns[this.mark];
      this.onPageChange(1);
    }
  },
  data() {
    return {
      backList: [],
      showTable: false,
      totalList: 0,
      columns: columns,
      columnsTrade: [],
      pageNum: 1,
      pageSize: 10,
      currentUrl: '',
      isShowAnalysisModal: false,
      time: ''
    };
  },
  methods: {
    fixNum: _fixNum,
    getPrecent: getPrecent,
    concatUrl(params) {
      return params;
    },
    onPageChange(page) {
      this.pageNum = page;
      this.getPage();
    },
    handleSort(orderType) {
      this.params.order = orderType;
      this.getDataList();
    },
    getDataList() {
      this.$http.post('/ads/detail', this.params
      ).then((res) => {
        res = res.json();
        if (res.success) {
          this.list = res.data.lcParcTradeAdvert;
          this.onPageChange(1);
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
        this.$loadingRouteData = false;
        MessageBox({
          title: '网络错误！',
          type: 'error'
        });
      });
    },
    analysisShow(trade, item) {
      this.isShowAnalysisModal = true;
      this.$refs.advert.initData(trade, item);
    },
    getPage() {
      let start = (this.pageNum - 1) * this.pageSize;
      let end = start + 10;
      this.backList = this.list.slice(start, end);
    }
  }
};
</script>
<style lang="less" scoped>
.advance-table {
  // overflow-x: auto;
  .recommend-list{
    width: 100%;
    border-radius:2px;
    margin-bottom: 20px;
    th {
      min-width:120px;
      position:relative;
      white-space: nowrap;
      }
    td {
      div {
        text-align: center;
      }
    }
    .td-title {
      border: none;
      vertical-align: middle;
      text-align: center;
    }
    .trade-warp {
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      .sort-arrow {
        display: inline-block;
        height: 20px;
        width: 12px;
        position: relative;
        vertical-align: middle;
        .sort-icon {
          position: absolute;
          display: inline-block;
          font-size: 12px;
          color: #ccc;
          height: 12px;
          line-height: 1;
          &:nth-child(2) {
            top: 6px;
          }
          &:hover {
            color:#29b6b0;
          }
          &.on {
            color: #29b6b0;
          }
        }
      }
    }
    .num {
      width: 80%;
      text-align: right;
      margin: auto;
      transform: translateX(-20%);
    }
  }
}
</style>