<template>
  <div class="off-container">
    <p class="data-title">
      <span>日期:</span>
      <daterangepicker
        :error-show.sync="errorShow"
        :start.sync="timeobj.startDate"
        :end.sync="timeobj.endDate"
        ></daterangepicker>
      <d-button class="searchfilter" size="large" type="warning" @click="search" >查询</d-button>
        <i class="timeselect">
          <span class="select-item"
            v-for="(index,item) in timeselect"
            :class="{'isactive' : timeselectactiveindex === index}"
            :key="index"
            @click="changetime(item,index)">{{item.label}}</span>
        </i>
    </p>
    <div class="select-wrapper">
      <div class="dimension-wrapper">
        <h2>
         维度及指标选择
        </h2>
        <div class="dimension-item">
          <p class="radio-group">
            <span class="title">维度：</span>
            <label for="" class="radio-label">
              <input type="radio" name="datatype" class="radio-control datatype-radio"  v-model="params.dimension" value="1"/>
                广告主
            </label>
              <label for="" class="radio-label">
              <input type="radio" name="datatype" class="radio-control datatype-radio"  v-model="params.dimension" value="2"/>
                行业
            </label>
          </p>
          <p class="radio-group">
            <span class="title">指标：</span>
            <label for="" class="radio-label">
              <input type="radio" name="data" class="radio-control datatype-radio"  v-model="lineid" value="lineConsumeTotal"/>
                消耗
            </label>
              <label for="" class="radio-label">
              <input type="radio" name="data" class="radio-control datatype-radio"  v-model="lineid" value="lineArpu"/>
                arpu值
            </label>
          </p>
        </div>
      </div>
      <!-- <div class="viod"></div> -->
      <div class="datafilter-wrapper">
        <h2>
          <span> 数据筛选条件</span>
        </h2>
        <div class="industry inds" >
          <div class="trade">
            <span> 行业：</span>
            <div class="radio-group">
              <label for="" name="strategy" class="radio-label">
                <input type="radio" @change="changetype(1)" class="radio-control strategy-radio" v-model="checktype" name="sstrategy" value="1"/>
                    单选
              </label>
              <label for="" class="radio-label">
                <input type="radio" name="sstrategy" @change="changetype(0)" class="radio-control strategy-radio" v-model="checktype"  value="0"/>
                    多选
              </label>
            </div>
          </div>
          <div class=" inspan" v-show="checktype === '0'">
            <p class="span-wrap">
              <span class="select-item"
              v-for="(index,item) in checkitem"
              :class="{'isactive':item.isactive}"
              @click="changecheckitem(item,index)"
              :key="index">{{item.label}}</span>
            </p>
            <p>
              <span class="check-box">
                <input class='checkall'
                  @click = "checkall"
                  :checked="isChecked"
                  type="checkbox">
                <span>全选/全不选</span>
              </span>
            </p>
          </div>
          <div class="radio inspan" v-show="checktype === '1'">
            <p class="span-wrap">
              <span class="select-item"
              v-for="(index,item) in radioitem"
              @click="changeradioitem(item,index)"
              :class="{'isactive':radioindex === index}"
              :key="index">{{item.label}}</span>
            </p>

          </div>
        </div>
        <p class="district">
          <span class="title">区域：</span>
          <span class="select-item"
            v-for="(index,item) in  district"
            @click="changedistrict(item)"
            :class="{'isactive' : item.active}"
            :key="index">{{item.label}}</span>
        </p>
      </div>
    </div>
    <advertoff
      :dimen="params.dimension"
      :ydata="ydata"
      :ids="'offdata'"
      :datas="linedata"></advertoff>
    <h2 style="text-align:center" v-if="params.dimension.toString() === '2' && tableheader.length === 0">该查询条件下表格无数据!</h2>
    <div class="table-wrap">
      <table v-if="params.dimension.toString() === '2' &&  tableheader.length > 0"  class="recommend-list  mt10">
      <thead>
        <tr class="tr-header">
          <th class="viod">-</th>
          <th  v-for="item in tableheader" :key="item" track-by="$index"><span>{{item}}</span></th>
        </tr>
      </thead>
      <tbody v-if="trheader">
        <tr v-for="item in trheader" :key="item"  track-by="$index" class="change-color tr-items">
          <td>{{item}}</td>
            <td v-for="td in tableheader" :key="td">
              <span v-if="linedata[item]">
                {{fixNum(linedata[item][td])}}
              </span>
            </td>
        </tr>
      </tbody>
      </table>
    </div>

    <advertpie
      v-if="lineid === 'lineConsumeTotal'"
      :datas="piedata"></advertpie>
  </div>
</template>
<script>
import MessageBox from 'components/basic/MessageBox';
import { formatDate } from 'components/utils/dateUtils';
import { _fixNum } from 'components/utils/cheatDataUtils.js';
import advertoff from './advertoff';
import advertpie from './advertpie';
export default {
  components: { advertoff, advertpie },
  data() {
    const timeselect = [
      {
        label: '昨日',
        id: 0
      },
      {
        label: '历史七日',
        id: 1
      }
    ];
    const industry = [
      {
        label: '信用卡',
        active: true
      },
      {
        label: '新闻资讯',
        active: true
      },
      {
        label: '贷款',
        active: true
      },
      {
        label: 'P2P',
        active: true
      },
      {
        label: '教育',
        active: true
      },
      {
        label: '其它行业',
        active: false
      }
    ];
    const quota = [
      {
        label: '消耗',
        id: 'lineConsumeTotal',
        index: 0
      },
      {
        label: 'arpu值',
        id: 'lineArpu',
        index: 1
      }
    ];
    const district = [
      {
        label: '华东',
        active: true
      },
      {
        label: '华北',
        active: false
      }
    ];
    return {
      industry: industry,
      quota: quota,
      district: district,
      dimensionactiveindex: 0,
      districtactiveindex: 0,
      params: {
        startDate: '',
        endDate: '',
        dimension: '2',
        aeAreaList: [],
        newTradeNameList: []
      },
      timeobj: {
        startDate: this._getStartDay(formatDate(new Date())),
        endDate: this._getEndDay(formatDate(new Date()))
      },
      modaldata: [],
      showadvert: false,
      tradeList: [],
      proplist: [],
      linedata: {},
      piedata: [],
      chartdata: {},
      lineid: 'lineConsumeTotal',
      ydata: '消耗 / 元',
      timeselect: timeselect,
      timeselectactiveindex: 1,
      loadingRouteData: true,
      isChecked: false,
      checktype: '1',
      radioindex: 0,
      checkitem: [],
      radioitem: [],
      tableData: {},
      tableheader: [],
      trheader: []
    };
  },
  methods: {
    fixNum(val) {
      if (!val) return '暂无数据';
      if (val < 1) return _fixNum(val, 2);
      return _fixNum(val, 0);
    },
    checkall() {
      this.isChecked = !this.isChecked;
      // 全选反选
      if (this.isChecked) {
        this.checkitem = this.checkitem.map(ele => {
          return {
            label: ele.label,
            isactive: true
          };
        });
      } else {
        this.checkitem = this.checkitem.map(ele => {
          return {
            label: ele.label,
            isactive: false
          };
        });
      }
      // 请求接口
      this.changetype(0);
    },
    changetype(type) {
      if (type === 0) {
        this.params.newTradeNameList = [];
        this.checkitem.forEach(ele => {
          if (ele.isactive) {
            this.params.newTradeNameList.push(ele.label);
          }
        });
        this.getchartData(this.params);
      }
      if (type === 1) {
        this.params.newTradeNameList = [
          `${this.radioitem[this.radioindex].label}`
        ];
        this.getchartData(this.params);
      }
    },
    changetime(item, index) {
      this.timeselectactiveindex = index;
      if (index === 0) {
        this.timeobj.startDate = this._getStartDay(formatDate(new Date()), 1);
        this.timeobj.endDate = this._getEndDay(formatDate(new Date()));
      } else {
        this.timeobj.startDate = this._getStartDay(formatDate(new Date()), 7);
        this.timeobj.endDate = this._getEndDay(formatDate(new Date()));
      }
      this.getchartData(this.params);
    },
    getTradelist() {
      this.$http.get('/trade').then(res => {
        res = JSON.parse(res.body);
        if (res.success) {
          let filterarr = [];
          res.data.forEach(ele => {
            if (
              ele !== '信用卡' &&
              ele !== '新闻资讯' &&
              ele !== '贷款' &&
              ele !== 'P2P' &&
              ele !== '教育'
            ) {
              filterarr.push({
                label: ele,
                isactive: false
              });
            }
          });
          // 深拷贝一层 初始化tradeList
          const industry = [
            {
              label: '信用卡',
              isactive: true
            },
            {
              label: '新闻资讯',
              isactive: true
            },
            {
              label: '贷款',
              isactive: true
            },
            {
              label: 'P2P',
              isactive: true
            },
            {
              label: '教育',
              isactive: true
            }
          ];
          this.checkitem = [...industry, ...filterarr];
          const indexcheck = this.checkitem.findIndex(
            ele => ele.label === '其他服务'
          );
          this.checkitem.splice(indexcheck, 1);
          this.checkitem.push({
            label: '其他服务',
            isactive: false
          });
          this.radioitem = res.data.map((ele, index) => {
            return {
              label: ele,
              isactive: false
            };
          });
          const indexradio = this.radioitem.findIndex(
            ele => ele.label === '其他服务'
          );
          this.radioitem.splice(indexradio, 1);
          this.radioitem.push({
            label: '其他服务',
            isactive: false
          });
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      });
    },
    getchartData(params) {
      this.params.startDate = this.timeobj.startDate;
      this.params.endDate = this.timeobj.endDate;
      // 重置
      this.params.aeAreaList = [];
      this.district.forEach(ele => {
        if (ele.active) {
          this.params.aeAreaList.push(ele.label);
        }
      });
      this.loadingRouteData = true;
      this.$http.post('/trade/data', params).then(res => {
        res = JSON.parse(res.body);
        if (res.success) {
          this.loadingRouteData = false;
          this.chartdata = res.data;
          this.linedata = res.data[this.lineid];
          let { keys, values } = Object;
          // table header计算
          this.tableheader = [];
          this.trheader = [];
          if (this.linedata) {
            this.tableheader = keys(values(this.linedata)[0]);
            this.trheader = keys(this.linedata);
          }
          // 重置 避免饼图不更新;
          if (this.lineid === 'lineArpu') {
            this.piedata = [];
          } else {
            this.piedata = res.data['consumeTotalPie'];
          }
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      });
    },
    changedistrict(item) {
      item.active = !item.active;
      const empty = this.district.every(ele => {
        return ele.active.toString() === 'false';
      });
      if (empty) {
        item.active = true;
        MessageBox({
          title: '至少选择一个区域',
          type: 'error'
        });
        return;
      }
      this.getchartData(this.params);
    },
    changeindustry(item, index) {
      if (index === 5) {
        this.showadvert = true;
        return;
      }
      item.active = !item.active;
      // 重新赋值
      this.tradeList[index].active = item.active;
      this.isChecked = this.tradeList.every(ele => ele.active);
      this.getchartData(this.params);
    },
    _getStartDay(dateStr, type = 7) {
      let start = new Date(dateStr) - 1000 * 60 * 60 * 24 * type;
      return formatDate(start);
    },
    _getEndDay(dateStr) {
      let end = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(end);
    },
    search() {
      this.getchartData(this.params);
    },
    changecheckitem(item, index) {
      item.isactive = !item.isactive;
      this.params.newTradeNameList = [];
      this.checkitem.forEach(ele => {
        if (ele.isactive) {
          this.params.newTradeNameList.push(ele.label);
        }
      });
      // 判断是否全选
      let checkall = this.checkitem.every(ele => ele.isactive);
      if (checkall) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
      this.getchartData(this.params);
    },
    changeradioitem(item, index) {
      if (index === this.radioindex) return;
      this.radioindex = index;
      this.params.newTradeNameList = [
        `${this.radioitem[this.radioindex].label}`
      ];
      this.getchartData(this.params);
    }
  },
  ready() {
    this.getTradelist();
    setTimeout(() => {
      this.changetype(1);
    }, 200);
  },
  watch: {
    'params.dimension': function(val) {
      // change的时候查询
      this.getchartData(this.params);
    },
    timeobj: {
      handler(val) {
        let start = this._getStartDay(formatDate(new Date()));
        let end = this._getEndDay(formatDate(new Date()));
        // 判断不是当日并且不是历史七日
        let istoday = val.startDate === end && val.endDate === end;
        let issevent = val.startDate === start && val.endDate === end;
        if (istoday) {
          this.timeselectactiveindex = 0;
        }
        if (issevent) {
          this.timeselectactiveindex = 1;
        }
        if (!istoday && !issevent) {
          this.timeselectactiveindex = 3;
        }
      },
      deep: true
    },
    lineid: function(val) {
      if (val === 'lineConsumeTotal') {
        this.ydata = '消耗 / 元';
        this.piedata = this.chartdata['consumeTotalPie'];
      } else {
        this.ydata = 'arpu值 / 元';
        this.piedata = [];
      }
      this.linedata = this.chartdata[val];
      // 重绘制表格
      let { keys, values } = Object;
      this.tableheader = [];
      this.trheader = [];
      if (this.linedata) {
        this.tableheader = keys(values(this.linedata)[0]);
        this.trheader = keys(this.linedata);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.selectitem() {
  .select-item {
    font-size: 16px;
    display: inline-block;
    width: 100px;
    padding: 6px 0px;
    text-align: center;
    border: 1px solid #999;
    border-right: none;
    cursor: pointer;
    &:nth-last-child(1) {
      border-right: 1px solid #999;
    }
  }
}
.commontit() {
  margin-top: 20px;
  h2 {
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
}
.commontit () {
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
}
.off-container {

    .table-wrap{
    overflow-x: auto;
    table{
      min-width: 100% !important;
      th{
        // padding:0 30px;
        height:40px;
        text-align: center;
      }
      .viod{
       padding:0 60px;
      }
      td{
        padding:0 30px;
        height:40px;
        text-align: center;
        &:nth-of-type(1){
          text-align: left;
        }
      }
    }
  }
  .change-color {
    &:nth-child(even) {
      background: #e8e7e2;
    }
  }
  .select-wrapper {
    // 高度塌陷
    zoom: 1;
    overflow: hidden;
    width: 100%;
    margin-top: 40px;
    .dimension-wrapper {
      width: 250px;
      float: left;
      .commontit;
      .dimension-item {
        .commontit;
      }
    }
    .datafilter-wrapper {
      float: left;
      width: 70%;
      border-left: 2px solid #eee;
      margin-left: 15px;
      padding-left: 15px;
      .commontit;
      .selectitem;
      h2 {
        display: block;
        height: 37px;
        span {
          float: left;
          height: 36px;
          line-height: 16px;
          margin-right: 10px;
        }
        div {
          float: left;
          height: 36px;
          margin-top: -7px;
        }
      }
    }
  }

  label {
    width: 70px;
  }
  .radio-label {
    margin-right: 10px;
  }
  .timeselect {
    font-style: normal;
    margin-left: 20px;
    .selectitem();
  }
  input {
    cursor: pointer;
    width: 14px;
    height: 14px;
  }
  .isactive {
    background: #ff795c;
    color: #fff;
  }
  .data-title {
    margin-top: 20px;
  }
  .check-box {
    // margin-left: 20px;
    font-style: normal;
    height: 34px;
    line-height: 34px;
    .checkall {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    span {
      font-size: 14px !important;
      font-weight: normal;
      vertical-align: 2px;
    }
    .icon {
      width: 16px;
      height: 16px;
    }
  }
  .trade {
    height: 34px;
    margin-bottom: 5px;
    span {
      font-weight: bold;
      float: left;
      height: 34px;
      line-height: 34px;
    }
    div {
      float: left;
      margin-left: 15px;
      margin-top: 3px;
    }
  }

  .inspan {
    // width:70%;
    // float:left;
    .span-wrap {
      width: 601px;
      margin-bottom: 20px;
      border-top: 1px solid #999;
      border-left: 1px solid #999;
      .select-item {
        font-size: 16px;
        display: inline-block;
        padding: 6px 0px;
        width: 120px;
        text-align: center;
        border: 1px solid #999;
        border-left: none;
        border-top: none;
        cursor: pointer;
      }
    }
  }
}

</style>

