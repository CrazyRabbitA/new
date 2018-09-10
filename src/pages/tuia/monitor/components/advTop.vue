<template>
  <div class="modal-body">
    <div class="adv-top-list">
      <table class="recommend-list mt10">
        <thead>
          <tr class="tr-header">
            <template v-for="column in columns">
              <th>
                <label class="sort-warp">
                  {{column.title}}
                  <span class="sort-arrow" v-if="column.sortable">
                    <i class="iconhandle sort-icon" :class="{on: params.orderType === 1 && column.id === params.orderBy}" @click="handleSort(column.id, 1)">&#xe618;</i>
                  </span>
                </label>
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-if="data && data.length !== 0">
          <tr class="tr-items" v-for="(index, item) in data" track-by="$index">
            <template v-for="column in columns">
              <template v-if="column.render && item[column.dataIndex]">
                <td>{{column.render(item[column.dataIndex])}}</td>
              </template>
              <template v-else>
                <td v-if="column.dataIndex === 'advertId'">
                  <a v-link="{ path: '/monitor/advRealTime/' + item.advertId }" target="_blank">{{item[column.dataIndex]}}</a>
                </td>
                <td v-else>{{item[column.dataIndex]}}</td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
      <tableempty v-if="data && data.length === 0"></tableempty>
      <d-pagination :total="paging.totalList" :current-page="paging.pageNum" :page-size="paging.pageSize" @change="onPageChange" ></d-pagination>
    </div>
  </div>
</template>

<script>
import MessageBox from 'components/basic/MessageBox';
const _fixNum = function(num) {
  let result = Number(num).toFixed(2);
  if (result) {
    num = num + '';
    let fix = ''; // 小数点情况
    let splitArr = num.split('.');
    num = splitArr[0];
    fix = splitArr[1] ? splitArr[1] : '';
    num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
      return s + ',';
    });
    if (fix) {
      return num + '.' + fix;
    }
    return num;
  }
  return num;
};
const columns = [
  {
    title: '广告ID',
    dataIndex: 'advertId'
  },
  {
    title: '广告名称',
    dataIndex: 'advertName'
  },
  {
    title: '发券量',
    dataIndex: 'launchCount',
    id: 1,
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '曝光量',
    dataIndex: 'exposureCount',
    id: 2,
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '点击量',
    dataIndex: 'clickCount',
    id: 6,
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '计费点击',
    dataIndex: 'efClickCount',
    id: 3,
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  },
  {
    title: '消耗',
    dataIndex: 'consumeTotal',
    id: 4,
    render: text => {
      return _fixNum(text);
    },
    sortable: true
  }
];
export default {
  props: {
    onChange: {
      type: Function,
      default: () => {}
    },
    quotaType: {
      type: [String, Number]
    },
    selectDay: {
      type: String,
      default: ''
    },
    loadshow: {
      type: Boolean,
      default: false
    }
  },
  ready() {
    this.getDataList();
  },
  data() {
    return {
      data: [],
      backupData: [],
      columns: columns,
      paging: {
        pageNum: 1,
        pageSize: 10,
        totalList: 0
      },
      params: {
        orderBy: 4,
        orderType: 1
      }
    };
  },
  methods: {
    getDataList() {
      this.loadshow = true;
      this.$http.get(`/poackage/ads/loading/page/top/list?orderType=${this.params.orderType}&orderBy=${this.params.orderBy}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            this.backupData = res.data;
            this.getPage();
            // 获取页码
            this.paging.totalList = res.data.length;
            this.loadshow = false;
          } else {
            this.loadshow = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          this.loadshow = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    onPageChange(page) {
      this.paging.pageNum = page;
      this.getPage();
    },
    getPage() {
      let start = (this.paging.pageNum - 1) * this.paging.pageSize;
      let end = start + 10;
      this.data = this.backupData.slice(start, end);
    },
    handleSort(orderBy, orderType) {
      if (orderBy === this.params.orderBy && orderType === this.params.orderType) {
        return;
      }
      this.params.orderBy = orderBy;
      this.params.orderType = orderType;
      this.getDataList();
    }
  }
};
</script>
<style lang="less" scoped>
.adv-top-list {
  .sort-warp {
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
        line-height: 1.5;
        &:nth-child(2) {
          top: 6px;
        }
        &:hover {
          color: #000;
        }
        &.on {
          color: #39f;
        }
      }
    }
  }
}
</style>
