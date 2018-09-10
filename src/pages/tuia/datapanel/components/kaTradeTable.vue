<template>
<div>
  <div class="advance-table">
    <table class="recommend-list mt10">
      <thead>
        <tr class="tr-header">
            <template v-for="(index, item) in columns">
              <th :key="index">
                 <label class="trade-warp">
                    {{item.title}}
                     <d-tooltip v-if="item.tooltip" :content="item.content" type="disable">
                      <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                    </d-tooltip>
                </label>
              </th>
            </template>
        </tr>
      </thead>
      </table>
      <div class="ka-recommend">
      <table class="recommend-list2">
        <thead  class="header">
          <tr class="tr-header">
              <template v-for="(index, item) in columns">
                <th :key="index">               
                  <label class="trade-warp">
                      {{item.title}}
                      <d-tooltip v-if="item.tooltip" :content="item.content" type="disable">
                        <a href="javascript:void(0)" class="iconhandle disable icon-positon">&#xe649;</a>
                      </d-tooltip>
                  </label>
                </th>
              </template>
          </tr>
      </thead>
      <tbody v-if="showTable">
        <template v-for="(index, table) in kaList">
          <tr class="tr-items" :class="{'top-title': index%2 !== 0}" :key="index">
            <template v-for="column in columns" >
              <td v-if="column.render">
                {{column.render(table[column.dataIndex], item)}}
              </td>
              <td v-else class="trade-item">
                <span v-if="column.dataIndex === 'newTrade'">
                  <b class="expand" @click="expand(index)">{{show(index) ? '-' : '+'}}</b>{{table[column.dataIndex]}}
                </span>
                <span v-else>
                  {{table[column.dataIndex]}}
                </span>
              </td>
            </template>
          </tr>
          <tr class="tr-items ka-child" :class="{'tr-items-child': !key }" v-show="show(index)" v-for="(key, item) in table.ka" :key="key">
            <td v-if="key">
            </td>
            <td v-else>
              <b class="expand" v-show="showExpand(index, 'ka')" @click="expandChild(index, 'ka')">{{showChild(index, 'ka') ? '-' : '+'}}</b>
            </td>
            <td v-if="key === 0" ><span class='relative-title'>{{item.newTrade}}</span></td>
            <td v-if="key === 1" class="rowspan" :rowspan="table.ka.length -1"><span class='relative-title' v-if="key === 1">{{item.newTrade}}</span></td>

            <td colspan="2" >{{item.accountName}}</td>
            <td colspan="2">{{item.accountOtherName}}</td>
            <td  v-if="key">
              <a @click="analysisShow(item)">{{item.avgConsumeTotal}}</a>
            </td>
            <td v-else>{{item.avgConsumeTotal}}</td>
            <td></td>
          </tr>
          <tr class="tr-items ka-child" :class="{'tr-items-child': !key }" v-show="show(index)" v-for="(key, item) in table.varyKA" :key="key">
            <td v-if="key">
            </td>
            <td v-else>
              <b class="expand" v-show="showExpand(index, 'varyKA')" @click="expandChild(index, 'varyKA')">{{showChild(index, 'varyKA') ? '-' : '+'}}</b>
            </td>
            <td v-if="key === 0" ><span class='relative-title'>{{item.newTrade}}</span></td>
            <td v-if="key === 1" class="rowspan" :rowspan="table.varyKA.length -1"><span class='relative-title' v-if="key === 1">{{item.newTrade}}</span></td>

            <td colspan="2">{{item.accountName}}</td>
            <td colspan="2">{{item.accountOtherName}}</td>
            <td v-if="key">
              <a @click="analysisShow(item)">{{item.avgConsumeTotal}}</a>
            </td>
            <td v-else>{{item.avgConsumeTotal}}</td>
            <td></td>
          </tr>
          <tr class="tr-items ka-child" :class="{'tr-items-child': !key }" v-show="show(index)" v-for="(key, item) in table.estiKA" :key="key">
            <td v-if="key">
            </td>
            <td v-else>
              <b class="expand" v-show="showExpand(index, 'estiKA')" @click="expandChild(index, 'estiKA')">{{showChild(index, 'estiKA') ? '-' : '+'}}</b>
            </td>

            <td v-if="key === 0" ><span class='relative-title'>{{item.newTrade}}</span></td>
            <td v-if="key === 1" class="rowspan" :rowspan="table.estiKA.length -1"><span class='relative-title' v-if="key === 1">{{item.newTrade}}</span></td>

            <td colspan="2">{{item.accountName}}</td>
            <td colspan="2">{{item.accountOtherName}}</td>
            <td v-if="key">
              <a @click="analysisShow(item)">{{item.avgConsumeTotal}}</a>
            </td>
            <td v-else>{{item.avgConsumeTotal}}</td>
            <td></td>
          </tr>
        </template>
      </tbody>
    </table>
    </div>
    <tableempty v-if="!showTable"></tableempty>
  </div>
  <ka-modal :show.sync="isShowModal" :date-tags-type="dateTagsType" v-ref:ka ></ka-modal>
</div>
</template>
<script>
import { _fixNum, getPrecent, deepCopy } from 'components/utils/cheatDataUtils';
import kaModal from './kaModal';
const columns = [
  {
    title: '行业',
    dataIndex: 'newTrade'
  },
  {
    title: '目标KA数',
    dataIndex: 'target',
    render: (row) => {
      return _fixNum(row, 0);
    }
  },
  {
    title: '华东目标',
    dataIndex: 'eastTarget',
    render: (row) => {
      return _fixNum(row, 0);
    }
  },
  {
    title: 'KA总数',
    dataIndex: 'kact',
    tooltip: true,
    content: '消耗大于10000元',
    render: (row) => {
      return _fixNum(row, 0);
    }
  },
  {
    title: '华东KA总数',
    dataIndex: 'eastKACt',
    sortable: true,
    render: (row) => {
      return _fixNum(row, 0);
    }
  },
  {
    title: '潜力KA数',
    tooltip: true,
    content: '消耗3000-10000元',
    dataIndex: 'estiKACt',
    render: (row) => {
      return _fixNum(row, 0);
    }
  },
  {
    title: '华东潜力KA数',
    dataIndex: 'eastEstiKACt',
    sortable: true,
    render: (row) => {
      return _fixNum(row, 0);
    }
  },
  {
    title: '完成度',
    dataIndex: 'percent',
    sortable: true,
    render: (row) => {
      return getPrecent(row);
    }
  }
];
const kaObj = {
  'newTrade': 'KA',
  'accountName': 'KA名称',
  'accountOtherName': 'KA别名',
  'avgConsumeTotal': '日均消耗',
  'varyKA': '第一次进入KA'
};
const varyObj = {
  'newTrade': '变化KA',
  'accountName': 'KA名称',
  'accountOtherName': 'KA别名',
  'avgConsumeTotal': '日均消耗',
  'varyKA': '第一次进入KA'
};
const estiObj = {
  'newTrade': '潜力KA',
  'accountName': 'KA名称',
  'accountOtherName': 'KA别名',
  'avgConsumeTotal': '日均消耗',
  'varyKA': '第一次进入KA'
};
export default {
  components: {
    kaModal
  },
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  watch: {
    list() {
      if (this.list && this.list.length > 0) {
        this.showTable = true;
        this.totalList = this.list.length;
        this.onPageChange(1);
      }
    }
  },
  computed: {
  },
  ready() {
    if (this.list && this.list.length > 0) {
      this.showTable = true;
      this.totalList = this.list.length;
      this.onPageChange(1);
    }
  },
  data() {
    return {
      kaList: [],
      showTable: false,
      totalList: 0,
      columns: columns,
      pageNum: 1,
      showArr: [],
      showChildArr: [],
      pageSize: 10,
      isShowModal: false
    };
  },
  methods: {
    fixNum: _fixNum,
    getPrecent: getPrecent,
    onPageChange(page) {
      this.pageNum = page;
      this.getPage();
    },
    analysisShow(item) {
      this.isShowModal = true;
      this.$refs.ka.getData(item);
    },
    showExpand(key, title) {
      return this.list[key][title].length > 3;
    },
    expand(val) {
      if (!this.showArr.includes(val)) {
        this.showArr.push(val);
      } else {
        this.showArr.splice(this.showArr.findIndex(item => item === val), 1);
      }
    },
    expandChild(key, title) {
      // 子列表默认显示3条数据，点击展开显示全部数据
      if (!this.showChildArr[key].includes(title)) {
        this.showChildArr[key].push(title);
        this.copyList = deepCopy(this.list);
        this.kaList[key][title] = this.copyList[key][title];
        if (title === 'ka') {
          this.kaList[key].ka.unshift(kaObj);
        }
        if (title === 'varyKA') {
          this.kaList[key].varyKA.unshift(varyObj);
        }
        if (title === 'estiKA') {
          this.kaList[key].estiKA.unshift(estiObj);
        }
      } else {
        this.showChildArr[key].splice(this.showChildArr[key].findIndex(item => item === title), 1);
        this.copyList = deepCopy(this.list);
        this.kaList[key][title] = this.copyList[key][title].slice(0, 3);
        if (title === 'ka') {
          this.kaList[key][title].unshift(kaObj);
        }
        if (title === 'varyKA') {
          this.kaList[key].varyKA.unshift(varyObj);
        }
        if (title === 'estiKA') {
          this.kaList[key].estiKA.unshift(estiObj);
        }
      }
    },
    showChild(index, val) {
      return this.showChildArr[index].includes(val);
    },
    show(val) {
      return this.showArr.includes(val);
    },
    getPage() {
      this.kaList = deepCopy(this.list);
      // 把刚开始拿到的数据做处理，标题头作为数据插入
      this.kaList.map((el) => {
        this.showChildArr.push([]);
        if (el.ka.length > 3) {
          el.ka = el.ka.slice(0, 3);
        }
        if (el.varyKA.length > 3) {
          el.varyKA = el.varyKA.slice(0, 3);
        }
        if (el.estiKA.length > 3) {
          el.estiKA = el.estiKA.slice(0, 3);
        }
        el.ka.unshift(kaObj);
        el.varyKA.unshift(varyObj);
        el.estiKA.unshift(estiObj);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.advance-table {
  margin-top: -60px;
  padding-left:3px;
.recommend-list {
  position: sticky;
  top: 0px;
  z-index: 999;
}
.ka-recommend {
  overflow-y: auto;
  max-height: 400px;
}
.recommend-list, .recommend-list2 {
  width: 100%;
  border-radius:2px;
  margin-top: -30px;
  table-layout: fixed;
.header {
  visibility: hidden;
}
th {
  min-width:120px;
  position:relative;
  white-space: nowrap;
}
td {
  div {
    text-align: center;
  }
}
.td-title {
  border: none;
  vertical-align: middle;
  text-align: center;
}
.ka-child {
  color: #6d6d6d;
  background: #fcfeff;
  .rowspan {
  color: #212020;
  text-align: center;
  }
.expand{
  width: 16px;
  height: 16px;
  border-radius: 8px;
  line-height: 10px;
  float: right;
  margin-right: -50px;
  text-align: center;
  border: 1px solid #ccc;
  cursor: pointer;
 }
  td {
  padding: 8px 50px 8px 10px;
  }
  td:first-child {
  background: #fff;
  }
}
.top-title {
  background: rgb(245,247,249);
}
.tr-items-child {
  background: #e0e9ef;
  td:nth-child(2) {
  border-left: 20px solid #e0e9ef;
}
.relative-title {
  position: relative;
  left: -10px;
}
}
.trade-warp {
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  .sort-arrow {
    display: inline-block;
    height: 20px;
    width: 12px;
    position: relative;
    vertical-align: middle;
  .sort-icon {
    position: absolute;
    display: inline-block;
    font-size: 12px;
    color: #ccc;
    height: 12px;
    line-height: 1;
  &:nth-child(2) {
    top: 6px;
  }
  &:hover {
    color:#29b6b0;
  }
  &.on {
    color: #29b6b0;
  }
  }
  }
  }
  .num {
    width: 80%;
    text-align: right;
    margin: auto;
    transform: translateX(-20%);
  }
}
}
  .trade-item {
    position:relative;
    .expand {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    line-height: 16px;
    display: inline-block;
    text-align: center;
    border: 1px solid #ccc;
    cursor: pointer;
    position: absolute;
    left: 0px;
    top: 6px;
  }
}

</style>
