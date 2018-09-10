<template>
  <div class="chart-list-edit">
    <div class="title-area cf title-area-no-top">
      <span class="title-name">报表管理</span>
      <div class="fr">
        <d-button size="large" type="primary" @click="addLib(data.id, 'top1')">添加一级目录</d-button>
      </div>
    </div>
    <div class="chart-search-area">
      <div class="form-filter-group cf">
          <p class="filter-label fl  filter-label-chart-search">报表搜索：</p>
          <input type="text" class="form-control fl" placeholder="请输入表名" v-model="queryName">
      </div>
      <div class="serch-btn">
        <d-button class="searchfilter" size="large" type="primary" @click="getChartList" >查询</d-button>
      </div>
    </div>
    <div class="chartList">
      <template v-for="item in data.list">
        <div class="title-area cf">
          <span class="title-name">{{item.categoryName}}</span>
          <div class="fr">
            <d-button size="large" type="primary" @click="addLib(item.id, 'top2', item.categoryName)">添加二级目录</d-button>
          </div>
        </div>
        <template v-for="meta in item.list">
          <div class="title-area cf title-area-no-bottom-line">
            <span class="title-name">{{meta.categoryName}}</span>
            <div class="fr">
              <div class="action">
                <span class="iconhandle edit" @click="addLib(meta.id, 'edit', meta.categoryName)">&#xe601;</span>
                <span class="iconhandle del" @click="openDelLibModal(meta)">&#xe61d;</span>
              </div>
            </div>
          </div>
          <div class="chart-panel" v-for="metaitem in meta.queryList">
            <a v-link="{ path: '/chart/tableview/' + metaitem.chartQueryId}" target="_blank">
              <span>{{metaitem.queryName}}</span>
            </a>
            <div class="action">
              <a v-link="{ path: '/chart/add/' + metaitem.chartQueryId}" target="_blank" class="iconhandle edit">&#xe601;</a>
              <a class="iconhandle del" @click="openDelChartModal(metaitem)">&#xe61d;</a>
            </div>
          </div>
        </template>
      </template>
    </div>
    <component :is="addLibView" :obj="addLibObj" :show.sync="addLibObj.show" :on-ok="closeLib"></component>
    <component :is="delLibView" :obj="delLibObj" :show.sync="delLibObj.show" :on-ok="delLib" ></component>
    <component :is="delChartView" :obj="delChartObj" :show.sync="delChartObj.show" :on-ok="delChart"></component>
    <loading :show="$loadingRouteData"></loading>
  </div>
</template>
<script>
import addlibModal from './components/addlibModal';
import confimModal from './components/confimModal';
import MessageBox from 'components/basic/MessageBox';
export default {
  components: {
    addlibModal,
    confimModal
  },
  route: {
    data(transition) {
      this.getChartList(transition);
    }
  },
  data() {
    return {
      addLibView: '',
      addLibObj: {
        show: false,
        categoryName: '',
        name: '',
        parentId: ''
      },
      delLibView: '',
      delLibObj: {
        show: false,
        name: '',
        id: ''
      },
      delChartView: '',
      delChartObj: {
        show: false,
        name: '',
        id: ''
      },
      data: {
        count: 0
      },
      queryName: '',
      params: {
        pageNum: 1,
        pageSize: 12,
        queryName: ''
      }
    };
  },
  methods: {
    // 后期feature
    // onPageChange(page) {
    //   this.params.pageNum = page;
    //   this.getChartList();
    // },
    getChartList() {
      this.$loadingRouteData = true;
      this.$http.get(`/chart/category/list?queryName=${this.queryName}&type=6`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
          this.$loadingRouteData = false;
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    addLib(id, type, name) {
      this.addLibView = '';
      this.addLibObj = {
        categoryName: '',
        name: name,
        parentId: id,
        type: type,
        show: true
      };
      if (type === 'edit') {
        this.addLibObj.categoryName = name;
      }
      this.$nextTick(() => {
        this.addLibView = 'addlibModal';
      }, 1);
    },
    closeLib() {
      this.addLibObj.show = false;
      this.getChartList();
    },
    // 删除类目
    openDelLibModal(data) {
      this.delLibView = '';
      this.$nextTick(() => {
        this.delLibView = 'confimModal';
        this.delLibObj = {
          show: true,
          name: data.categoryName,
          id: data.id
        };
      });
    },
    delLib(id) {
      this.$http.get(`/chart/category/remove?id=${id}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '删除成功！',
              type: 'success'
            });
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
          this.$loadingRouteData = false;
          // 关闭确认框
          this.delLibObj.show = false;
          this.getChartList();
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    // 删除图表
    openDelChartModal(data) {
      this.delChartView = '';
      this.$nextTick(() => {
        this.delChartView = 'confimModal';
        this.delChartObj = {
          show: true,
          name: data.queryName,
          id: data.chartQueryId
        };
      });
    },
    delChart(id) {
      this.$http.get(`/chart/delete?chartQueryId=${id}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '删除成功！',
              type: 'success'
            });
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
          this.$loadingRouteData = false;
          // 关闭确认框
          this.delChartObj.show = false;
          this.getChartList();
        },
        res => {
          this.$loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.chart-list-edit {
  .chart-panel {
    margin: 10px;
    height: 140px;
    width: 140px;
    background-color: #ff795c;
    color: #fff;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    transition: all .2s linear;
    a {
      color: #fff;
      display: inline-block;
      width: 140px;
      height: 100%;
      overflow: hidden;
      span {
        display: inline-block;
        position: relative;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        word-wrap: break-word;
        word-break: normal;
      }
    }
    &:hover {
      -webkit-box-shadow: 0 15px 30px rgba(0,0,0,0.2);
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
      -webkit-transform: translate3d(0, -2px, 0);
      transform: translate3d(0, -2px, 0)
    }
  }
  .action {
    color: #bbb;
    margin: 10px 0;
    cursor: pointer;
    a {
      padding: 6px;
      display: inline-block;
      width: auto;
      color: #bbb;
    }
    span {
      padding: 6px;
    }
    .edit:hover {
      color:#29b6b0;
    }
    .del:hover {
      color: #ff795c;
    }
  }
  .chartList {
    margin-bottom: 10px;
  }
  .title-area {
    font-size: 18px;
    font-weight: bold;
    line-height: 34px;
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 10px;
    margin-top: 60px;
    &.title-area-no-top {
      margin-top: 0px;
    }
    &.title-area-no-bottom-line {
      border-bottom: 0;
    }
  }
  .chart-search-area {
    padding-top: 20px;
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      line-height: 1;
      .filter-label{
        font-size: 14px;
        font-weight: bold;
        color: #444;
        width: 100px;
        text-align: right;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
      }
      .filter-label-chart-search {
        width: 70px;
      }
      .form-control {
        width: 200px;
        margin-right: 15px;
      }
    }
  }
}
.form-filter-group {
  margin-bottom: 18px;
  float: left;
  .filter-label-add {
    padding: 0 6px;
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 100px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .form-control-input {
    width: 160px;
    margin-right: 30px;
  }
  .datepicker-input {
    width: 160px !important;
  }
  .iconhandle {
    right: 26px !important;
  }
  .select-group {
    width: 160px;
    margin-right: 30px;
  }
}
</style>


