<template>
  <div class="page-content">
    <pagetitle title="数据源管理" class="title"></pagetitle>
    <d-button class="database-add"  type="warning" @click="add">添加</d-button>
    <table class="database-list mt10">
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
                  {{item[column.dataIndex]}}
              </td>
            </template>
          </template>
        </tr>
      </tbody>
    </table>
     <tableempty v-if="!$loadingRouteData && (data && data.length === 0)"></tableempty>
    <loading :show="$loadingRouteData"></loading>
    <component :is="currentView" :show.sync="show" :obj="databaseEditObj" :on-close="close"></component>
  </div>
</template>
<script>
import dataBaseEditModel from './components/dataBaseEditModel';
import MessageBox from 'components/basic/MessageBox';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '数据源别名',
    dataIndex: 'databaseAlias'
  },
  {
    title: '数据源类型',
    dataIndex: 'driverType',
    render: (text) => {
      if (text === 1) {
        return 'MySQL';
      } else {
        return 'KYLIN';
      }
    }
  },
  {
    title: '操作',
    action: true
  }
];
export default {
  components: {
    dataBaseEditModel
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
      currentView: 'dataBaseEditModel',
      show: false,
      databaseEditObj: {
        databaseName: '',
        url: '',
        databaseUsername: '',
        databasePassword: ''
      },
      params: {

      }
    };
  },
  methods: {
    getDataList() {
      this.$loadingRouteData = false;
      this.$http.get('/chart/database', this.params
      ).then(
        res => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
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
      this.$http.post('/chart/database/remove', {
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
      this.databaseEditObj = item;
      this.$nextTick(() => {
        this.currentView = 'dataBaseEditModel';
        this.show = true;
      });
    },
    add() {
      this.$nextTick(() => {
        this.currentView = 'dataBaseEditModel';
        this.show = true;
      });
    },
    close() {
      this.show = false;
      this.currentView = '';
      this.databaseEditObj = {
        cert: 0,
        record: 0,
        databaseStatus: 0
      };
      this.getDataList();
    }
  }
};
</script>
<style lang="less" scoped>
.database-add {
  margin-top: 10px;
}
.database-list {

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


