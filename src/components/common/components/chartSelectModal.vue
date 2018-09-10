<template>
  <d-modal :title="title" :show.sync="show" width="406" class="domainmodal" :on-close="onClose">
    <div class="modal-body quota-modal-body" slot="modal-body">
      <div class="form-filter-group w280">
          <p class="filter-label fl filter-label-add">看板名字：</p>
          <input type="text" class="form-control fl form-control-input" placeholder="请输入看板名字，最多10个字" v-model="obj.dashboardName">
      </div>
      <div class="form-filter-group w280 tree-warp">
        <p class="filter-label fl filter-label-add">选择报表：</p>
        <br/>
        <br/>
        <div class="tree-select-warp">
          <i-tree :data="data" show-checkbox @on-check-change="change"  v-ref:tree></i-tree>
        </div>
      </div>
      <div class="form-filter-group w280">
        <p class="filter-label fl filter-label-add">设为默认看板：</p>
        <div class="switch-warp">
         <d-switch :status.sync="obj.isDefault" :on-change="defaultChange"></d-switch>
        </div> 
      </div>
    </div>
    <div class="modal-footer cf" slot="modal-footer">
      <loading :show="loadingRouteData"></loading>
      <d-button type="primary" @click="onSave">确定</d-button>
      <d-button type="primary" @click="onClose">取消</d-button>
      <d-button type="primary" @click="onDel" v-if="obj.type === 'edit'">删除</d-button>
    </div>
  </d-modal>
</template>
<script>
import validationMixins from 'components/utils/validationMixins';
import MessageBox from 'components/basic/MessageBox';
export default {
  mixins: [validationMixins],
  props: {
    show: {
      required: true,
      default: false
    },
    obj: {
      type: Object,
      default: null
    }
  },
  ready() {
    if (this.obj.type !== 'add') {
      this.title = '编辑看板';
      this.obj.type = 'edit';
    } else {
      this.title = '添加看板';
    }
    this.getLib();
  },
  data() {
    return {
      title: '编辑看板',
      loadingRouteData: false,
      data: [],
      lib: [],
      chartList: []
    };
  },
  methods: {
    formateLib(list) {
      list.forEach((item) => {
        item.title = item.categoryName;
        item.list.forEach((_item) => {
          _item.title = _item.categoryName;
          _item.queryList.forEach((_items) => {
            _items.title = _items.queryName;
            _items.checked = _items.isCheck;
          });
          _item.children = _item.queryList;
        });
        item.children = item.list;
      });
      this.data = list;
    },
    getLib() {
      this.loadingRouteData = true;
      this.$http.get(`/chart/category/dashboard?id=${this.obj.id}`, {}
      ).then(
        res => {
          res = res.json();
          this.loadingShow = false;
          if (res.success) {
            this.loadingRouteData = false;
            this.formateLib(res.data.list);
          } else {
            this.loadingRouteData = false;
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        },
        res => {
          this.loadingShow = false;
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        }
      );
    },
    onSave() {
      if (this.obj.dashboardName.length < 1 || this.obj.dashboardName.length > 10) {
        MessageBox({
          title: '请输入看板名字，最多10个字',
          type: 'error'
        });
        return;
      }
      // 构造 chartList
      this.getNode();
      // 未选择报表, 无法保存
      if (this.chartList.length < 1) {
        MessageBox({
          title: '未选择任何报表，无法保存',
          type: 'error'
        });
        return;
      }
      this.loadingRouteData = false;
      // 提示
      let desc = '添加成功';
      let url = '/chart/dashboard/save';
      if (this.obj.type === 'edit') {
        desc = '编辑成功';
      }
      // params
      let params = {
        dashboardName: this.obj.dashboardName,
        id: this.obj.id,
        isDefault: this.obj.isDefault,
        chartList: this.chartList,
        biz: this.obj.biz
      };
      this.$http.post(url, params
      ).then(
        res => {
          res = res.json();
          if (res.success) {
            this.loadingRouteData = false;
            MessageBox({
              title: desc,
              type: 'success'
            });
            this.onClose();
            // 刷新页面数据
            this.obj.getDashBorads(res.data);
          } else {
            this.loadingRouteData = false;
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
    onClose() {
      this.show = false;
    },
    onDel() {
      this.$http.get(`/chart/dashboard/remove?id=${this.obj.id}`, {}
      ).then(
        res => {
          res = res.json();
          if (res.success) {
            this.loadingRouteData = false;
            MessageBox({
              title: '删除成功',
              type: 'success'
            });
            this.onClose();
            // 刷新页面数据
            this.obj.getDashBorads();
          } else {
            this.loadingRouteData = false;
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
    // 构造chartList
    getNode() {
      let list = this.$refs.tree.getCheckedNodes();
      this.change(list);
    },
    change(list) {
      // 选中的报表
      let i = 0;
      this.chartList = [];
      list.forEach((item, index) => {
        if (item.chartQueryId) {
          this.chartList.push({
            chartQueryId: item.chartQueryId,
            chartOrder: i
          });
          i++;
        }
      });
      // 只能选中10个报表
      if (this.chartList.length > 10) {
        MessageBox({
          title: '只能配置10张表',
          type: 'error'
        });
        this.chartList.splice(10);
        return;
      };
    },
    defaultChange(status) {
      let hasDefault = false;
      this.obj.dashBorads.forEach((item) => {
        if (item.isDefault === true) {
          hasDefault = true;
        }
      });
      if (status && hasDefault) {
        MessageBox({
          title: '已有默认看板',
          type: 'error'
        });
        return;
      }
      this.obj.isDefault = status;
    }
  }
};
</script>
<style lang="less" scoped>
.form-filter-group {
  margin-bottom: 18px;
  float: left;
  &.w280 {
    width: 380px !important;
  }
  .filter-label-add {
    padding: 0 6px;
    font-size: 14px;
    font-weight: bold;
    color: #444;
    width: 110px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
  }
  .form-control-input {
    width: 210px;
    margin-right: 30px;
  }
  .switch-warp {
    display: inline-block;
    margin-top: 6px;
  }
}
.tree-select-warp {
  height: 200px;
  overflow-y: scroll;
  border: 1px solid #a8e7e7;
  margin-right: 10px;
}
</style>