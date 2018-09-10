<template>
  <div class="table-content">
    <pagetitle :title="data.chartQuery.queryName" class="table-view-title"></pagetitle>
    <div class="field-warp cf">
      <template v-for="item in backupSearch" track-by="$index">
        <div class="form-filter-group w310" v-if="item.searchType === 6">
          <p class="filter-label fl filter-label-add">{{item.labelName}}：</p>
          <input type="text" class="form-control fl form-control-input" placeholder="请填写" :value="params.search[item.searchName]" @blur="show(item)" @change="show(item)">
        </div>
        <div class="form-filter-group w310" v-if="item.searchType === 5">
          <p class="filter-label fl filter-label-add">{{item.labelName}}：</p>
          <input type="text" class="form-control fl form-control-input" placeholder="请填写" :value="params.search[item.searchName]" @blur="show(item)" @change="show(item)">
        </div>
        <div class="form-filter-group w310" v-if="item.searchType === 4">
            <p class="filter-label fl filter-label-add">{{item.labelName}}：</p>
            <input type="text" class="form-control fl form-control-input" placeholder="请填写" :value="params.search[item.searchName]" @blur="show(item)" @change="show(item)">
        </div>
        <div class="form-filter-group w310" v-if="item.searchType === 3" >
            <p class="filter-label fl filter-label-add">{{item.labelName}}{{getSelect(item)}}：</p>
            <d-select :options.sync="searchItemArr[item.labelName]" :value.sync="params.search[item.searchName]" v-if="isShowSelect"></d-select>
        </div>
        <div class="form-filter-group w310" v-if="item.searchType === 2">
            <p class="filter-label fl filter-label-add">{{item.labelName}}：</p>
            <input type="text" class="form-control fl form-control-input" placeholder="请填写" :value="params.search[item.searchName]" @blur="show(item)" @change="show(item)">
        </div>
        <div class="form-filter-group w310" v-if="item.searchType === 1">
            <p class="filter-label fl filter-label-add">{{item.labelName}}：</p>
            <datepicker :value.sync="params.search[item.searchName]" :disabled-date="disabledDate"  placeholder="选择时间"></datepicker>
        </div>
      </template>
      <d-button v-if="isNotPreview" class="sql-search-btn" size="large" type="primary"  @click="getPage('search')">查询</d-button>
    </div>
    <!-- 子母表维度选择 -->
    <quota-filter :dimension-List.sync="params.dimensionList" :visible-columns="data.visibleColumns" :backup-columns.sync="backupColumns" :dimension="data.dimension" :params="params" :fn="getPage" :dimension-fixed="dimensionFixedChange"></quota-filter>
    <!-- table-start -->
    <div v-if="data.chartQuery.queryType === 1 && data.data">
      <div class="table-warp cf" v-if="data.data.table.length > 0">
        <template v-if="backupColumns.length > 0">
          <i-table width="100%" :height="tableHeight" :columns="backupColumns" :data="tableList" @on-sort-change="sortchange"></i-table>
        </template>
        <paginnation-more v-if="isNotPreview  && enoughlength" :current-page="params.pageNum" :page-size="params.pageSize"  @change="onPageChange"  :total="data.data.count" ></paginnation-more>
        <div class="form-filter-group lie-width">
          <p class="filter-label fl filter-label-add">列宽：</p>
          <input type="text" class="form-control fl form-control-input" placeholder="请设置列宽填写" v-model="columnsWidth" @blur="setClumns">
        </div>
        <a href="javascript:;" v-if="isNotPreview" @click="downTable" class="download fr"><i class="iconhandle mr2">&#xe606;</i>导出</a>
      </div>
      <div class="table-warp" v-if="data.data.table.length === 0">
        <p class="nodata">当前查询对象暂无数据</p>
      </div>
    </div>
    <!--  table-end  -->
    <!--  chart-start -->
    <chart-off-line v-if="data.chartQuery.queryType === 2 && data.data && data.data.chartExt" :nodata="noData" :obj="data.data" :columns="data.columns" v-ref:offresources></chart-off-line>
    <chart-on-line v-if="data.chartQuery.queryType === 3 && data.data && data.data.chartExt" :nodata="noData" :obj="data.data" :columns="data.columns" v-ref:onresources></chart-on-line>
    <!-- chart-end -->
    <loading :show="$loadingRouteData"></loading>
  </div>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
import chartOnLine from './components/chartOnLine';
import chartOffLine from './components/chartOffLine';
import quotaFilter from 'components/common/components/tableView/quotaSelect';
import paginnationMore from 'components/basic/PaginnationMore';
import { deepCopy } from 'components/utils/cheatDataUtils';
import { getItem } from 'components/utils/localStorage.js';
export default {
  components: {
    chartOnLine,
    chartOffLine,
    quotaFilter,
    paginnationMore
  },
  data() {
    return {
      noData: false,
      isNotPreview: false,
      previewParams: {},
      // 是否重新渲染表格头部
      isRenderTableHeard: true,
      backupColumns: [],
      params: {
        // 排序
        order: {},
        chartQueryId: '',
        search: {},
        // group by 子母表维度使用
        dimensionList: [],
        // 子母表指标使用
        columnList: [],
        pageNum: 1,
        pageSize: 15,
        type: 1
      },
      backupSearch: [],
      searchItemArr: {},
      isShowSelect: false,
      columnsWidth: 150,
      tableHeight: 730,
      data: {
        // table
        table: [],
        count: 0,
        extInfo: '',
        // 维度字段
        dimension: [],
        columns: [
          {
            title: '',
            key: ''
          }
        ],
        // 构造指标显示
        visibleColumns: [],
        chartQuery: {}
      },
      // table体验
      tableList: [],
      enoughlength: true
    };
  },
  route: {
    data(transition) {
      // preview 区分是否是预览
      if (this.$route.params.id && this.$route.params.id !== 'undefined' && this.$route.params.type !== 'preview') {
        this.params.chartQueryId = this.$route.params.id;
        this.isNotPreview = true;
        this.getPageParms(transition);
      } else {
        // 避免vue-router 匹配不上 decodeURIComponent
        this.previewParams = JSON.parse(decodeURIComponent(this.$route.params.id));
        this.preview(transition);
      }
    }
  },
  methods: {
    // 构造table数据
    formChartData(type) {
      this.data.columns.forEach((item, index) => {
        item.title = item.alias;
        item.key = item.columnTitle;
        if (item.formatType === 2) {
          this.data.data.table.forEach(_item => {
            if (_item[item.key] !== void (0)) {
              _item[item.key] = parseFloat((_item[item.key] * 100).toPrecision(12)) + '%';
            }
          });
        }
      });
      // 如果是排序重头查
      if (type === 'search' || type === 'sort') {
        this.tableList = this.data.data.table;
        return;
      }
      if (this.data.data.table.length > 0) {
        this.tableList = this.tableList.concat(this.data.data.table);
      }
    },
    // 预览
    preview() {
      this.$loadingRouteData = true;
      this.$http.post('/chart/preview', this.previewParams).then(
        res => {
          res = res.json();
          this.$loadingRouteData = false;
          if (res.success) {
            this.backupSearch = JSON.parse(JSON.stringify(res.data.search));
            this.backupSearch.forEach(item => {
              this.params.search[item.searchName] = JSON.parse(JSON.stringify(item.defaultValue));
            });
            res.data.columns.forEach(item => {
              item.width = Number(this.columnsWidth);
              // itable依赖 key title
              item.key = item.columnTitle;
              item.title = item.alias;
              item.sortable = 'custom';
            });
            let dimensionFixedCheckList = getItem(this.params.chartQueryId + 'dimensionFixedCheckList', this.dimensionFixedCheckList) || [];
            res.data.columns.forEach(item => {
              dimensionFixedCheckList.forEach(_item => {
                if (item.columnTitle === _item) {
                  item.fixed = 'left';
                }
              });
            });
            this.backupColumns = deepCopy(res.data.columns);
            this.$set('data', res.data);
            // 格式化 data
            if (this.data.chartQuery.queryType === 1) {
              this.formChartData('search');
            }
            if (this.data.chartQuery.queryType === 2 || this.data.chartQuery.queryType === 3) {
              // 图表额外信息
              const chartDatas = this.data.data.extraDate;
              const vals = Object.values(chartDatas);
              vals.forEach((ele) => {
                // 没有数据
                if (ele.cur_date === null) {
                  this.noData = true;
                } else {
                  this.noData = false;
                }
              });
              this.data.data.chartExt = this.data.chartExt;
            }
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
    // 获取查询条件
    getPageParms() {
      this.$loadingRouteData = true;
      this.$http.get(`/chart/parms?chartQueryId=${this.params.chartQueryId}`).then(
        res => {
          res = res.json();
          this.$loadingRouteData = false;
          if (res.success) {
            // 构造search框
            this.backupSearch = JSON.parse(JSON.stringify(res.data.search));
            this.backupSearch.forEach(item => {
              this.params.search[item.searchName] = JSON.parse(JSON.stringify(item.defaultValue));
            });
            this.$set('data', res.data);
            this.$loadingRouteData = false;
            // 如果是普通报表再查一次
            if (this.data.dimension.length === 0) {
              this.getPage('search');
            }
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
    getPage(type) {
      // 如果是排序重头查
      if (type === 'search' || type === 'sort') {
        this.params.pageNum = 1;
      }
      this.$loadingRouteData = true;
      this.$http.post('/chart', this.params).then(
        res => {
          res = res.json();
          this.$loadingRouteData = false;
          if (res.success) {
            if (res.data.chartQuery.queryType === 1) {
              // columns 宽度控制
              res.data.columns.forEach(item => {
                item.width = Number(this.columnsWidth);
                // itable依赖 key title
                item.key = item.columnTitle;
                item.title = item.alias;
                item.sortable = 'custom';
                item.fixed = '-';
              });
              // 表格高度控制
              if (res.data.data.table.length >= 8) {
                if (this.params.pageNum === 1) {
                  this.tableHeight = 8 * 48 + 50;
                }
              } else {
                if (this.params.pageNum === 1) {
                  this.tableHeight = res.data.data.table.length * 48 + 40;
                }
              }
              // 分页显示or隐藏
              if (res.data.data.count <= 15) {
                this.enoughlength = false;
              } else {
                // 重置
                this.enoughlength = true;
              }
              let dimensionFixedCheckList = getItem(this.params.chartQueryId + 'dimensionFixedCheckList', this.dimensionFixedCheckList) || [];
              res.data.columns.forEach(item => {
                dimensionFixedCheckList.forEach(_item => {
                  if (item.columnTitle === _item) {
                    item.fixed = 'left';
                  }
                });
              });
              // 是否需要重新渲染表格头部
              if (this.isRenderTableHeard) {
                this.backupColumns = deepCopy(res.data.columns);
              };
            }
            this.$set('data', res.data);
            // 格式化 data
            if (this.data.chartQuery.queryType === 1) {
              this.formChartData(type);
            }
            if (this.data.chartQuery.queryType === 2) {
              // 图表额外信息
              this.data.data.chartExt = this.data.chartExt;
              if (this.data.data.extraDate.length) {
                this.noData = true;
              } else {
                this.noData = false;
              };
              this.$nextTick(() => {
                this.$refs.offresources.selectDimensionChange();
              });
            }
            if (this.data.chartQuery.queryType === 3) {
              // 图表额外信息
              this.data.data.chartExt = this.data.chartExt;
              if (this.data.data.extraDate.length) {
                this.noData = true;
              } else {
                this.noData = false;
              };
              this.$nextTick(() => {
                this.$refs.onresources.selectDimensionChange();
              });
            }
            this.$loadingRouteData = false;
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
    getSelect(item) {
      this.searchItemArr[item.labelName] = [];
      item.extInfo.split(',').forEach((_item) => {
        let key = _item.split(':');
        this.searchItemArr[item.labelName].push({
          id: key[0],
          label: key[1]
        });
      });
      this.$nextTick(() => {
        this.isShowSelect = true;
      });
    },
    show(item) {
      this.params.search[item.searchName] = event.target.value; // eslint-disable-line
    },
    onPageChange(page) {
      this.params.pageNum = page;
      this.getPage();
    },
    setClumns() {
      this.data.columns.forEach(item => {
        item.width = Number(this.columnsWidth);
      });
    },
    // 改变列表固定
    dimensionFixedChange(dimensionFixedCheckList) {
      this.$loadingRouteData = true;
      clearTimeout(timer);
      let timer = setTimeout(() => {
        this.backupColumns.forEach(item => {
          item.fixed = '-';
        });
        this.backupColumns.forEach(item => {
          dimensionFixedCheckList.forEach(_item => {
            if (item.columnTitle === _item) {
              item.fixed = 'left';
            }
          });
        });
        this.$loadingRouteData = false;
      }, 10);
    },
    // 排序
    sortchange(value) {
      if (value.order === 'normal') {
        this.params.order = {};
      } else {
        this.params.order = { [value.key]: value.order };
      }
      this.params.pageNum = 1;
      this.getPage('sort');
    },
    downTable() {
      let dimensionList = [];
      this.params.dimensionList.forEach(item => {
        dimensionList.push(item.columnTitle);
      });
      let columnList = [];
      this.params.columnList.forEach(item => {
        columnList.push(item.columnTitle);
      });
      let goLink = `/chart/download?order=${JSON.stringify(this.params.order)}&chartQueryId=${this.params.chartQueryId}&search=${JSON.stringify(this.params.search)}&dimensionList=${JSON.stringify(dimensionList)}&columnList=${JSON.stringify(columnList)}`;
      window.open(encodeURI(goLink));
    }
  },
  ready() {
    // window.addEventListener('scroll',function() {
    //   const fixdom = document.getElementById('fixdom');
    //   if (window.scrollY > 170) {
    //     fixdom.style.position = 'fixed';
    //     fixdom.style.top = 0;
    //   }
    // })
  }
};
</script>
<style lang="less">
.table-content {
  .table-view-title {
    padding: 10px 0 10px;
  }
  .table-warp {
    padding: 0px 0;
    .nodata{
      text-align:center;
      font-size:14px;
      font-weight:bold;
    }
    .ivu-table-body {
      &::-webkit-scrollbar {
          width: 8px;
          height: 6px;
      }
    }
    .ivu-table-cell {
      text-align: right;
    }
    .ivu-table td, .ivu-table th {
      text-align: right;
    }
  }
  .form-filter-group {
    &.w310 {
      width: 310px !important;
    }
    margin-bottom: 18px;
    float: left;
    .filter-label-add {
      padding: 0 6px;
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 120px !important;
      text-align: left;
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
    }
    .form-control-input {
      width: 160px !important;
      margin-right: 30px;
    }
    .datepicker-input {
      width: 160px !important;
      margin-right: 0px !important;
    }
    .iconhandle {
      right: 13px !important;
    }
    .select-group {
      width: 160px;
      margin-right: 30px;
    }
  }
  .sql-search-btn {
    float: right;
  }
  .download {
    color: #657180;
    font-size: 16px;
    cursor: pointer;
    margin-top: 8px;
    &:hover {
      color: #ef6b3b !important;
    }
  }
  .lie-width {
    margin-top: 8px;
    margin-bottom: 0px;
  }
  .chart-title {
    color: #444;
    font-size: 30px;
    text-align: center;
    padding: 60px 0 40px 0;
  }
  .field-warp {
    padding-top: 10px;
  }
}
</style>
