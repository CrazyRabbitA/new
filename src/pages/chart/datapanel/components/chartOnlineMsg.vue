<template>
  <div>
    <div class="step">
      <span class="step-num">2</span><span class="step-text">实时折线图信息配置</span>
    </div>
    <div class="field-warp">
      <template v-for="(index, item) in obj.columnEntity">
        <div class="cf">
          <div class="form-filter-group">
            <p class="filter-label fl filter-label-add">{{item.columnTitle}}：</p>
            <d-select :options.sync="formatTypeArr" :value.sync="item.formatType"></d-select>
          </div>
          <div class="form-filter-group">
            <p class="filter-label fl filter-label-filed">字段名称：</p>
            <input type="text" class="form-control fl form-control-input" placeholder="请填写字段名称" v-model="item.alias">
          </div>
          <div class="form-filter-group">
            <p class="filter-label fl filter-label-sort">排序：</p>
            <input type="text" class="form-control fl form-control-input form-control-input-sort" placeholder="序号" v-model="item.columnOrder">
          </div>
          <span class="defalt-input"><input type="radio" name="default" v-model="ext.defaultColumnName" :value="item.columnTitle">默认</span>
          <d-button size="large" type="primary" @click="delFiled(item, index)">删除</d-button>
        </div>
      </template>
      <div class="time-fileds cf">
        <div class="form-filter-group no-fl">
          <p class="filter-label fl  filter-label-filed">时间粒度：</p>
          <d-select :options.sync="timeRangeArr" :value.sync="ext.timePeriod"></d-select>
        </div>
        <div class="form-filter-group no-fl">
          <p class="filter-label fl  filter-label-filed">时间字段：</p>
          <d-select :options.sync="timeColumnArr" :value.sync="ext.timeColumnName"></d-select>
        </div>
        <div class="form-filter-group no-fl">
          <p class="filter-label fl filter-label-filed">开始时间：</p>
          <d-select :options.sync="timeNodeArr" :value.sync="ext.startDateSearchName"></d-select>
        </div>
        <div class="form-filter-group no-fl">
          <p class="filter-label fl filter-label-filed">结束时间：</p>
          <d-select :options.sync="timeNodeArr" :value.sync="ext.endDateSearchName"></d-select>
        </div>
        <div class="form-filter-group no-fl">
          <p class="filter-label fl filter-label-filed">今日：</p>
          <span class="defalt-input"><input type="radio" name="todLine" v-model="ext.todLine" :value="1">是</span>
          <span class="defalt-input"><input type="radio" name="todLine" v-model="ext.todLine" :value="0">否</span>
        </div>
        <div class="form-filter-group no-fl">
          <p class="filter-label fl filter-label-filed">昨日：</p>
          <span class="defalt-input"><input type="radio" name="yesLine" v-model="ext.yesLine" :value="1">是</span>
          <span class="defalt-input"><input type="radio" name="yesLine" v-model="ext.yesLine" :value="0">否</span>
        </div>
        <div class="form-filter-group no-fl">
          <p class="filter-label fl filter-label-filed">历史七日：</p>
          <span class="defalt-input"><input type="radio" name="sevAveLine" v-model="ext.sevAveLine" :value="1">是</span>
          <span class="defalt-input"><input type="radio" name="sevAveLine" v-model="ext.sevAveLine" :value="0">否</span>
        </div>
      </div>
      <!-- <d-button size="large" type="primary" @click="preview">预览</d-button> -->
    </div>
  </div>
</template>
<script>
const formatTypeArr = [
  {
    label: '不格式化',
    id: 1
  },
  {
    label: '百分比',
    id: 2
  },
  {
    label: '金额',
    id: 3
  },
  {
    label: '日期',
    id: 4
  },
  {
    label: '整型',
    id: 5
  },
  {
    label: '浮点数',
    id: 6
  }
];
const timeRangeArr = [
  {
    label: '天',
    id: 1
  },
  {
    label: '半小时',
    id: 2
  }
];
export default {
  props: {
    close: {
      default: null
    },
    obj: {
      type: Object,
      default: null
    },
    ext: {
      type: Object,
      default: null
    },
    timeNode: {
      type: Array,
      default: null
    },
    preview: {
      type: Function,
      default: () => {}
    }
  },
  created() {
    this.timeNodeArr = [];
    this.timeColumnArr = [];
    this.timeNode.forEach(item => {
      this.timeNodeArr.push({
        label: item.searchName,
        id: item.searchName
      });
    });
    /*
     * 构造时间字段选择下拉框
     * {
     *   alias: '',
     *   columnTitle: item,
     *   columnOrder: '',
     *   formatType: ''
     * }
    */
    this.obj.columnEntity.forEach(item => {
      this.timeColumnArr.push({
        label: item.columnTitle,
        id: item.columnTitle
      });
    });
  },
  data() {
    return {
      formatTypeArr: formatTypeArr,
      timeNodeArr: [],
      timeRangeArr: timeRangeArr,
      timeColumnArr: []
    };
  },
  methods: {
    delFiled(item, index) {
      this.obj.columnEntity.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.form-filter-group {
  margin-bottom: 18px;
  float: left;
  .filter-label-add {
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 180px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .filter-label-filed {
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 80px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
    input {
      width: 40px;
    }
  }
  .filter-label-sort {
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 60px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
    input {
      width: 40px;
    }
  }
  .form-control-input {
    width: 180px;
    margin-right: 30px;
  }
  .form-control-input-sort {
    width: 100px;
  }
  .datepicker-input {
    width: 180px !important;
  }
  .iconhandle {
    right: 26px !important;
  }
  .select-group {
    width: 180px;
    margin-right: 30px;
  }
}
.step {
  padding: 80px 0 20px 0;
  .step-num {
    display: inline-block;
    margin-right: 8px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    border-radius: 50%;
    background-color: #ef6b3b;
    vertical-align: middle;
  }
  .step-text {
    font-size: 18px;
    font-weight: bold;
    vertical-align: middle;
  }
}
.no-fl {
  float: none;
  span {
    display: inline-block;
    padding-top: 6px;
    font-size: 14px;
    input {
      cursor: pointer;
    }
  }
}
.defalt-input {
  input {
    width: 14px;
    height: 14px;
  }
}
</style>
