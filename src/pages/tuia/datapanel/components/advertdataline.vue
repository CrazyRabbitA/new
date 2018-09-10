<template>
  <div class="line-container">
    <div class="select-wrapper">
      <div class="datafilter-wrapper">
        <h2>
          <p>数据筛选条件:</p>
          <div class="radio-group">
            <label for="" name="strategy" class="radio-label">
              <input type="radio" @change="changetype(1)" class="radio-control strategy-radio" v-model="checktype" name="strategy" value="1"/>
                  单选
            </label>
            <label for="" class="radio-label">
              <input type="radio" name="strategy" @change="changetype(0)" class="radio-control strategy-radio" v-model="checktype"  value="0"/>
                  多选
            </label>
          </div>
        </h2>
        <p></p>
        <div class="industry" v-show="checktype === '0'">
          <p class="title">行业：</p>
          <p>
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
        <div class="industry"  v-show="checktype === '1'">
          <p class="title">行业：</p>
          <p>
            <span class="select-item"
            v-for="(index,item) in radioitem"
             @click="changeradioitem(item,index)"
            :class="{'isactive':radioindex === index}"
            :key="index">{{item.label}}</span>
          </p>
          <p>
          </p>
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
    <advertline
      :ydata="ydata"
      :ids="'linedata'"
      :datas="linedata"></advertline>
      <div class="table-wrap">
        <table  class="recommend-list  mt10">
            <thead>
              <tr class="tr-header">
                <th class="viod">-</th>
                <th v-for="item in tableheader" :key="item"  track-by="$index" >{{item}}</th>
              </tr>
            </thead>
            <tbody>
              <tr  class="change-color tr-items">
                <td>总计</td>
                  <td v-for="item in tablebody" :key="item"  track-by="$index" >
                    {{fixNums(item)}}
                  </td>
              </tr>
            </tbody>
          </table>
      </div>
  </div>
</template>
<script>
import advertline from './advertline';
import { _fixNum } from 'components/utils/cheatDataUtils.js';
import MessageBox from 'components/basic/MessageBox';
export default {
  components: { advertline },
  data() {
    return {
      checkitem: [],
      radioitem: [],
      params: {
        newTradeNameList: [],
        aeAreaList: []
      },
      modaldata: [],
      showadvert: false,
      tradeList: [],
      isChecked: false,
      linedata: {},
      ydata: '消耗 / 元',
      checktype: '1',
      radioindex: 0,
      loadingRouteData: true,
      district: [
        {
          label: '华东',
          active: true
        },
        {
          label: '华北',
          active: false
        }
      ],
      tableData: [],
      tableheader: [],
      tablebody: []
    };
  },
  methods: {
    fixNum(val) {
      if (!val) return '暂无数据';
      if (val < 1) return _fixNum(val, 2);
      return _fixNum(val, 0);
    },
    fixNums(val) {
      return _fixNum(val, 2);
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
    getTradelist() {
      this.$http.get('/trade/realtime').then(res => {
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
    getchartData(params) {
      this.loadingRouteData = true;
      // 重置
      this.params.aeAreaList = [];
      this.district.forEach(ele => {
        if (ele.active) {
          this.params.aeAreaList.push(ele.label);
        }
      });
      this.$http.post('/trade/realtime/data', params).then(res => {
        this.loadingRouteData = false;
        res = JSON.parse(res.body);
        if (res.success) {
          this.linedata = res.data;
          this.tableData = res.data.sumLine;
          for (let [keys, values] of Object.entries(this.tableData)) {
            if (values) {
              this.tableheader.push(keys);
              this.tablebody.push(values);
            }
          };
          this.tableheader = this.tableheader.map((ele) => {
            if (Number(ele) < 10) {
              ele = `0${ele} : 00`;
            } else {
              ele = `${ele} : 00`;
            };
            return ele;
          });
          // 沉稳 踏实 可靠
          // console.log(this.tableheader);
          // console.log(this.tablebody);
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      });
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
  }
};
</script>
<style lang="less" scoped>
.selectitem() {
  .select-item {
    font-size: 16px;
    display: inline-block;
    padding: 6px 0px;
    width: 75px;
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
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 20px;
    margin-bottom: 20px;
    p {
      float: left;
    }
    div {
      float: left;
      margin-left: 20px;
      padding-top: 3px;
    }
  }
}
.commontit () {
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
}
.line-container {
   .table-wrap{
    overflow-x: auto;
    table{
      min-width: 100% !important;
      th{
        padding:0 15px;
        height:40px;
      }
      .viod{
       padding:0 30px;
      }
      td{
        padding:0 15px;
        height:40px;
      }
    }
  }
  .datafilter-wrapper {
    display: inline-block;
  }
  .select-wrapper {
    display: inline-block;
    .datafilter-wrapper {
      display: block;
    }
    .dimension-wrapper {
      width: 250px;
      float: left;
    }
    .viod {
      float: left;
      height: 160px;
      margin: 0 15px;
      width: 2px;
      background: #eee;
    }
    .datafilter-wrapper {
      float: left;
    }
  }
  label {
    width: 70px;
  }
  .radio-label {
    margin-right: 10px;
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
  .dimension-wrapper {
    .commontit;
    .dimension-item {
      .commontit;
    }
    .quota {
      font-size: 0px;
      .selectitem;
    }
  }
  .datafilter-wrapper {
    .commontit;
    .selectitem;
    p {
      margin-top: 10px;
    }
  }
  .check-box {
    margin-left: 20px;
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

  .industry {
    display: inline-block;
    p {
      float: left;
    }
    p:nth-child(1) {
      width: 80px;
    }
    p:nth-child(2) {
      // width:70%;
      width: 601px;
      border-top: 1px solid #999;
      border-left: 1px solid #999;
    }
    p:nth-child(3) {
      width: 110px;
    }
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
</style>

