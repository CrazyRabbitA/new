<template>
  <div class="change-lib">
    <div class="step">
      <span class="step-num">3</span><span class="step-text">保存报表</span>
    </div>
    <div class="form-group">
      <label class="control-label label-required">报表名称：</label>
      <input type="text" class="form-control fl form-control-input" placeholder="请填写字段名称" v-model="queryName">
    </div>
    <div class="form-group">
      <label class="control-label">一级目录：</label>
      <d-select :options.sync="fArr" :value.sync="obj.parentId" @select="selectChange"></d-select>
    </div>
    <div class="form-group">
      <label class="control-label">二级目录：</label>
      <d-select :options.sync="sArr" :value.sync="'chartCenter'" :disable="disable"></d-select>
    </div>
    <div class="form-group">
      <label class="control-label">三级目录：</label>
      <d-select :options.sync="tArr" :value.sync="obj.id"></d-select>
    </div>
  </div>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
export default {
  props: {
    obj: {
      type: Object,
      default: null
    },
    queryName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: {},
      fArr: [],
      sArr: [{
        label: '报表中心',
        id: 'chartCenter'
      }],
      tArr: []
    };
  },
  ready() {
    this.getChartList();
  },
  methods: {
    getChartList() {
      this.$http.get('/chart/category/droplist', {}).then(
        res => {
          res = res.json();
          if (res.success) {
            this.$set('data', res.data);
            if (!this.obj.parentId) {
              this.obj.parentId = res.data.par[1][0].id;
              this.obj.id = res.data.chi[this.obj.parentId][0].id;
            }
            this.getSelect(this.data);
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
    getSelect(arr) {
      // 一级目录
      arr.par[1].forEach(item => {
        item.label = item.categoryName;
      });
      this.fArr = arr.par[1];
      // 二级目录
      arr.chi[this.obj.parentId].forEach(item => {
        item.label = item.categoryName;
      });
      this.tArr = arr.chi[this.obj.parentId];
    },
    selectChange() {
      // 当切换一级目录后改变二级目录默认值
      this.obj.id = this.data.chi[this.obj.parentId][0].id;
      this.getSelect(this.data);
    }
  }
};
</script>
<style lang="less" scoped>
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
.form-control-input {
  width: 200px;
}
.control-label {
  width: 100px;
}
.change-lib {
  padding-bottom: 40px;
}
</style>

