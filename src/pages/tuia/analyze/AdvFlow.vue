<template>
  <div class="adv-effect-warp">
    <pagetitle title="广告流量统计" class="adv-effect-title"></pagetitle>
    <div class="filter-serach">
      <div class="form-filter-group cf">
        <p class="filter-label fl filter-label-flow">时间：</p>
        <daterangepicker :start.sync="params.startDate" :end.sync="params.endDate" :range="30"></daterangepicker>
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">媒体：</p>
        <span><input type="radio" name="app" v-model="params.app" value="0">不限</span>
        <span><input type="radio" name="app" v-model="params.app" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf" v-if="params.app !== '0'">
        <div class="add-app">
          <span>共{{addAppParams.appNum}}个</span>
          <input type="text" class="form-control app-input" placeholder="多个appId空格隔开" v-model= "addAppParams.appId">
          <d-button class="searchfilter" size="large" type="warning" @click="addApp">添加媒体</d-button>
        </div>
        <table class="recommend-list mt10">
          <thead>
            <tr class="tr-header">
              <template v-for="column in columns">
                <th>{{column.title}}</th>
              </template>
            </tr>
          </thead>
          <tbody v-if="data && data.length !== 0">
            <tr class="tr-items" v-for="(index, item) in data" track-by="$index">
              <template v-for="column in columns">
                  <template v-if="column.action">
                    <td><a href="javascript:;" @click="delApp(index)">删除</a></td>
                  </template>
                  <template v-else>
                    <td>{{item[column.dataIndex]}}</td>
                  </template>
              </template>
            </tr>
          </tbody>
        </table>
        <tableempty v-if="data && data.length === 0"></tableempty>
      </div>
       <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">广告位：</p>
        <span><input type="radio" name="slot" v-model="params.slot" value="0">不限</span>
        <span><input type="radio" name="slot" v-model="params.slot" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf" v-if="params.slot !== '0'">
        <div class="add-app">
          <span>共{{addSlotParams.appNum}}个</span>
          <input type="text" class="form-control app-input" placeholder="多个slotId空格隔开" v-model= "addSlotParams.slotId">
          <d-button class="searchfilter" size="large" type="warning" @click="addSlot">添加广告位</d-button>
        </div>
        <table class="recommend-list mt10">
          <thead>
            <tr class="tr-header">
              <template v-for="column in slotColumns">
                <th>{{column.title}}</th>
              </template>
            </tr>
          </thead>
          <tbody v-if="slotData && slotData.length !== 0">
            <tr class="tr-items" v-for="(index, item) in slotData" track-by="$index">
              <template v-for="column in slotColumns">
                  <template v-if="column.action">
                    <td><a href="javascript:;" @click="delSlot(index)">删除</a></td>
                  </template>
                  <template v-else>
                    <td>{{item[column.dataIndex]}}</td>
                  </template>
              </template>
            </tr>
          </tbody>
        </table>
        <tableempty v-if="slotData && slotData.length === 0"></tableempty>
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">地域：</p>
        <span><input type="radio" name="area" v-model="params.area" value="0">不限</span>
        <span><input type="radio" name="area" v-model="params.area" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf" v-show="params.area !== '0'">
        部分地域选择：<span>{{areaList}}</span>
        <d-button class="searchfilter" size="large" type="warning" @click="addArea">添加地域</d-button>

      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">时段：</p>
        <span><input type="radio" name="time" v-model="params.time" value="0">不限</span>
        <span><input type="radio" name="time" v-model="params.time" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div v-show="params.time !== '0'">  
          <time-range :select-node.sync="timeNode"></time-range>
        </div>
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">顺序：</p>
        <span><input type="radio" name="sort" v-model="params.sort" value="0">不限</span>
        <span><input type="radio" name="sort" v-model="params.sort" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div class="quota-list-flow" v-show="params.sort !== '0'">  
          <d-checkbox-group :value.sync="sortList">
            <template v-for="(index,item) in sortArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>  
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">设备价值：</p>
        <span><input type="radio" name="platform" v-model="params.platform" value="0">不限</span>
        <span><input type="radio" name="platform" v-model="params.platform" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div class="quota-list-flow" v-show="params.platform !== '0'">  
          <d-checkbox-group :value.sync="platformList">
            <template v-for="(index,item) in platformArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>  
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">操作系统：</p>
        <span><input type="radio" name="sys" v-model="params.sys" value="0">不限</span>
        <span><input type="radio" name="sys" v-model="params.sys" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div class="quota-list-flow" v-show="params.sys !== '0'">  
          <d-checkbox-group :value.sync="sysList">
            <template v-for="(index,item) in sysArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>  
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">网络类型：</p>
        <span><input type="radio" name="net" v-model="params.net" value="0">不限</span>
        <span><input type="radio" name="net" v-model="params.net" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div class="quota-list-flow" v-show="params.net !== '0'">  
          <d-checkbox-group :value.sync="netList">
            <template v-for="(index,item) in netArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>  
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">手机品牌：</p>
        <span><input type="radio" name="phone" v-model="params.brand" value="0">不限</span>
        <span><input type="radio" name="phone" v-model="params.brand" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div class="quota-list-flow" v-show="params.brand !== '0'">  
          <d-checkbox-group :value.sync="brandList">
            <template v-for="(index,item) in brandArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>  
      </div>
      <div class="form-filter-group cf form-group-radio">
        <p class="filter-label fl filter-label-flow">流量来源：</p>
        <span><input type="radio" name="appFlowType" v-model="params.appFlowType" value="0">不限</span>
        <span><input type="radio" name="appFlowType" v-model="params.appFlowType" value="1">自定义</span>
      </div>
      <div class="form-filter-group cf">
        <div class="quota-list-flow" v-show="params.appFlowType !== '0'">  
          <d-checkbox-group :value.sync="appFlowTypeList">
            <template v-for="(index,item) in appFlowTypeArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item.id">{{item.title}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>  
      </div>
    </div>
    <div class="result-list">
      <div class="result-item">
        <div>日均发券UV：<span class="text">{{result.launchPvAvg}}</span></div>
        <div>累计发券PV：<span class="text">{{result.launchPvTotal}}</span></div>
      </div>  
      <div class="result-item">
        <div>日均点击UV：<span class="text">{{result.efclickPvAvg}}</span></div>
        <div>累计广告点击PV：<span class="text">{{result.efclickPvTotal}}</span></div>
      </div>
      <div class="result-item">
        <div>点击均价：<span class="text">{{result.clickPrice}}</span></div>
        <div>累计消耗：<span class="text">{{result.adConsumeTotal}}</span></div>
      </div>
      <div class="button-warp result-item">        
        <d-button class="searchfilter" size="large" type="warning" @click="search">查询</d-button>
      </div>
    </div>
    <area-modal :show.sync="areaModalShow" :check-list.sync="checkList" :area-list.sync="areaList"></area-modal>
  </div> 
</template>
<script>
import timeRange from './components/timeRange';
import checkBoxMixins from './mixins/checkBoxMixins';
import MessageBox from 'components/basic/MessageBox';
import areaModal from './components/areaModal';
import { _fixNum } from 'components/utils/cheatDataUtils';
import { formatDate } from 'components/utils/dateUtils';

const columns = [
  {
    title: '应用ID',
    dataIndex: 'appId'
  },
  {
    title: '应用名称',
    dataIndex: 'appName'
  },
  {
    title: '应用来源',
    dataIndex: 'appSource'
  },
  {
    title: '操作',
    action: true
  }];
const slotColumns = [
  {
    title: '广告位ID',
    dataIndex: 'slotId'
  },
  {
    title: '广告位名称',
    dataIndex: 'slotName'
  },
  {
    title: '媒体ID',
    dataIndex: 'appId'
  },
  {
    title: '媒体名称',
    dataIndex: 'appName'
  },
  {
    title: '应用来源',
    dataIndex: 'appSource'
  },
  {
    title: '操作',
    action: true
  }
];
export default {
  components: {
    timeRange,
    areaModal
  },
  mixins: [ checkBoxMixins ],
  data() {
    return {
      columns: columns,
      slotColumns: slotColumns,
      checkList: [],
      areaList: '',
      data: [],
      slotData: [],
      areaModalShow: false,
      result: {
        launchPvTotal: '--',
        efclickPvTotal: '--',
        adConsumeTotal: '--',
        launchPvAvg: '--',
        efclickPvAvg: '--',
        clickPrice: '--'
      },
      addAppParams: {
        appId: '',
        appNum: 0
      },
      addSlotParams: {
        appId: '',
        appNum: 0
      },
      params: {
        startDate: this._getYesDay(formatDate(new Date())),
        endDate: this._getYesDay(formatDate(new Date())),
        app: '0',
        appList: '',
        slot: '0',
        slotList: '',
        area: '0',
        areaList: '',
        time: '0',
        timeNode: '',
        sort: '0',
        sortList: '',
        platform: '0',
        platformList: '',
        sys: '0',
        sysList: '',
        net: '0',
        netList: '',
        brand: '0',
        brandList: '',
        appFlowType: '0',
        appFlowTypeList: ''
      }
    };
  },
  methods: {
    _getYesDay(dateStr) {
      let yes = new Date(dateStr) - 1000 * 60 * 60 * 24;
      return formatDate(yes);
    },
    addApp() {
      this.$http.get(`/tuia/app/info?appId=${this.addAppParams.appId}`, {}
        ).then((res) => {
          res = res.json();
          if (res.success) {
            this.data = res.data;
            this.addAppParams.appNum = res.data.length;
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        });
    },
    delApp(index) {
      this.data.splice(index, 1);
      this.addAppParams.appNum--;
    },
    addSlot() {
      this.$http.get('/slot', {params: {
        slotId: this.addSlotParams.slotId
      }}
        ).then((res) => {
          res = res.json();
          if (res.success) {
            this.slotData = res.data;
            this.addSlotParams.appNum = res.data.length;
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        });
    },
    delSlot(index) {
      this.slotData.splice(index, 1);
      this.addSlotParams.appNum--;
    },
    addArea() {
      this.areaModalShow = true;
    },
    search() {
      this.appList = [];
      this.data.forEach(item => {
        this.appList.push(item.appId);
      });
      this.slotList = [];
      this.slotData.forEach(item => {
        this.slotList.push(item.slotId);
      });
      this.params.appList = this.appList.join(',');
      this.params.slotList = this.slotList.join(',');
      this.params.areaList = this.checkList.join(',');
      this.params.timeNode = this.timeNode.join(',');
      this.params.sortList = this.sortList.join(',');
      this.params.platformList = this.platformList.join(',');
      this.params.sysList = this.sysList.join(',');
      this.params.netList = this.netList.join(',');
      this.params.brandList = this.brandList.join(',');
      this.params.appFlowTypeList = this.appFlowTypeList.join(',');
        // 手机品牌
      this.$http.post('/eyes/flow/effect/statistic', this.params
        ).then((res) => {
          res = res.json();
          if (res.success) {
            this.result.launchPvTotal = _fixNum(res.data.launchPvTotal, 0);
            this.result.efclickPvTotal = _fixNum(res.data.efclickPvTotal, 0);
            this.result.adConsumeTotal = _fixNum(res.data.adConsumeTotal);
            this.result.launchPvAvg = _fixNum(res.data.launchPvAvg, 0);
            this.result.efclickPvAvg = _fixNum(res.data.efclickPvAvg, 0);
            this.result.clickPrice = _fixNum(res.data.clickPrice);
          } else {
            MessageBox({
              title: res.desc,
              type: 'error'
            });
          }
        }, (res) => {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        });
    }
  }
};
</script>
<style lang="less">
.adv-effect-warp {
  .filter-serach {
    margin: 10px 0;
    padding-bottom: 40px;
  }
  .add-app {
    display: inline-block;
    .app-input {
      display: inline-block;
      width: 200px;
    }
  }
  .form-filter-group {
    margin-bottom: 18px;
    float: none;
    .filter-label-flow {
      font-size: 14px;
      font-weight: bold;
      color: #444;
      width: 80px;
      text-align: left;
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
    }
    .form-control-flow {
      width: 260px;
      margin-right: 30px;
    }
    .datepicker-input {
      width: 160px !important;
    }
    .iconhandle {
      right: 26px !important;
    }
  }
  .form-group-radio {
    input[type="radio"] {
      margin: 0 6px;
      width: 13px;
      height: 13px;
    }
    span {
      display: inline-block;
      padding-top: 5px;
      font-size: 14px; 
    }
    padding-top: 8px;
  }
  .quota-list-flow {
    margin-left: 76px; 
    margin-bottom: 20px;
    .quota-item {
      display: inline-block;
      width: 180px;
      .icon {
        font-size: 14px !important;
      }
    }
  }
  .result-list {
    position: fixed;
    bottom: 20px;
    padding: 5px 10px;
    left: 62%;
    margin-left: -350px;
    border: 1px solid #e3e3e3;
    border-radius: 4px; 
    background-color: #fff;
    .result-item {
      display: inline-block;
      div {
        padding:5px 10px;
        &:nth-child(1) {
          font-size: 16px;
        }
        &:nth-child(2) {
          font-size: 14px;
        }
      }
      &.button-warp {
        position: relative;
        top: -10px;
        margin-left: 20px;
      }
    }
  }
  .checkbox-group {
    display: inline-block;
    padding-left: 10px;
    width: 100%;
    .d-checkbox-control {
      padding-left: 18px;
      margin-right: 20px;
      .icon {
        width: 14px;
        height: 14px;
      }
    }
  }
}

</style>


