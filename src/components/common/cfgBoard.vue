<template>
  <div>
    <div class="cfg-area" v-if="dashBorads.length > 0">
      <div class="cfg-board" >
        <div class="cfg-board-list">
            <div class="cfg-board-item" :class="item.isSelect ? 'active': ''" :style="{ backgroundColor: colorArr[index]}" v-for="(index, item) in dashBorads" track-by="$index" @click="changeBorad(item)">{{item.dashboardName}}
              <div class="fix" :style="{ backgroundColor: colorArr[index]}"></div>
            </div>
        </div>
        <div class="cfg-board-add" >
          <d-button type="primary" @click="add">添加</d-button>
        </div>
      </div>
      <div class="cfg-sort"  v-if="dashBorads.length > 0">
        <span>报表速达
          <d-tooltip content="点击报表名字快速访问报表，拖动报表可修改报表在看板的位置。" type="disable">
            <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
          </d-tooltip>：
        </span>
        <div class="cfg-sort-list" v-sortable="options" v-if="isShowChartList">
          <template v-for="(index, item) in chartList" track-by="$index">
            <div class="cfg-sort-item" :class="item.isCurrentChart ? 'cfg-sort-item-active' : ''"  draggable="true"  @click="goAnchor('#q'+item.chartQueryId, item)">{{item.queryName}}</div>
          </template>
        </div>
        <div class="cfg-sort-add">
          <d-button type="primary" @click="edit">编辑</d-button>
        </div>
      </div>
    </div>
    <div class="cfg-no-board" v-else>
      <div class="cfg-board-no" >点击右侧按钮定制你的专属看板</div>
      <div class="cfg-board-add" >
        <d-button type="primary" @click="add">添加</d-button>
      </div>
    </div>
    <component :is="currenteView" :obj.sync="currentBorad" :show="showChartSelectModal" ></component>
  </div>  
</template>
<script>
  import chartSelectModal from './components/chartSelectModal';
  import boardMixins from './mixins/boardMixins';
  import sortList from 'components/utils/sortList';
  import MessageBox from 'components/basic/MessageBox';
  export default {
    mixins: [boardMixins],
    components: {
      chartSelectModal
    },
    props: {
      dashBorads: {
        type: Array,
        defaulut: []
      },
      chartList: {
        type: Array,
        default: []
      },
      getChartList: {
        type: Function,
        default: null
      },
      getDashBorads: {
        type: Function,
        default: null
      },
      getCurrentBorad: {
        type: Function,
        default: null
      },
      currentBorad: {
        type: Object,
        default: null
      },
      biz: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        currenteView: '',
        showChartSelectModal: false,
        isShowChartList: true,
        // 拖拽配置
        options: {
          onUpdate: this.updateSort,
          filter: '.disabled'
        }
      };
    },
    methods: {
      goAnchor(selector, item) {
        this.isShowChartList = false;
        this.chartList.forEach((_item) => {
          _item.isCurrentChart = false;
        });
        item.isCurrentChart = true;
        var anchor = this.$parent.$el.querySelector(selector);
        document.documentElement.scrollTop = anchor.offsetTop;
        this.$nextTick(() => {
          this.isShowChartList = true;
        });
      },
      updateSort(event) {
        // 数据更新时，更新对应的数据
        this.isShowChartList = false;
        this.chartList = sortList(this.chartList, event.newIndex, event.oldIndex);
        this.$nextTick(() => {
          this.isShowChartList = true;
        });
        // 保存排序结果
        this.sortSave();
      },
      // 保存排序结果
      sortSave() {
        let params = {
          dashboardName: this.currentBorad.dashboardName,
          id: this.currentBorad.id,
          isDefault: this.currentBorad.isDefault,
          chartList: this.chartList
        };
        this.$http.post('/chart/dashboard/save', params
        ).then(
          res => {
            res = res.json();
            if (res.success) {
            } else {
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
      // 切换默认看板
      changeBorad(item) {
        if (item.isSelect === true) {
          return;
        }
        this.dashBorads.forEach((_item) => {
          _item.isSelect = false;
        });
        item.isSelect = true;
        this.getChartList(item.id);
      },
      // 添加看板
      add() {
        // 构建选中  选中看板
        this.currentBorad = {
          type: 'add',
          isDefault: false,
          isSelect: true,
          dashboardName: '',
          id: '',
          getDashBorads: this.getDashBorads,
          biz: this.biz,
          dashBorads: this.dashBorads
        };
        this.currenteView = '';
        this.showChartSelectModal = false;
        this.$nextTick(() => {
          this.currenteView = 'chartSelectModal';
          this.showChartSelectModal = true;
        });
      },
      // 编辑看板
      edit() {
        // 获取需要编辑的看板
        this.getCurrentBorad();
        this.currentBorad.type = 'edit';
        this.currentBorad.biz = this.biz;
        this.currenteView = '';
        this.showChartSelectModal = false;
        this.currentBorad.dashBorads = this.dashBorads;
        this.$nextTick(() => {
          this.currenteView = 'chartSelectModal';
          this.showChartSelectModal = true;
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .cfg-area {
     background-color: #E4E4E4;
     padding: 20px 10px 0px 20px;
    .cfg-board {
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
      .cfg-board-list {
        display: inline-flex;
        width: 80%;
        .cfg-board-item {
          position: relative;
          padding: 5px 10px;
          margin: 0 10px;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.4 ease;
          &:hover {
            transform: scale(1.1);
          }
          &.active {
            transform: scale(1.2);
            .fix {
              position: absolute;
              width: 20px;
              height: 20px;
              left: 50%;
              top: 10px;
              z-index: -1;
              transform: translate(-50%) rotate(-45deg);
            }
          }
        }
      }
      .cfg-board-add {
        float: right;
        margin-top: 6px;
      }
    }
    .cfg-sort {
      .cfg-sort-list {
        display: inline-flex;
        flex-wrap: wrap;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 80%;
        .cfg-sort-item {
          padding: 5px 10px;
          margin: 5px 20px;
          color: #000000b5;
          border: 1px solid  #000;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.4 ease;
          &:hover {
            transform: scale(1.1);
          } 
          &.cfg-sort-item-active {
            background-color:#fe8002;
            color: #fff;
            border: none;
          }
        }
      }
      .cfg-sort-add {
        float: right;
        margin-top: 36px;
      }
    }
  }
  .cfg-no-board {
    padding-bottom: 40px;
    border-bottom: 2px solid #000;
    .cfg-board-no {
      padding-top: 10px;
      font-size: 20px;
      text-align: center;
    }
    .cfg-board-add {
      float: right;
      margin-top: 6px;
    }
  }
</style>

