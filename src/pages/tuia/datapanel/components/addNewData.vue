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
            <template v-for="(index, item) in columns">
              <th :key=" index ">
                <label class="trade-warp ">
                  {{item.title}}
                </label>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr class="tr-items " v-for="(index,items) in mapArr ">
            <template v-for="column in columns">
              <td v-if="column.render">
                {{column.render(items[column.key])}}
              </td>
              <td v-else>
                <span v-if="column.key === 'id'">
                  <a>{{items.id}}</a>
                </span>
                <span v-else>
                  {{items[column.key]}}
                </span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { _fixNum, getPrecent } from 'components/utils/cheatDataUtils';
import MessageBox from 'components/basic/MessageBox';
let columns = [
  {
    title: '媒体ID',
    key: 'id',
    fixed: 'left',
    width: 80
  },
  {
    title: '媒体名称',
    key: 'appName',
    fixed: 'left',
    width: 100
  },
  {
    title: '分析时段消耗',
    key: 'currentValue',
    width: 110
  },
  {
    title: '对比时段消耗',
    key: 'contrastValue',
    width: 110
  },
  {
    title: '变化值',
    key: 'variation',
    width: 100
  },
  {
    title: '占比',
    key: 'proportion',
    width: 100,
    tooltip: true,
    content: '媒体消耗变化值/大盘消耗变化值',
    render(row, column) {
      return getPrecent(row);
    }
  },
  {
    title: '广告位访问UV影响系数',
    key: 'sdkUvAfModulus',
    width: 120,
    render(row, column) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '每UV券请求影响系数',
    key: 'arcPsuAfModulus',
    width: 115,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '发券成功率影响系数',
    key: 'lcParcAfModulus',
    width: 105,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '付费券占比影响系数',
    key: 'plpPlcAfModulus',
    width: 105,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  },
  {
    title: '付费券arpu值影响系数',
    key: 'acPplpAfModulus',
    width: 120,
    render(row, column, index) {
      if (row === 'NaN') {
        return '-';
      }
      return getPrecent(row);
    }
  }
];
export default {
  ready() {
    this.getData();
  },
  data() {
    return {
      data: {},
      mapArr: [],
      columns
    };
  },
  filters: {
    fixNum(data) {
      if (typeof data === 'number') {
        let stringData = String(data);
        if (stringData.indexOf('.') === -1) {
          return data;
        }
        let arr = stringData.split('.');
        if (arr[1].toString().length < 4) {
          return data;
        }

        return _fixNum(data, 4);
      } else if (data === 'NaN') {
        return '-';
      } else {
        return data;
      }
    }
  },
  methods: {
    search() {
      this.getData();
    },
    download() {
      let url =
        '/ka/table/download?startDate=' +
        this.startDate +
        '&endDate=' +
        this.endDate;
      window.open(url);
    },
    getData() {
      this.$http.get('/ka/newTable').then(
        res => {
          res = res.json();
          if (res.success) {
            this.mapArr = res.data;
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
      position: relative;
      text-align: center;
      white-space: nowrap;
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
      padding: 10px;
    }
  }
  .green {
    color: #2ac993;
  }
}
</style>