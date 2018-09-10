<template>
  <div class="child-mother-warp">
    <div class="data-set">
      <data-base :source-type.sync="params.databaseId"></data-base>
      <div class="sql-content">
        <textarea
          class="sql-edit"
          @input="handleInput | debounce 300"
          v-model="params.queryTemp"
          cols="30" rows="6"
          placeholder="请输入表名进行查询">
          </textarea>
        <ul :class="[prefixCls + '-result-list']" v-show="resultList.length > 0">
          <template v-for="item in resultList">
            <li :class="[prefixCls + '-result-item']" @mousedown="handleClick(item)">{{item}}</li>
          </template>
        </ul>
      </div>
      <d-button size="large" type="primary" @click="saveSql">下一步</d-button> 更改Table或切换数据库后请重新点击“下一步”
    </div>
    <!-- add-search 维度 自动添加到查询条件中 -->
    <field-cfg :obj.sync="filedMsgObj" v-if="isShowFiled" :add-search="addSearch"></field-cfg>
    <query-cfg :obj.sync="queryConditionObj" :filed-msg-obj.sync="filedMsgObj" :is-edit="isEdit" v-if="isShowQuery"><query-cfg>
  </div>
</template>
<script>
import dataBase from '../../dataBase';
import fieldCfg from '../fieldCfg';
import queryCfg from '../queryCfg';
import MessageBox from 'components/basic/MessageBox';
const prefixCls = 'auto-complete';
export default {
  components: {
    dataBase,
    fieldCfg,
    queryCfg
  },
  props: {
    params: {
      type: Object,
      default: null
    },
    changeQueryType: {
      type: Function,
      default: null
    },
    queryConditionObj: {
      type: Object,
      default: null
    },
    filedMsgObj: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      resultList: [],
      isShowFiled: false,
      isShowQuery: false
    };
  },
  ready() {
    if (this.isEdit) {
      this.isShowFiled = true;
      this.isShowQuery = true;
    }
  },
  methods: {
    handleInput(event) {
      let value = this.params.queryTemp;
      this.getSqlTabletName(value);
    },
    getSqlTabletName(value) {
      let params = {
        databaseId: this.params.databaseId,
        tableNameKeyWord: value
      };
      this.$http.post('/chart/searchTable', params).then(
        res => {
          res = res.json();
          if (res.success) {
            this.resultList = res.data;
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
    handleClick(item) {
      this.params.queryTemp = item;
      this.resultList = [];
    },
    saveSql(value) {
      let params = {
        databaseId: this.params.databaseId,
        tableName: this.params.queryTemp
      };
      this.$http.post('/chart/queryColumns', params).then(
        res => {
          res = res.json();
          if (res.success) {
            this.filedMsgObj.columnEntity = res.data.columnEntity;
            this.isShowFiled = true;
            this.isShowQuery = true;
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
    // 当指标里选择维度时，自动添加到查询条件中
    // 添加查询规则
    addSearch(item) {
      let obj = this.isExist(item);
      if (item.selectType === 2 && obj.isCanAdd) {
        this.isShowQuery = false;
        this.queryConditionObj.searchEntity.push({
          defaultType: 3,
          defaultValue: '',
          extInfo: '',
          labelName: item.alias,
          searchName: item.columnTitle,
          searchOrder: '',
          searchType: 2,
          columnTitle: item.columnTitle
        });
        this.$nextTick(() => {
          this.isShowQuery = true;
        });
      }
      if (item.selectType !== 2 && !obj.isCanAdd) {
        this.queryConditionObj.searchEntity.splice(obj.index, 1);
      }
    },
    // 查询条件是否已经存在
    isExist(item) {
      let obj = {
        isCanAdd: true,
        index: 0
      };
      this.queryConditionObj.searchEntity.forEach((_item, index) => {
        if (_item.columnTitle === item.columnTitle) {
          obj.isCanAdd = false;
          obj.index = index;
        }
      });
      return obj;
    }
  }
};
</script>
<style lang="less" scoped>
.child-mother-warp {
  .data-set {
    border-bottom: 1px #e3e3e3;
  }
  .sql-edit {
    outline-color: #a8e7e7;
  }
  .sql-content {
    position: relative;
    margin-bottom: 10px;
  }
  .auto-complete-result-list {
    position: absolute;
    z-index: 999;
    border-top: 1px solid #a8e7e7;
    border-bottom: 1px solid #a8e7e7;
    border-right: 1px solid #a8e7e7;
    border-left: 1px solid #a8e7e7;
    border-radius: 2px;
    background-color: #fff;
    width: 300px;
    top: 0px;
    .auto-complete-result-item {
      width: 100%;
      padding: 8px;
      text-align: left;
      cursor: pointer;
      font-size:13px;
      color: #444;
      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>

