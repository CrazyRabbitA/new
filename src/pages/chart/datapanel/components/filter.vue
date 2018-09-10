<template>
  <div class="search">
    <div class="form-filter-group chart-type">
      <span class="defalt-input" v-if="params.reportType === 1 || !isEdit"><input type="radio" name="chartType" v-model="params.reportType" :value="1">普通报表</span>
      <span class="defalt-input" v-if="params.reportType === 2 || !isEdit"><input type="radio" name="chartType" v-model="params.reportType" :value="2">子母表</span>
    </div>
    <!-- 配置数据源 -->
    <common-chart v-if="params.reportType === 1" :params="params" :save-sql="saveSql" :change-query-type="changeQueryType"></common-chart>
     <!-- 子母报表 配置查询条件 -->
    <child-mother v-else :params="params" :query-condition-obj="queryConditionObj" :filed-msg-obj.sync="filedMsgObj" :is-edit="isEdit"></child-mother>
    <!-- 普通报表 1 配置查询条件 -->
    <query-condition v-if="queryConditionObj.show && params.reportType === 1 " :obj.sync="queryConditionObj" :query-check="queryCheck"></query-condition>
    <!-- 普通报表 2 配置表头时目录也出来 -->
    <table-field-msg v-if="filedMsgObj.show && params.queryType === 1 && params.reportType === 1 " :obj.sync="filedMsgObj" :preview="preview"></table-field-msg>
    <!-- 普通报表 :time-node.sync="queryConditionObj.searchEntity" 选择哪个字段是时间字段 -->
    <chart-offline-msg v-if="filedMsgObj.show && params.queryType === 2 && params.reportType === 1 " :obj.sync="filedMsgObj" :ext.sync="chartExtObj" :time-node.sync="queryConditionObj.searchEntity" :preview="preview"></chart-offline-msg>
    <chart-online-msg v-if="filedMsgObj.show && params.queryType === 3 && params.reportType === 1 " :obj.sync="filedMsgObj" :ext.sync="chartExtObj" :time-node.sync="queryConditionObj.searchEntity" :preview="preview"></chart-online-msg>
    <!-- 3 配置表头时目录也出来 -->
    <change-lib v-if="filedMsgObj.show" :obj.sync="categoryRelEntityObj" :query-name.sync="params.queryName"></change-lib>
    <!-- 保存 -->
    <d-button v-if="filedMsgObj.show" size="large" type="primary" @click="saveChart">保存</d-button>
  </div>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
// 配置数据源
import commonChart from './commonChart';
import childMother from './childMother/dataSet';
// 配置查询条件
import queryCondition from './queryCondition';
// 配置查询条件
import tableFieldMsg from './tableFieldMsg';
import chartOnlineMsg from './chartOnlineMsg';
import chartOfflineMsg from './chartOfflineMsg';
// 目录
import changeLib from './changeLib';

export default {
  components: {
    childMother,
    commonChart,
    queryCondition,
    tableFieldMsg,
    chartOnlineMsg,
    chartOfflineMsg,
    changeLib
  },
  props: {
    editData: {
      type: Object,
      defaut: null
    }
  },
  data() {
    return {
      isEdit: false,
      isParamsChange: false,
      data: {},
      // 目录
      categoryRelEntityObj: {
        id: '',
        categoryName: '',
        parentId: ''
      },
      // 表头字段
      filedMsgObj: {
        chartQueryId: '',
        show: false,
        columnEntity: [],
        searchEntity: []
      },
      // 图表额外信息
      chartExtObj: {
        timePeriod: 1,
        timeColumnName: '',
        defaultColumnName: '',
        startDateSearchName: '',
        endDateSearchName: '',
        // 今日，昨日，历史七日是否要显示
        todLine: 1,
        yesLine: 1,
        sevAveLine: 1
      },
      // 搜索条件
      queryConditionObj: {
        show: false,
        // 报表id
        chartQueryId: '',
        // 查询条件枚举（labelName: "开始"， searchName: "startDate" .）
        searchEntity: []
      },
      // 第一步 数据源配置 表名配置 this.params = this.editData.queryEntity;
      params: {
        // 新增参数，1-普通报表，2-子母表
        reportType: 1,
        // 图表类型
        chartType: 1,
        // 报表id
        id: '',
        // 数据库
        databaseId: '',
        // 表名
        queryName: '',
        // SQL语句
        queryTemp: '',
        // 图表类型
        queryType: 1
      }
    };
  },
  ready() {
    if (this.editData.queryEntity) {
      this.isEdit = true;
      // 查询sql
      this.params = this.editData.queryEntity;
      // 查询条件构造
      this.queryConditionObj.searchEntity = this.editData.searchEntity;
      this.queryConditionObj.show = true;
      // 头部条件构造
      this.filedMsgObj.columnEntity = this.editData.columnEntity;
      this.filedMsgObj.show = true;
      // chart条件构造
      this.chartExtObj = this.editData.chartExt;
      // 目录
      if (this.editData.categoryRelEntity && this.editData.categoryRelEntity.parentId) {
        this.categoryRelEntityObj.parentId = this.editData.categoryRelEntity.parentId;
        this.categoryRelEntityObj.id = this.editData.categoryRelEntity.id;
        this.categoryRelEntityObj.categoryName = this.editData.categoryRelEntity.categoryName;
      }
    }
  },
  watch: {
    'params.reportType': function() {
      // 切换不显示 1，2，3配置步骤
      if (!this.isEdit) {
        this.filedMsgObj.show = false;
      }
      this.queryConditionObj.show = false;
    }
  },
  methods: {
    changeQueryType(queryType) {
      if (this.isEdit) {
        MessageBox({
          title: '不能修改图表类型！',
          type: 'error'
        });
        return;
      }
      this.params.queryType = queryType;
      this.filedMsgObj.show = false;
      this.queryConditionObj.show = false;
    },
    // sql解析
    saveSql() {
      let params = {
        queryEntity: this.params,
        searchEntity: this.queryConditionObj.searchEntity
      };
      this.$http.post('/chart/parse', params).then(
        res => {
          res = res.json();
          if (res.success) {
            // 解析出可以选的项
            this.queryConditionObj.show = false;
            this.queryConditionObj.searchEntity = res.data.searchEntity;
            this.queryConditionObj.show = true;
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
    // 搜索条件校验
    queryCheck() {
      let params = {
        // 搜索条件
        queryEntity: this.params,
        searchEntity: this.queryConditionObj.searchEntity,
        columnEntity: this.filedMsgObj.columnEntity,
        chartExt: this.filedMsgObj.chartExt
      };

      this.$http.post('/chart/check', params).then(
        res => {
          res = res.json();
          if (res.success) {
            this.filedMsgObj.show = false;
            this.filedMsgObj.columnEntity = res.data.columnEntity;
            this.filedMsgObj.chartExt = res.data.chartExt;
            this.$nextTick(() => {
              this.filedMsgObj.show = true;
            });
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
    // 预览
    preview() {
      let params = {
        databaseId: this.params.databaseId,
        queryTemp: this.params.queryTemp,
        queryType: this.params.queryType,
        // 搜索条件
        searchEntities: this.queryConditionObj.searchEntity,
        // 字段
        columnEntities: this.filedMsgObj.columnEntity
      };
      // 新页面打开？ this.$router.go({name: 'table', params: {id: });
      window.open(window.location.origin + window.location.pathname + '#!/chart/tableview/preview/' + encodeURIComponent(JSON.stringify(params)));
    },
    // 保存配置
    saveChart() {
      let params = {
        id: this.$route.params.id || this.params.id,
        chiId: this.categoryRelEntityObj.id,
        databaseId: this.params.databaseId,
        parId: this.categoryRelEntityObj.parentId,
        queryName: this.params.queryName,
        queryTemp: this.params.queryTemp,
        queryType: this.params.queryType,
        // 新增参数，1-普通报表，2-子母表
        reportType: this.params.reportType,
        // 搜索条件
        searchEntities: this.queryConditionObj.searchEntity,
        // 字段
        columnEntities: this.filedMsgObj.columnEntity,
        // chart
        chartExt: this.chartExtObj
      };
      this.$http.post('/chart/add', params).then(
        res => {
          res = res.json();
          if (res.success) {
            MessageBox({
              title: '保存成功！',
              type: 'success'
            });
            // 如果是编辑就不跳转
            if (typeof res.data === 'number') {
              this.$router.go({name: 'edit', params: {id: res.data}});
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
    }
  }
};
</script>
<style lang="less" scoped>
.filter-warp {
  padding: 10px 0;
}
.form-filter-group {
  margin-bottom: 18px;
  .filter-label-add {
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 85px;
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
.chart-type {
  padding-top: 20px;
  margin-bottom: 0px;
  font-size: 14px;
  input {
    width: 14px;
    height: 14px;
  }
}
.sql-content {
  margin-bottom: 10px;
  .sql-edit {
    width: 100%;
    height: 200px;
    max-height: 200px;
    resize: none;
  }
  .sql-save-btn {
    margin-top: 20px;
  }
}
.search {
  padding-bottom: 120px;
}
.nf {
  float: none;
}
</style>

