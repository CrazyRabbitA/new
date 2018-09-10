<template>
  <div class="chart-list-edit">
     <div class="go-area-warp" v-if="isShowAnchor">
      <template  v-for="item in lists">
        <span  @click="goAnchor('#'+item.categoryName)">{{item.categoryName}}</span>
      </template>
    </div>
    <div class="chart-search-area">
      <div class="form-filter-group cf">
          <input type="text" class="form-control fl" placeholder="请输入表名" v-model="queryName">
      </div>
      <div class="serch-btn">
          <d-button class="searchfilter" size="large" type="primary" @click="getChartList" >查询</d-button>
      </div>
    </div> 
    <div class="chartList">
      <template v-for="item in data.list">
        <template v-for="meta in item.list">
          <div class="title-area cf title-area-no-bottom-line">
            <span class="title-name" :id="meta.categoryName">{{meta.categoryName}}</span>
          </div>
          <div class="chart-panel" v-for="metaitem in meta.queryList">
            <a v-link="{ path: url + metaitem.chartQueryId}" target="_blank">
              <span>{{metaitem.queryName}}</span>
            </a>
          </div>
        </template>
      </template>
    </div>
    <loading :show="loadingRouteData"></loading>
  </div>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
export default {
  ready() {
    this.getChartList();
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: ''
    }
  },
  data() {
    return {
      isShowAnchor: false,
      loadingRouteData: false,
      queryName: '',
      data: {
        count: 0
      },
      lists: [],
      params: {
        pageNum: 1,
        pageSize: 12
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
      this.loadingRouteData = true;
      this.$http.get(`/chart/category/list?queryName=${this.queryName}&type=${this.type}`, {}).then(
        res => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
            if (this.data.list.length > 0 && this.data.list[0].list.length > 0) {
              this.lists = this.data.list[0].list;
            }
            this.isShowAnchor = true;
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
          this.loadingRouteData = false;
        },
        res => {
          this.loadingRouteData = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    goAnchor(selector) {
      var anchor = this.$el.querySelector(selector);
      document.documentElement.scrollTop = anchor.offsetTop;
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
.go-area-warp {
  display: inline-flex;
  border: 1px solid #ccc;
  span {
    display: inline-block;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    background-color: #efefef;
    border-right: 1px solid #ccc;
    cursor: pointer;
    &:hover {
     color: #ef6b3b;
     background: #fff;
    }
    &:nth-last-child(1){
      border-right: none;
    } 
  }
}
</style>


