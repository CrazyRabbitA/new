<template>
    <div>
        <p class="data-title">
            <span>日期:</span>
            <daterangepicker :error-show.sync="errorShow" :start.sync="startDate" :end.sync="endDate"></daterangepicker>
            <d-button size="large" type="warning" @click="search">查询</d-button>
            <d-button class="download" size="large" type="primary" @click="download">下载</d-button>
        </p>
        <div class="advance-table">
            <table class="recommend-list mt10">
                <thead class="header">
                    <tr class="tr-header">
                        <th>团队</th>
                        <template v-for="(index, item) in mapArr">
                            <th :key="index" :colspan="item[1].length">
                                <label class="trade-warp">
                                    {{item[0]}}
                                </label>
                            </th>
                        </template>
                        <th>总计</th>
                    </tr>
                </thead>
                <tbody v-if="showTable">
                    <tr class="tr-items">
                        <td>行业</td>
                        <template v-for="(index, item) in mapArr">
                            <template v-for="(key, val) in item[1]">
                                <td :key="index">
                                    <label class="trade-warp">
                                        {{val.newTradeName}}
                                    </label>
                                </td>
                            </template>
                        </template>
                        <td></td>
                    </tr>
                    <tr class="tr-items">
                        <td>负责人</td>
                        <template v-for="(index, item) in mapArr">
                            <template v-for="(key, val) in item[1]">
                                <td :key="index">
                                    <label class="trade-warp">
                                        {{val.owner}}
                                    </label>
                                </td>
                            </template>
                        </template>
                        <td></td>
                    </tr>
                    <tr class="tr-items">
                        <td>目标(万元)</td>
                        <template v-for="(index, item) in mapArr">
                            <template v-for="(key, val) in item[1]">
                                <td :key="index">
                                    <label class="trade-warp">
                                        {{val.target}}
                                    </label>
                                </td>
                            </template>
                        </template>
                        <td>{{data.target}}</td>
                    </tr>
                    <tr class="tr-items" v-for="(date,key) in data.sum">
                        <td>{{date}}</td>
                        <template v-for="(index, item) in mapArr">
                            <template v-for="(key, val) in item[1]">
                                <td :key="index">
                                    <label class="trade-warp">
                                        <span :class="{'green': val.consume[tipIndex(date,val.consume)].green}">{{val.consume[tipIndex(date,val.consume)].tradeConsumeTotal}}</span>
                                    </label>
                                </td>
                            </template>
                        </template>
                        <td :class="{'green': key.green}">{{key.tradeConsumeTotal}}</td>
                    </tr>
                    <tr class="tr-items">
                        <td>日均(元)</td>
                        <template v-for="(index, item) in mapArr">
                            <template v-for="(key, val) in item[1]">
                                <td :key="index">
                                    <label class="trade-warp" :class="{'green': val.green}">
                                        {{val.avg}}
                                    </label>
                                </td>
                            </template>
                        </template>
                        <td :class="{'green': data.avg.green}">{{data.avg.tradeConsumeTotal}}</td>
                    </tr>
                </tbody>
            </table>
            <tableempty v-if="!showTable"></tableempty>
        </div>
    </div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
import { formatDate } from 'components/utils/dateUtils';

export default {
  components: {},
  props: {},
  watch: {},
  computed: {},
  ready() {
    this.getData();
  },
  data() {
    return {
      showTable: false,
      data: {},
      mapArr: [],
      startDate: this._getStartDay(formatDate(new Date())),
      endDate: this._getEndDay(formatDate(new Date()))
    };
  },
  methods: {
    fixNum: _fixNum,
    getPrecent: getPrecent,
    _getStartDay(dateStr, type = 7) {
      let start = new Date(dateStr) - 1000 * 60 * 60 * 24 * type;
      return formatDate(start);
    },
    _getEndDay(dateStr) {
      let end = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(end);
    },
    search() {
      this.getData();
    },
    download() {
      // 下载地址拼接
      let url =
        '/ka/table/download?startDate=' +
        this.startDate +
        '&endDate=' +
        this.endDate;
      window.open(url);
    },
    getData() {
      console.log(this.startDate);
      this.$http
        .get(`/ka/table?startDate=${this.startDate}&endDate=${this.endDate}`)
        .then(
          res => {
            // console.dir(res);
            res = res.json();
            if (res.success) {
              this.data = res.data;
              const reg = /[a-zA-Z]/;
              const dataArr = Object.entries(res.data);
              this.mapArr = dataArr.filter(el => !reg.test(el[0]));
              console.log(this.mapArr);
              this.showTable = !!dataArr.length;
            } else {
              MessageBox({
                title: res.desc,
                type: 'error'
              });
            }
          },
          res => {
            MessageBox({
              title: '网络错误！',
              type: 'error'
            });
          }
        );
    },
    tipIndex(key, arr) {
      return arr.findIndex(el => el.curDate === key);
    }
  }
};
</script>
<style lang="less" scoped>
.data-title {
  margin-top: 50px;
}
.download {
  float: right;
}
.advance-table {
  padding-left: 3px;
  overflow: auto;
  .recommend-list {
    width: 100%;
    border-radius: 2px;
    margin-bottom: 20px;
    th {
      // min-width:68px;
      position: relative;
      text-align: center;
      white-space: nowrap;
      border-right: 1px solid #ccc;
      &:last-child {
        border-right: none;
      }
    }
    th:first-child {
      padding-left: 0px !important;
    }
    td {
      min-width: 90px;
      text-align: center;
      div {
        text-align: center;
      }
    }
    td:first-child {
      padding-left: 0px !important;
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
    }
  }
  .green {
    color: #2ac993;
  }
}
</style>