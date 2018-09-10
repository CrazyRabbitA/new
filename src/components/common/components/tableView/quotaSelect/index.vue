<template>
 <div class="table-view-quota-select-warp cf" v-if="dimension.length > 0">
    <div class="table-view-quota-select cf">
      <div class="form-filter-group w310 cf">
        <p class="filter-label fl filter-label-add">维度：</p>
        <div class="check-warp">
          <d-checkbox-group :value.sync="dimensionCheckList">
            <!-- <d-checkbox :name="'dapan'" @select="dimensionChange(value)">大盘</d-checkbox> -->
            <template v-for="(index,item) in dimension" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.columnTitle" @change="dimensionChange(value)">{{item.alias}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>
      </div>
      <d-button class="sql-search-btn quota-select-btn" size="large" type="primary" @click="showQuata">指标</d-button>
      <quota-modal :visiblecolumns="visibleColumns" :check-list="checkList" :show.sync="isShowQuotaModal" :select-change="selectChange"></quota-modal>
    </div>
    <div class="table-view-quota-select form-filter-group  cf mt30">
      <p class="filter-label fl filter-label-add">固定维度字段：</p>
      <div class="check-warp">
        <d-checkbox-group :value.sync="dimensionFixedCheckList">
          <template v-for="(index,item) in dimension" track-by="$index">
            <div class="quota-item">
              <d-checkbox :name="item.columnTitle" @change="dimensionFixedChange(value)">{{item.alias}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import quotaModal from './quotaModal';
import { getItem, setItem } from '../../../../utils/localStorage.js';
export default {
  components: {
    quotaModal
  },
  props: {
    params: {
      type: Object,
      default: null
    },
    fn: {
      type: Function,
      default: null
    },
    dimensionFixed: {
      type: Function,
      default: null
    },
    visibleColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    backupColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dimension: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // group by用
    dimensionList: {
      type: Array,
      default: null
    },
    // 固定字段重新渲染
    isNotFixed: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    'visibleColumns': function(val) {
      // 非子母表直接返回
      if (this.dimension.length < 1) {
        return;
      }
      // 维度
      if (getItem(`${this.visibleColumns[0].chartQueryId}dimensionList`)) {
        this.dimensionCheckList = getItem(`${this.visibleColumns[0].chartQueryId}dimensionList`);
      };
      // 指标
      if (getItem(this.visibleColumns[0].chartQueryId)) {
        this.checkList = getItem(this.visibleColumns[0].chartQueryId);
      } else {
        this.checkList = [];
        this.visibleColumns.forEach((item) => {
          this.checkList.push(item.columnTitle);
        });
      }
      // 固定字段样式显示用
      this.dimensionFixedCheckList = getItem(this.visibleColumns[0].chartQueryId + 'dimensionFixedCheckList') || [];
      // 阻止 ‘visibleColumns’ 变化 重复请求调用 selectChange（）
      if (this.i < 1) {
        this.selectChange();
      }
    }
  },
  data() {
    return {
      isShowQuotaModal: false,
      dimensionCheckList: [],
      // 表格固定字段
      dimensionFixedCheckList: [],
      checkList: [],
      // 判断是否是第一次渲染
      i: 0
    };
  },
  methods: {
    showQuata() {
      this.isShowQuotaModal = true;
    },
    selectChange() {
      this.i++;
      // 查询指标
      this.params.columnList = [];
      this.visibleColumns.forEach((item) => {
        this.checkList.forEach((_item) => {
          if (item.columnTitle === _item) {
            this.params.columnList.push(item);
          }
        });
      });
      setItem(this.visibleColumns[0].chartQueryId, this.checkList);
       // group by 维度使用
      let dimensionListArr = [];
      this.dimension.forEach((item) => {
        this.dimensionCheckList.forEach((_item) => {
          if (item.columnTitle === _item) {
            dimensionListArr.push(item);
          }
        });
      });
      this.params.dimensionList = dimensionListArr;
      // 查询一次
      this.fn('search');
    },
    dimensionChange(value) {
      // group by 使用
      let dimensionListArr = [];
      this.dimension.forEach((item) => {
        this.dimensionCheckList.forEach((_item, _index) => {
          if (item.columnTitle === _item) {
            dimensionListArr.push(item);
          }
        });
      });
      setItem(this.visibleColumns[0].chartQueryId + 'dimensionList', this.dimensionCheckList);
      this.params.dimensionList = dimensionListArr;
    },
    // 固定字段

    dimensionFixedChange() {
      this.dimensionFixed(this.dimensionFixedCheckList);
      setItem(this.visibleColumns[0].chartQueryId + 'dimensionFixedCheckList', this.dimensionFixedCheckList);
    }
  }
};
</script>
<style lang="less">
.mt30 {
  margin-top: 10px;
  margin-bottom: 0px !important;
}
.table-view-quota-select {
  .quota-select-btn {
     float: right;
     background-color: #169BD5;
  }
  .check-warp {
    margin-left: 120px;
    width: 880px;
    .quota-item {
      display: inline-block;
      margin-right: 20px;
    }
    .d-checkbox-control .icon {
      width: 14px;
      height: 14px;
    }
  }
}
</style>

