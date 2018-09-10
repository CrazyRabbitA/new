<template>
  <div>
    <d-modal effect="fade" width="1000" :show.sync="show" :slot-id="slotId" class="analysis-modal">
      <template slot="modal-body">
        <div class="modal-title">行业：{{trade}}</div>
        <div class="total">
          <div class="total-title">
            <div class="item">分析时段值</div>
            <div class="item">对比时段值</div>
            <div class="item">变化值</div>
            <div class="item">变化率</div>
          </div>
          <div class="total-con">
            <div class="item">{{headers[mark][0].render(basicData.currentValue)}}   </div>
            <div class="item">{{headers[mark][1].render(basicData.contrastValue)}} </div>
            <div class="item" :class="{ 'green': basicData.variation < 0, 'red': basicData.variation > 0 }">{{headers[mark][2].render(basicData)}}</div>
            <div class="item" :class="{ 'green': basicData.ratio < 0, 'red': basicData.ratio > 0 }">{{getPrecent(basicData.ratio)}}</div>
          </div>
        </div>
        <div class="advert-table">
          <table class="table-advert recommend-list mt10"  v-if="showTable">
            <thead>
              <tr class="tr-header">
                <th>广告ID</th>
                <th>广告名称</th>
                <th>广告类型</th>
                <th>AE</th>
                <template v-for="column in columnsAdvert">
                  <th>{{column.title}}
                      <tooltip v-if="column.tooltip" :content="column.content" type="disable">
                        <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                      </tooltip>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody v-if="data1 && data1.length !== 0">
              <tr class="tr-items" v-for="(index, item) in data1" track-by="$index">
                <td v-if="url.isOnline && item.permisson">
                   <a v-link="{ path: currentUrl + '/' + item.id }" target="_blank">{{item.id}}</a>
                </td>
                <td v-else>
                  {{item.id}}
                </td>
                <td>
                  {{item.advertName}}
                </td>
                 <td>
                  {{item.couponType}}
                </td>
                <td>
                  {{item.name}}
                </td>
                <template v-for="column in columnsAdvert">
                  <template v-if="column.render">
                    <td>
                      <div>{{column.render(item[column.dataIndex], item)}}</div>
                    </td>
                  </template>
                  <template v-else>
                    <td>
                      <div>{{item[column.dataIndex]}}</div>
                    </td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
          <tableempty v-if="!showTable"></tableempty>
        </div>
        <div>
          <d-pagination v-if="showTable" :total="totalList" :current-page="pageNum" :page-size="pageSize" @change="onPageChange" ></d-pagination>
        </div>
      </template>
      <template slot="modal-footer">
        <div class="modal-footer">
        </div>
      </template>
    </d-modal>
    <loading :show="loadingRouteData"></loading>
  </div>
</template>

<script>
import MessageBox from 'components/basic/MessageBox';
import coerceBoolean from 'components/utils/coerceBoolean.js';
import Tooltip from 'components/basic/Tooltip';
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
const headers = {
  'lcParc': [
    {
      title: '分析时段',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '对比时段',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '变化值',
      render: (row) => {
        return _fixNum(row.variation, 0);
      }
    }
  ],
  'plpPlc': [
    {
      title: '分析时段',
      render: (row) => {
        return getPrecent(row);
      }
    },
    {
      title: '对比时段',
      render: (row) => {
        return getPrecent(row);
      }
    },
    {
      title: '变化值',
      render: (row) => {
        return getPrecent(row.variation);
      }
    }
  ],
  'acPplp': [
    {
      title: '分析时段',
      render: (row) => {
        return _fixNum(row, 4);
      }
    },
    {
      title: '对比时段',
      render: (row) => {
        return _fixNum(row, 4);
      }
    },
    {
      title: '变化值',
      render: (row) => {
        return _fixNum(row.variation, 4);
      }
    }
  ]
};
const columns = {
  'lcParc': [
    {
      title: '分析时段发券量',
      dataIndex: 'currentValue',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '对比时段发券量',
      dataIndex: 'contrastValue'
    },
    {
      title: '变化值',
      dataIndex: 'variation',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '占比',
      dataIndex: 'proportion',
      tooltip: true,
      content: '当前维度变化值占总变化值的占比',
      render: (row) => {
        return getPrecent(row);
      }
    }
  ],
  'plpPlc': [
    {
      title: '分析时段值',
      dataIndex: 'quota11',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '对比时段值',
      dataIndex: 'quota12',
      render: (row) => {
        return _fixNum(row, 0);
      }
    },
    {
      title: '影响值',
      dataIndex: 'afValue',
      tooltip: true,
      content: '量化广告对行业付费券占比的影响程度,可理解成广告发券量波动令行业付费券占比上涨/下跌XXX',
      render: (row) => {
        return _fixNum(row, 4);
      }
    },
    {
      title: '影响系数',
      dataIndex: 'afModulus',
      tooltip: true,
      content: '量化广告对行业付费券占比波动的影响程度,算法：当前影响值除以所有影响值的绝对值之和',
      render: (row) => {
        return getPrecent(row);
      }
    }
  ],
  'acPplp': [
    {
      title: '分析时段值',
      dataIndex: 'currentValue',
      tooltip: true,
      content: '括号内百分比为广告消耗占行业消耗的占比',
      render: (row, record) => {
        return `${_fixNum(row, 4)} (${getPrecent(record.currentAdproportion)})`;
      }
    },
    {
      title: '对比时段值',
      dataIndex: 'contrastValue',
      tooltip: true,
      content: '括号内百分比为广告消耗占行业消耗的占比',
      render: (row, record) => {
        return `${_fixNum(row, 4)} (${getPrecent(record.contrastAdproportion)})`;
      }
    },
    {
      title: '影响值',
      dataIndex: 'afValue',
      tooltip: true,
      content: '量化广告对行业付费券arpu值的影响程度,可理解成广告arpu值波动令行业arpu值上涨/下跌XXX',
      render: (row) => {
        return _fixNum(row, 4);
      }
    },
    {
      title: '影响系数',
      dataIndex: 'afModulus',
      tooltip: true,
      content: '量化广告对行业付费券arpu值波动的影响程度,算法：当前影响值除以所有影响值的绝对值之和',
      render: (row) => {
        return getPrecent(row);
      }
    }
  ]
};
const mapping = {
  'lcParc': 'lcParcAdvert',
  'plpPlc': 'plpPlcAdvert',
  'acPplp': 'acPplpAdvert'
};
const mappingBasic = {
  'lcParc': 'lcParcTrade',
  'plpPlc': 'plpPlcTrade',
  'acPplp': 'acPplpTrade'
};

export default {
  components: {
    Tooltip
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    mark: {
      type: String,
      default: ''
    },
    obj: {
      type: Object,
      default: {}
    },
    url: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      totalList: 0,
      loadingRouteData: false,
      columns: columns,
      headers: headers,
      mapping: mapping,
      trade: '',
      mappingBasic: mappingBasic,
      pageNum: 1,
      pageSize: 10,
      showTable: true,
      data1: [],
      data: [],
      basicData: {},
      columnsAdvert: [],
      // 实时监控-广告实时监控
      currentUrl: '/monitor/advRealTime'
    };
  },
  ready() {
    // this.initData();
  },
  methods: {
    initData(trade, item) {
      this.trade = trade;
      this.basicDto = item;
      this.columnsAdvert = this.columns[this.mark];
      this.showTable = false;
      this.data1 = [];
      this.getData();
    },
    getData() {
      this.loadingRouteData = true;
      let jsonBasic = {};
      for (var i in this.basicDto) {
        if (this.basicDto[i] !== null) {
          jsonBasic[i] = this.basicDto[i];
        }
      }
      let markObj = {};
      markObj[this.mark] = jsonBasic;
      this.$http.post('/ads/trade', Object.assign({}, this.obj, {'trade': this.trade}, markObj)).then((res) => {
        res = res.json();
        if (res.success) {
          this.loadingRouteData = false;
          let data = res.data;
          this.data = res.data;

          this.basicData = res.data[mappingBasic[this.mark]];
          // let arr = [];
          // const setName = (obj, name) => {
          //   if (Object.keys(obj).length > 0) {
          //     obj.key = name;
          //     arr.push(obj);
          //   }
          // };
          this.data1 = data[mapping[this.mark]];
          this.totalList = this.data1.length;
          if (this.data1 && this.data1.length > 0) {
            this.showTable = true;
            this.onPageChange(1);
          };
        } else {
          this.loadingRouteData = false;
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, (res) => {
      });
    },
    _fixNum: _fixNum,
    getPrecent(num) {
      return getPrecent(num);
    },
    onPageChange(page) {
      this.pageNum = page;
      this.getPage();
    },
    getPage() {
      let start = (this.pageNum - 1) * this.pageSize;
      let end = start + 10;
      this.data1 = this.data[mapping[this.mark]].slice(start, end);
    }
  }

};
</script>

<style lang="less">
.analysis-modal {
  .green {
    color: #2ac993;
  }
  .red {
    color: red;
  }
  .advert-table {
    // overflow-x: auto;
    padding-top: 25px;
    .tr-header th { 
      position: relative;
      text-align: center;
      padding-right: 40px;
      white-space: nowrap;
    }
    .tr-items{
      td{
        text-align: center;
        padding-right: 40px;
        white-space: nowrap;
      }
    }
  }
  .total {
    padding: 20px 10px;
    padding-bottom: 0px;
    .total-title,
    .total-con {
      width: 100%;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      color: #444;
      .item {
        float: left;
        width: 25%;
        text-align: left;
        font-weight: bold;
      }
    }
    .total-con .item {
      font-size: 24px;
      font-weight: normal;
    }
  }
  .modal-content {
    padding: 0 20px;
    width: 100%;
  }
  .modal-title {
    color: #ef6b3b;
    font-weight: bold;
  }
}
</style>


