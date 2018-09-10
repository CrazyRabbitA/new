<template>
  <div class="page-content">
    <pagetitle title="域名管理" class="title"></pagetitle>
    <d-button class="domain-add"  type="warning" @click="add">添加</d-button>
    <table class="domain-list mt10">
      <thead>
        <tr class="tr-header">
          <template v-for="column in columns">
            <th>{{column.title}}</th>
          </template>
        </tr>
      </thead>
      <tbody v-if="data && data.length !== 0">
        <tr class="tr-items" v-for="(index, item) in data" track-by="$index">
          <template v-for="column in columns">
            <template v-if="column.render">
              <td>{{column.render(item[column.dataIndex])}}</td>
            </template>
            <template v-else>
              <td v-if="column.action">
                <a href="javascript:void(0);" @click="delt(item.id)">删除</a>
                <a href="javascript:void(0);" @click="edit(item)">编辑</a>
              </td>
              <td v-else class="text-max">
                <template v-if="column.dataIndex === 'domain'">
                  {{item[column.dataIndex]}}
                </template>
                <template v-else>
                  <tooltip placement="left" :content="contentFomate(item[column.dataIndex])"
                  type="disable">
                    <a href="javascript:void(0)" class="iconhandle disable">{{item[column.dataIndex]}}</a>
                  </tooltip>
                </template>
              </td>
            </template>  
          </template>
        </tr>
      </tbody>
    </table>
     <tableempty v-if="!$loadingRouteData && (data && data.length === 0)"></tableempty>
    <d-pagination :total="totalList" :current-page="params.pageNum" :page-size="params.pageSize" @change="onPageChange" ></d-pagination>
    <loading :show="$loadingRouteData"></loading>
    <component :is="currentView" :show.sync="show" :domain-edit-obj="domainEditObj" :on-close="close"></component>
  </div>  
</template>
<script>
import domainEditModal from './components/domainEditModel';
import MessageBox from 'components/basic/MessageBox';
import Tooltip from 'components/basic/Tooltip';

const columns = [
  {
    title: '域名',
    dataIndex: 'domain'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '状态',
    dataIndex: 'domainStatus',
    render: (text) => {
      if (text === 1) {
        return '已备案';
      } else if (text === 2) {
        return '已使用';
      } else if (text === 3) {
        return '已弃用';
      } else {
        return '已注册';
      }
    }
  },
  {
    title: '证书',
    dataIndex: 'cert',
    render: (text) => {
      if (text) {
        return '无';
      } else {
        return '有';
      }
    }
  },
  {
    title: '备案',
    dataIndex: 'record',
    render: (text) => {
      if (text) {
        return '个人';
      } else {
        return '企业';
      }
    }
  },
  {
    title: '屏蔽情况',
    dataIndex: 'situation'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    action: true
  }
];
export default {
  components: {
    domainEditModal,
    Tooltip
  },
  route: {
    data: function(transition) {
      this.getDataList();
    }
  },
  data() {
    return {
      data: {},
      columns: columns,
      currentView: 'domainEditModal',
      totalList: 0,
      show: false,
      domainEditObj: {
        cert: 0,
        record: 0,
        domainStatus: 0
      },
      params: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    onPageChange(page) {
      this.params.pageNum = page;
      this.getDataList();
    },
    getDataList() {
      this.$loadingRouteData = false;
      this.$http.post('/domain', this.params
      ).then(
        res => {
          res = res.json();
          if (res.success) {
            // 获取页码
            this.$set('data', res.data.data);
            this.totalList = res.data.count;
            this.$loadingRouteData = false;
          } else {
            this.$loadingRouteData = false;
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
    delt(id) {
      this.$loadingRouteData = false;
      this.$http.post('/domain/remove', {
        id: id
      }).then(
        res => {
          res = res.json();
          if (res.success) {
            // 获取页码
            this.$loadingRouteData = false;
            MessageBox({
              title: '删除成功',
              type: 'success'
            });
            this.getDataList();
          } else {
            this.$loadingRouteData = false;
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
    edit(item) {
      this.domainEditObj = item;
      this.$nextTick(() => {
        this.currentView = 'domainEditModal';
        this.show = true;
      });
    },
    add() {
      this.$nextTick(() => {
        this.currentView = 'domainEditModal';
        this.show = true;
      });
    },
    close() {
      this.show = false;
      this.currentView = '';
      this.domainEditObj = {
        cert: 0,
        record: 0,
        domainStatus: 0
      };
      this.getDataList();
    },
    contentFomate(text) {
      let arr = text.split(',');
      arr = arr.join('<br>');
      return arr;
    }
  }
};
</script>
<style lang="less" scoped>
.domain-add {
  margin-top: 10px;
}
.domain-list {

  .tr-items {
    font-size: 12px !important;
    td {
      padding-top: 15px;
      padding-bottom: 15px;
      .tooltip-inner {
        background-color: #29B6B0 !important;
        color: #fff;
      }
      .tooltip-arrow {
        border-top-color: #29B6B0 !important;
      }
      span {
        .iconhandle {
          font-size: 12px !important;
          color: #444 !important;
          position: relative;
        }
      }
      &.text-max {
        max-width: 45px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
      }
    }
  }
}
</style>


