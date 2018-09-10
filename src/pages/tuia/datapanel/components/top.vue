<template>
  <d-modal  effect="fade" :title="'当日剩余广告预算TOP榜单：'" :show.sync="show" width="900" class="top-modal budget-top-modal" :on-close="close">
    <template slot="modal-body">
      <div class="modal-body">
    <div class="adv-top-list">
      <table class="recommend-list mt10">
        <thead>
          <tr class="tr-header">
            <template v-for="column in columns">
              <th>
                <label class="sort-warp">
                  {{column.title}}
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
                <td >{{item[column.dataIndex]}}</td>
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
    <template slot="modal-footer">
      <div class="modal-footer">
      </div>
    </template>
  </d-modal>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
import { _fixNum } from 'components/utils/cheatDataUtils';
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
    title: '广告主ID',
    dataIndex: 'accountId'
  },
  {
    title: '广告主名称',
    dataIndex: 'accountName'
  },
  {
    title: '广告剩余预算',
    dataIndex: 'residueBudget',
    id: 1,
    render: text => {
      return _fixNum(text, 2);
    }
  }
];
export default {
  props: {
    show: {
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
      }
    };
  },
  methods: {
    getDataList() {
      this.loadshow = true;
      this.$http.get('/tuia/budget/balance/top/list').then(
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
    }
  }
};
</script>

<style lang="less">
.budget-top-modal {
  .loading {
    border-radius: 5px;
  }
  .row-noresult {
    padding: 50px 0 186px;
  }
  .modal-title {
    margin-bottom: 6px;
  }
  .modal-content {
    padding-left:10px;
    padding-right: 10px;
    height: auto;
    .load-show {
      .loading {
        border-radius: 5px;
      }
    }
  }
}
</style>