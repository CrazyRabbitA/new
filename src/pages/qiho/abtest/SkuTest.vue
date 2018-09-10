<template>
  <div class="reports-search-area">
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label">报表时间段：</p>
        <daterangepicker :start.sync="params.startDate" formats="yyyy-MM-dd" :error-show.sync="errorShow"  :end.sync="params.endDate" :disabled-date="disabledDate" width="190px"></daterangepicker>
      </div>
      <div class="form-filter-group">
        <p class="filter-label">商品Id：</p>
        <input type="text" class="form-control" v-model="params.itemId">
      </div>
      <div class="report-search-warp cf">
        <div class="form-filter-group">
            <d-button size="large" :disabled="errorShow" @click="downTable" class="report-search d-button--qiho">导出</d-button>
        </div>
        <div class="form-filter-group">
            <d-button size="large" :disabled="errorShow" @click="getDataList" class="report-down d-button--qiho">筛选</d-button>
        </div>
      </div>  
    </div>    
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label long">测试计划名称：</p>
        <input type="text" class="form-control" v-model="params.planName">
      </div>
    <div>
  <div>
  
  <div class="report-table-area">
    <div class="table-warp">
      <table>
        <thead>
          <tr class="tr-header tr-header-right">
            <template v-for="colum in columns">
              <th v-if="colum.width" :width="colum.width">{{colum.title}}</th>
              <th v-else>{{colum.title}}</th>
            </template>
          </tr>
        </thead>
        <tbody v-if=" data && data.length !== 0">
          <tr class="tr-items tr-items-right" v-for="(index, item) in data" track-by="$index">
            <template v-for="column in columns">
              <td v-if="column.render">{{column.render(item[column.dataIndex])}}</td>
              <td v-else>{{item[column.dataIndex]}}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <tableempty v-if="!$loadingRouteData && (data && data.length === 0)"></tableempty>
    <d-pagination :total="totalList" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange"></d-pagination>
  </div>
  <loading :show="$loadingRouteData"></loading>
</template>
<script>
import dateUtil from 'components/utils/getCurDate';
import MessageBox from 'components/basic/MessageBox';
const columns = [
  {
    title: '日期',
    dataIndex: 'curDate',
    width: 100
  },
  {
    title: '测试计划ID',
    dataIndex: 'planId'
  },
  {
    title: '测试计划名称',
    dataIndex: 'planName',
    width: 180
  },
  {
    title: '商品ID',
    dataIndex: 'itemId'
  },
  {
    title: '商品名称',
    dataIndex: 'itemName',
    width: 180
  },
  {
    title: 'SKU组ID',
    dataIndex: 'skuId'
  },
  {
    title: 'SKU组名称',
    dataIndex: 'skuName',
    width: 180
  },
  {
    title: '详情ID',
    dataIndex: 'detialId'
  },
  {
    title: '详情名称',
    dataIndex: 'detialName',
    width: 180
  },
  {
    title: '皮肤ID',
    dataIndex: 'skinId'
  },
  {
    title: '皮肤名称',
    dataIndex: 'skinName',
    width: 180
  },
  {
    title: '商品曝光量',
    dataIndex: 'expPv'
  },
  {
    title: '停留时长',
    dataIndex: 'stayDuration'
  },
  {
    title: '浏览长度',
    dataIndex: 'scanDuration'
  },
  {
    title: '跳失率',
    dataIndex: 'drumpRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)).toFixed(1) + '%';
    }
  },
  {
    title: '下单量',
    dataIndex: 'orderCount'
  },
  {
    title: '下单率',
    dataIndex: 'orderRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)).toFixed(2) + '%';
    }
  },
  {
    title: '采购价',
    dataIndex: 'cost'
  },
  {
    title: '售价',
    dataIndex: 'price'
  },
  {
    title: '预估签收率',
    dataIndex: 'estiSuccessRate',
    render: (text) => {
      return parseFloat((text * 100).toPrecision(12)).toFixed(2) + '%';
    }
  },
  {
    title: '平均下单收益（CPA)',
    dataIndex: 'avgCpa'
  },
  {
    title: '点击收益',
    dataIndex: 'estiClickProfit'
  },
  {
    title: '收益ARPU',
    dataIndex: 'estiArpu'
  },
  {
    title: 'ROI',
    dataIndex: 'roi'
  }
];
export default {
  data() {
    return {
      data: [],
      isCanfetch: false,
      totalList: 0,
      columns: columns,
      params: {
        pageNum: 1,
        pageSize: 20,
        planName: '',
        itemId: '',
        startDate: this.getOrderDate(1),
        endDate: this.getOrderDate(1)
      }
    };
  },
  methods: {
    /**
     * 订单时间设置
     */
    getOrderDate(offset) {
      var myDate = new Date();
      myDate.setDate(myDate.getDate() - offset);
      return dateUtil({
        date: myDate
      });
    },
     /**
      * 订单时间禁选今天以后的时间
      */
    disabledDate: function(date) {
      var now = new Date();
      return date.getTime() > (now.getTime() - 24 * 60 * 60 * 1000);
    },
    /**
     * 分页
     */
    onPageChange(val) {
      // 当前页不发送请求
      if (val === this.params.pageNum) {
        return;
      }
      this.params.pageNum = val;
      this.getDataList();
    },
    checkinput() {
      this.isCanfetch = false;
      if (!/^[0-9]*$/.test(this.params.itemId) && this.params.itemId) {
        MessageBox({
          title: '请输入正确的商品Id！',
          type: 'error'
        });
        return;
      }
      this.isCanfetch = true;
    },
    downTable() {
      this.checkinput();
      if (!this.isCanfetch) {
        return;
      }
      let goLink = `/sku/abtest/download?startDate=${this.params.startDate}&endDate=${this.params.endDate}&itemId=${this.params.itemId}&planName=${this.params.planName}`;
      window.open(goLink);
    },
    getDataList() {
      this.checkinput();
      if (!this.isCanfetch) {
        return;
      }
      this.$loadingRouteData = true;
      this.$http.post('/sku/abtest', this.params).then((res) => {
        res = res.json();
        this.$loadingRouteData = false;
        if (res.success) {
          this.$set('data', res.data.list);
          this.totalList = res.data.count;
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
    }
  }
};
</script>
<style lang="less" scoped>
.reports-search-area {
    padding: 20px 0 0 0;
    .form-filter-group {
        margin-bottom: 18px;
        float: left;
        .filter-label {
            font-size: 14px;
            font-weight: bold;
            color: #444;
            width: 84px;
            text-align: right;
            display: inline-block;
            margin-top: 10px;
            &.long {
              width: 120px;
              text-align: left;
            }
        }
        .form-control {
            width: 120px;
            display: inline-block;
            margin-right: 10px;
        }
        .datepicker-input {
            width: 160px !important;
        }
        .iconhandle {
            right: 26px !important;
        }
    }
    .report-search-warp {
      position: relative;  
      display: inline-block;
      right: -125px;
      .report-search {
        position: absolute;
        height: 80px;
        width: 80px;        
      }
      .report-down {
        position: absolute;
        height: 80px;
        width: 80px;
        right: 30px;     
      }
    }
}
.report-table-area {
  .table-warp {
    width: 100%;
    overflow-X: scroll;
    table {
      width: 2100px;
    }
    .tr-header-right {
      th {
        text-align: right;
        padding-right: 10px;      
      }
      th:first-child{
        text-align: right;
        padding-left: 0px;
        padding-right: 36px;      
      }
    }
    .tr-items-right {
      td {
        text-align: right;
        padding-right: 10px;
      }
      td:first-child {
        padding-left: 0px;
      }
    }
  }
}
.table-warp::-webkit-scrollbar {
  height: 5px !important;
}
</style>