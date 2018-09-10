<template>
  <div>
    <div class="step">
      <span class="step-num">1</span><span class="step-text">添加查询条件</span>
    </div>
    <div class="field-warp">
      <template v-for="item in obj.searchEntity">
        <div class="cf">
          <div class="form-filter-group">
              <p class="filter-label fl filter-label-add">{{item.searchName}}：</p>
              <d-select :options.sync="searchTypeArr" :value.sync="item.searchType" @select="searchTypeChange(item)"></d-select>
          </div>
          <div class="form-filter-group">
              <p class="filter-label fl filter-label-add">标签名称：</p>
              <input type="text" class="form-control fl form-control-input" placeholder="请填写字段名称" v-model="item.labelName">
          </div>
          <div class="form-filter-group" v-if="item.defaultType !== 1">
            <p class="filter-label fl filter-label-add filter-label-small">默认值：</p>
            <input type="text" class="form-control fl form-control-input" placeholder="请填写默认值" v-model="item.defaultValue">
          </div>
          <div class="form-filter-group" v-if="item.searchType === 3">
            <p class="filter-label fl filter-label-add filter-label-small">枚举：</p>
            <input type="text" class="form-control fl form-control-input" placeholder="" v-model="item.extInfo">
          </div>
          <div class="form-filter-group" v-if="item.searchType === 1">
              <p class="filter-label fl filter-label-add">默认类型：</p>
              <d-select :options.sync="defaultTypeArr" :value.sync="item.defaultType"></d-select>
          </div>
          <div class="form-filter-group">
              <p class="filter-label fl filter-label-add filter-label-small">排序：</p>
              <input type="text" class="form-control fl form-control-input form-control-input-sort" placeholder="排序" v-model="item.searchOrder">
          </div>
        </div>
      </template>
      <d-button size="large" type="primary" @click="queryCheck">下一步</d-button> 更改查询条件后请重新点击“下一步”
    </div>
  </div>
</template>
<script>
const searchTypeArr = [
  {
    label: '日期搜索',
    id: 1
  },
  {
    label: '文本搜索',
    id: 2
  },
  {
    label: '下拉框搜索',
    id: 3
  },
  {
    label: '文本模糊搜索',
    id: 4
  }
];
const defaultTypeArr = [
  {
    label: '当前日期',
    id: 1
  },
  {
    label: '当前日期范围',
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
      default: () => {}
    },
    queryCheck: {
      type: Function,
      default: () => {}
    }
  },
  ready() {
    if (this.obj.searchEntity === []) {
      this.obj.conditions.map((item) => {
        this.obj.searchEntity.push({
          defaultType: 3,
          defaultValue: '',
          extInfo: '',
          labelName: '',
          searchName: item,
          searchOrder: '',
          searchType: 2
        });
      });
    }
  },
  data() {
    return {
      searchTypeArr: searchTypeArr,
      defaultTypeArr: defaultTypeArr
    };
  },
  methods: {
    searchTypeChange(item) {
      if (item.searchType === 1) {
        item.defaultType = 1;
      } else {
        item.defaultType = 3;
      }
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
    width: 80px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .filter-label-small {
    width: 60px;
  }
  .form-control-input {
    width: 120px;
    margin-right: 14px;
  }
  .form-control-input-sort {
    width: 60px;
  }
  .datepicker-input {
    width: 160px !important;
  }
  .iconhandle {
    right: 26px !important;
  }
  .select-group {
    width: 160px;
    margin-right: 14px;
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
</style>
