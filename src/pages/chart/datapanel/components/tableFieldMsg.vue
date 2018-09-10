<template>
  <div class="common-2">
    <div class="step">
      <span class="step-num">2</span><span class="step-text">字段信息配置</span>
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
          <d-button size="large" type="primary" @click="delFiled(item, index)">删除</d-button>
        </div>
      </template>
      <d-button size="large" type="primary" @click="preview">预览</d-button>
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
export default {
  props: {
    close: {
      default: null
    },
    obj: {
      type: Object,
      default: null
    },
    preview: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      formatTypeArr: formatTypeArr
    };
  },
  methods: {
    delFiled(item, index) {
      this.obj.columnEntity.splice(index, 1);
    }
  }
};
</script>

<style lang="less">
.common-2 {
  .select-menu {
    max-height: 200px;
  }
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
}
</style>
