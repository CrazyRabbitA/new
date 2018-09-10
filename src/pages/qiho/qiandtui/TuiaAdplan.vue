<template>
  <div class="cx">
    <div class="form-inline bottomline tuiafilter filter-style">
      <div class="form-filter-group">
        <p class="filter-label short label-required">商品Id：</p>
        <input type="text" class="form-control" v-model="params.itemId">
      </div>
      <div class="form-filter-group">
        <p class="filter-label long">订单创建时间：</p>
        <datepicker :value.sync="params.curDate" placeholder="年月日" :disabled-date="disabledDate"></datepicker>
      </div>
      <div class="form-filter-group">
        <d-button size="large" :disabled="errorShow" @click="filterAdplan" class="margin8 d-button--qiho wide-button">筛选</d-button>
      </div>
    </div>
  </div>
  <div class="listTable">
    <div class="cf tooltip-container">
      <d-tooltip placement="left" content="发券量：推啊发券量<br>
                                         点击量：推啊点击量<br>
                                         点击率：点击量 / 发券量<br>
                                         预估点击收益：（（订单价格-订单成本）*预估总签收率-7.5元*下单量）*下单率*出单率<br>
                                         消耗：推啊消耗<br>
                                         ARPU：消耗 / 发券量<br>
                                         预估ARPU: 预估点击收益*点击率,分<br>
                                         下单量：奇货下单量<br>
                                         下单率：下单量 / 点击量<br>
                                         24小时下单率方差：24小时下单率标准差 / 24小时平均下单率<br>
                                         三日下单率方差：三日下单率标准差 / 三日平均下单率<br>
                                         七日下单率方差：七日下单率标准差 / 七日平均下单率<br>
                                         CPA：消耗 / 下单量<br>
                                         出单量：奇货审核通过订单量<br>
                                         出单率：出单量 / 下单量<br>
                                         总签收量：总签收成功订单量<br>
                                         预估总签收率：在T+2到T+5依据实际的总签收率计算&更新预估总签收率<br>
                                         T+2，=1.703686*总签收率+0.362999<br>
                                         T+3，=1.391289*总签收率+0.136649<br>
                                         T+4，=1.063638*总签收率+0.096429<br>
                                         T+5，=0.944633*总签收率+0.097241<br>
                                         总签收率：总签收成功订单量 / 出单量<br>
                                         ROI：（签收订单金额 - 签收订单成本 - 出单量 * 7.5）/ 消耗<br>
                                         三日ROI方差：三日ROI标准差 / 三日平均ROI<br>
                                         七日ROI方差：七日ROI标准差 / 七日平均ROI<br>
                                         次日地区签收率：次日地区签收成功订单量 / 次日地区出单量<br>
                                         三日地区签收率：三日地区签收成功订单量 / 三日地区出单量<br>
                                         五日地区签收率：五日地区签收成功订单量 / 五日地区出单量<br>
                                         其他地区签收率：其他地区签收成功订单量 / 其他地区出单量">
        <d-button type="text" class="instruction">?</d-button>
      </d-tooltip>
    </div>
    <div class="tabCont">
      <table class="process-table table-goods-list" v-if="data">
        <thead>
        <tr class="tr-header first-table">
          <th width="180">广告计划Id</th>
          <th width="450">广告计划名称</th>
          <th width="130">发券量</th>
          <th width="130">点击量</th>
          <th width="130">点击率</th>
          <th width="200">预估点击收益</th>
          <th width="130">消耗</th>
          <th width="200">预估ARPU</th>
          <th width="130">ARPU</th>
          <th width="130">下单量</th>
          <th width="130">下单率</th>
          <th width="200">24小时下单率方差</th>
          <th width="200">三日下单率方差</th>
          <th width="200">七日下单率方差</th>
          <th width="130">CPA</th>
          <th width="130">出单量</th>
          <th width="130">出单率</th>
          <th width="180">保底签收率</th>
          <th width="130">总签收量</th>
          <th width="180">订单完成率</th>
          <th width="200">预估总签收率</th>
          <th width="130">总签收率</th>
          <th width="100">ROI</th>
          <th width="200">三日ROI方差</th>
          <th width="200">七日ROI方差</th>
          <th width="180">次日地区签收率</th>
          <th width="180">三日地区签收率</th>
          <th width="180">五日地区签收率</th>
          <th width="180">其他地区签收率</th>
          <th width="140">查看</th>
          <th width="50"></th>
        </tr>
        </thead>
        <tbody v-for="(index,item) in data" >
        <tr class="tr-items first-table">
          <td>{{ item.advertId }}</td>
          <td>{{ item.advertName }}</td>
          <td>{{ item.launchCount }}</td>
          <td>{{ item.clickCount }}</td>
          <td>{{ item.clickRate }}</td>
          <td>{{ item.estiClickProfit }}</td>
          <td>{{ item.adConcume | rmbDisplay }}</td>
          <td>{{ item.estiArpu | rmbDisplay }}</td>
          <td>{{ item.arpu | rmbDisplay }}</td>
          <td>{{ item.orderCount }}</td>
          <td>{{ item.orderRate }}</td>
          <td>{{ item.varHourSuc }}</td>
          <td>{{ item.var3Suc }}</td>
          <td>{{ item.var7Suc }}</td>
          <td>{{ item.cpa | rmbDisplay }}</td>
          <td>{{ item.issueCount  }}</td>
          <td>{{ item.issueRate  }}</td>
          <td>{{ item.keepSuccessRate }}</td>
          <td>{{ item.successCt  }}</td>
          <td>{{ item.orderCompleteRate }}</td>
          <td>{{ item.estiSuccessRate }}</td>
          <td>{{ item.successRate  }}</td>
          <td>{{ item.itemRoi }}</td>
          <td>{{ item.var3Roi }}</td>
          <td>{{ item.var7Roi }}</td>
          <td>{{ item.onedaySuccessRate  }}</td>
          <td>{{ item.threedaySuccessRate  }}</td>
          <td>{{ item.fivedaySuccessRate  }}</td>
          <td>{{ item.otherSuccessRate }}</td>
          <td><a v-link="{ path: '/qiho/tuia/advtime/' + params.itemId + '/' + item.advertId + '/' + params.curDate  }" target="_blank">广告小时数据</a></td>
          <td v-if="!item.open"><d-button type="primary" size="small" class="ml10" @click="openProcess(item)">+</d-button></td>
          <td v-else><d-button type="primary" size="small" class="ml10" @click="closeProcess(item)">-</d-button></td>
        </tr>
        <tr class="tr-items sec-table-container" v-show="item.open">
          <td :colspan="columns.length">
            <i-table width="100%" :columns="columnsList[index]" :data="item.packages" @on-sort-change="sortchange" :class="['table-goods-list']"></i-table>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import MessageBox from 'components/basic/MessageBox';
  import dcMixins from './mixins/DatacenterMixins';
  import dateUtil from 'components/utils/getCurDate';
  import adplanTableMixins from './mixins/adplanTableMixins';

  export default {
    mixins: [dcMixins, adplanTableMixins],
    data() {
      return {
        data: {},
        params: {
          advertId: '',
          pageNum: 1,
          pageSize: 200,
          itemId: '',
          curDate: this.getOrderDate()
        }
      };
    },
    route: {
      data: function(transition) {
        if (this.$route.params.id) {
          this.params.curDate = this.$route.params.orderDate;
          this.params.itemId = this.$route.params.id;
          this.getTuiaAdPlans(this.params, transition);
        }
      }
    },
    methods: {
      /**
       * 广告计划过滤
       */
      filterAdplan: function() {
        this.params.advertId = '';
        if (this.params.itemId) {
          this.getTuiaAdPlans(this.params);
        } else {
          MessageBox({
            title: '请输入商品Id',
            type: 'error'
          });
        }
      },
      getTuiaAdPlans(options, transition) {
        this.$http.post('/logistics/queryAdvertStatisticsDayPage', options).then((res) => {
          res = res.json();
          if (res.success) {
            let data = this.convertData(res.data);
            this.$set('columnsList', this.getColumnsList(data));
            if (transition) {
              transition.next({
                'data': data
              });
            } else {
              this.$set('data', data);
            }
          } else {
            MessageBox({
              title: '请求错误！',
              type: 'error'
            });
          }
        }, () => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      sortTuiaAdPlans(options) {
        this.$http.post('/logistics/queryAdvertStatisticsDayPage', options).then((res) => {
          res = res.json();
          if (res.success) {
            let data = this.convertData(res.data);
            // 当前排序的表格序号
            let index = 0;
            for (let i = 0, length = data.length; i < length; i++) {
              if (data[i].advertId === options.advertId) {
                index = i;
                break;
              }
            }
            this.$set('data[' + index + '].packages', data[index].packages);
          } else {
            MessageBox({
              title: '请求错误！',
              type: 'error'
            });
          }
        }, () => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      /**
       * 订单创建时间设置为前一天
       */
      getOrderDate: function() {
        let myDate = new Date();
        myDate.setDate(myDate.getDate() - 1);
        return dateUtil({
          date: myDate
        });
      },
      /**
       * 订单时间禁选今天以后的时间
       */
      disabledDate: function(date) {
        let now = new Date();
        return date.getTime() > now.getTime();
      },
      /**
       * 转换数据
       */
      convertData(data) {
        let result = data;
        for (let item of result) {
          item.process = [];
          item.open = true;
          item.clickRate = this.toPercent(item.clickRate);
          item.orderRate = this.toPercent(item.orderRate);
          item.issueRate = this.toPercent(item.issueRate);
          item.successRate = this.toPercent(item.successRate);
          item.onedaySuccessRate = this.toPercent(item.onedaySuccessRate);
          item.threedaySuccessRate = this.toPercent(item.threedaySuccessRate);
          item.fivedaySuccessRate = this.toPercent(item.fivedaySuccessRate);
          item.otherSuccessRate = this.toPercent(item.otherSuccessRate);
          // 保底签收率
          item.keepSuccessRate = this.toPercent(item.keepSuccessRate);
          item.orderCompleteRate = this.toPercent(item.orderCompleteRate);
          // 预估签收成功率
          item.estiSuccessRate = this.toPercent(item.estiSuccessRate);
          for (let info of item.packages) {
            info.clickRate = this.toPercent(info.clickRate);
            info.orderRate = this.toPercent(info.orderRate);
            info.issueRate = this.toPercent(info.issueRate);
            info.successRate = this.toPercent(info.successRate);
            info.onedaySuccessRate = this.toPercent(info.onedaySuccessRate);
            info.threedaySuccessRate = this.toPercent(info.threedaySuccessRate);
            info.fivedaySuccessRate = this.toPercent(info.fivedaySuccessRate);
            info.otherSuccessRate = this.toPercent(info.otherSuccessRate);
            // 保底签收率
            info.keepSuccessRate = this.toPercent(info.keepSuccessRate);
            info.orderCompleteRate = this.toPercent(info.orderCompleteRate);
            // 预估签收成功率
            info.estiSuccessRate = this.toPercent(info.estiSuccessRate);
          }
        }
        return result;
      },
      getColumnsList: function(data) {
        let result = [];
        let temp;
        let tempList;
        for (let item of data) {
          tempList = [];
          for (let c of this.columns) {
            temp = Object.assign({advertId: item.advertId}, c);
            tempList.push(temp);
          }
          result.push(tempList);
        }
        return result;
      },
      toPercent(point) {
        let str = Number(point * 100).toFixed(2);
        str += '%';
        return str;
      },
      /**
       * 打开广告计划-策略信息
       */
      openProcess(item) {
        item.open = true;
      },
      /**
       * 关闭广告计划-策略信息
       */
      closeProcess(item) {
        item.open = false;
      }
    }
  };
</script>

<style lang="less">
  .datacenter-app{
    .bottomline{
      .form-filter-group{
        .filter-label{
          width: 100px;
        }
        input.form-control {
          float: none;
          width:200px;
        }
        p.filter-label.short{
          width: 70px;
        }
        p.filter-label.long{
          margin-left:8px;
        }
        .margin8{
          margin-left:8px;
        }
      }
    }
    .tuiafilter{
      padding: 20px 0;
    }
    .form-inline .form-control{
      margin-right: 0;
    }
    table.process-table {
      margin-top: 5px;
    }
    .tr-items td {
      padding: 15px 10px 15px 0;
      vertical-align: middle;
    }
    .listTable{
      overflow: hidden;
      .tr-header th {
        padding-right: 20px;
      }
      .tabCont {
        overflow-x: auto;
        white-space: nowrap;
        >table{
          table-layout: fixed;
        }
        .first-table{
          td,th{
            padding-left: 18px!important;
          }
          td,th{
            &:nth-of-type(1){
              padding-left: 40px!important;
            }
          }
        }
      }
      .table-goods {
        margin-top: 5px;
      }
    }
    .sec-table-container{
      .ivu-table-wrapper{
        border: none;
      }
      >td{
        padding: 0!important;
      }
    }
  }
</style>
