<template>
  <div class="chart-area">
    <div class="chart-area-show-chart" :style="classObject.class"> 
      <h1>{{dataObj.title}}</h1>
      <p class="tip" v-if="dataObj.variance">定向条件区分度：{{dataObj.variance}}  
        <tooltip content="区分度表示该定向条件不同粒度的差异度。定向条件区分度数值越大，越优先分析。" type="disable">
          <a href="javascript:void(0)" class="iconhandle disable">&#xe649;</a>
        </tooltip>
      </p>
      <div class="filter-item-select cf">
        <div class="bar-select fl" v-if="dataObj.isShowSortItem">
          <p class="filter-label fl">{{dataObj.sortItemName}}：</p>
          <d-select :options.sync="dataObj.sortItemArr" :value.sync="dataObj.sortItem" @select="sortItemChange"></d-select>
        </div>
        <div class="bar-select fr" v-if="dataObj.isShowFilterItem">
          <p class="filter-label fl filter-label-large">{{dataObj.filterItemName}}：</p>
          <d-select :options.sync="dataObj.filterItemArr" :value.sync="dataObj.filterItem" @select="sortItemChange"></d-select>
        </div>
      </div>
      <div class="bar-scroll-area">
        <div class="bar-scroll-area-content" :style="chartWarpWidth">
          <template v-if="dataObj.chartType === 'timeInterval' || dataObj.chartType === 'provinces'">
            <div :id="chartId" style="height: 300px; width: 2000px"></div>
          </template>
          <template  v-else>
            <div :id="chartId" :style="chartStyle"></div>
          </template>
          <d-checkbox-group :value.sync="checkList" :checkboxstyle="chartWarpWidth">
            <template v-for="(index,item) in newChartData">
              <template v-if="dataObj.chartType === 'apps' || dataObj.chartType === 'slot' && dataObj.filterItem !== 'other'">
                <template v-if="item.name === '其它'">
                  <d-checkbox :name="item.id"  @change="selectChange">其它</d-checkbox>
                </template> 
                <template v-else>
                  <d-checkbox :name="item.id" :boxstyle="boxstyle" @change="selectChange">{{(item.name&&item.name.indexOf(',') > -1 ? '其它' : item.name)|| (item.name === '' ? '其它' : item.name)}}</d-checkbox>
                </template>
              </template>
              <!-- <template v-if="dataObj.chartType === 'appFlowType'">
                <d-checkbox :name="item.id" @change="selectChange"></d-checkbox>
              </template> -->
              <template v-else>
                <!-- <d-checkbox :name="item.id" @change="selectChange">{{(item.name.indexOf(',') > -1 ? '其它' : item.name)|| (item.name === '' ? '其它' : item.name)}}</d-checkbox> -->
                <d-checkbox :name="item.id" @change="selectChange">{{(item.name.indexOf(',') > -1 ? '其它' : item.name)|| (item.name === '' ? '其它' : item.name)}}</d-checkbox>
              </template>

            </template>
          </d-checkbox-group>
        </div>  
      </div>
    </div>
    <div class="select-item-color">
      <d-checkbox-group :value.sync="colorCheckList">
        <template v-for="(index,item) in selectItemColorArr">
          <d-checkbox :name="item.id" @change="colorSelectChange(item.id)">{{item.label}}</d-checkbox>
        </template>
        <span class="select-rate">已勾选对象消耗占比： {{costRate}}</span>
      </d-checkbox-group>
    </div>
  </div>
</template>
<script>
  import barChartMixins from './barChartMixins.js';
  import advEffectBarChartMixins from './advEffectBarChartMixins.js';
  import Tooltip from 'components/basic/Tooltip';
  const selectItemColorArr = [
    {
      label: '全选',
      id: 'all',
      isChecked: 'true'
    }, {
      label: '反选',
      id: 'invert',
      isChecked: 'true'
    }, {
      label: '黑色',
      id: 'black',
      isChecked: 'true'
    }
  ];
  const _selectItemColorArr = [
    {
      label: '全选',
      id: 'all',
      isChecked: 'true'
    }, {
      label: '反选',
      id: 'invert',
      isChecked: 'true'
    }, {
      label: '红色',
      id: 'red',
      isChecked: 'true'
    }, {
      label: '绿色',
      id: 'green',
      isChecked: 'true'
    }, {
      label: '黑色',
      id: 'black',
      isChecked: 'true'
    }
  ];
  export default {
    mixins: [barChartMixins, advEffectBarChartMixins],
    components: {
      Tooltip
    },
    props: {
      chartId: {
        type: String,
        default: ''
      },
      dataObj: {
        type: Object,
        default: () => {
          return {};
        }
      },
      barWidth: {
        type: Number,
        default: 50
      },
      classObject: {
        type: Object,
        default: () => {
          return {
            class: {
              height: 'auto'
            },
            barWidth: 50
          };
        }
      },
      costPay: {
        type: Number,
        default: 0
      },
      costCheck: {
        type: Number,
        default: 0
      },
      checkList: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    watch: {
      'dataObj.chartData': function(newValue, oldValue) {
        this.isFetchData = true;
        this.sortItemChange();
        this.selectItemColorArr = selectItemColorArr;
        this.getRate();
      },
      'costPay': function(newValue, oldValue) {
        this.isFetchData = true;
        this.getChartDate(this.dataObj.chartData);
        this.selectItemColorArr = _selectItemColorArr;
      },
      'costCheck': function(newValue, oldValue) {
        this.selectItemColorArr = _selectItemColorArr;
      },
      'checkList': function() {
        this.getRate();
      }
    },
    data() {
      return {
        isFirst: true,
        isFetchData: false,
        isFirstFetchData: true,
        newChartData: [],
        colorCheckList: [],
        selectItemColorArr: _selectItemColorArr,
        otherApps: [],
        chartStyle: {
          height: '300px',
          width: '100%'
        },
        chartWarpWidth: {
          paddingLeft: '10px',
          width: '100%'
        },
        boxstyle: {
          // width: '140px',
          marginRight: 20
        },
        costRate: '0%'
      };
    },
    methods: {
      sortItemChange() {
        let self = this;
        if (self.dataObj.chartType === 'apps' || self.dataObj.chartType === 'slot') {
          let len = self.dataObj.chartData.length;
          self.chartStyle = {
            height: '300px',
            width: '100%'
          };
          self.chartWarpWidth = {
            paddingLeft: '10px',
            width: '100%'
          };
          self.classObject.barWidth = 50;
          switch (self.dataObj.filterItem) {
            case 'TOP10':
              if (len < 11) {
                self.chartStyle = {
                  height: '300px',
                  width: 11 * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: 11 * 140 + 'px'
                };
              } else {
                self.chartStyle = {
                  height: '300px',
                  width: 11 * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: 11 * 140 + 'px'
                };
              };
              break;
            case 'TOP30':
              if (len > 11 && len < 31) {
                self.chartStyle = {
                  height: '300px',
                  width: len * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: len * 140 + 'px'
                };
              } else {
                self.chartStyle = {
                  height: '300px',
                  width: 31 * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: 31 * 140 + 'px'
                };
              }
              break;
            case 'TOP50':
              if (len > 11 && len < 31) {
                self.chartStyle = {
                  height: '300px',
                  width: len * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: len * 140 + 'px'
                };
              } else if (len > 31 && len < 51) {
                self.chartStyle = {
                  height: '300px',
                  width: len * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: len * 140 + 'px'
                };
              } else {
                self.chartStyle = {
                  height: '300px',
                  width: 51 * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: 51 * 140 + 'px'
                };
              }
              break;
            default:
              if (len > 51) {
                self.chartStyle = {
                  height: '300px',
                  width: len * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: len * 140 + 'px'
                };
                // self.classObject.barWidth = 10;
              } else {
                self.chartStyle = {
                  height: '300px',
                  width: len * 140 + 'px'
                };
                self.chartWarpWidth = {
                  paddingLeft: '10px',
                  width: len * 140 + 'px'
                };
                // self.classObject.barWidth = 50;
              }
          }
        }
        self.getChartDate(self.dataObj.chartData);
        // top 条数变了后默认全选
        self.checkList = [];
        this.newChartData.forEach((item) => {
          self.checkList.push(item.id);
        });
        if (self.dataObj.chartType === 'appFlowType') {
          this.newChartData.forEach((item) => {
            switch (item.name) {
              case '1':
                item.name = '微信';
                break;
              case '2':
                item.name = 'QQ';
                break;
              case '3':
                item.name = '支付宝';
                break;
              default:
                item.name = '其他';
                break;
            }
          });
        }
        self.selectChange();
      },
      selectChange() {
        this.$emit('to-parent', this.checkList);
        let self = this;
        // 颜色选择类目
        // 全选
        let hasAll;
        if (self.idx('all', self.colorCheckList) !== -1) {
          hasAll = true;
        } else {
          hasAll = false;
        };
        if (self.checkList.length === self.newChartData.length) {
          if (!hasAll) {
            self.colorCheckList.push('all');
          }
        } else {
          self.removeItem('all', self.colorCheckList);
        };
      },
      colorSelectChange(item) {
        let self = this;
        // 全选
        let hasAll;
        if (self.idx('all', self.colorCheckList) !== -1) {
          hasAll = true;
        } else {
          hasAll = false;
        };
        if (item === 'all' && hasAll) {
          self.checkList = [];
          this.newChartData.forEach((item) => {
            self.checkList.push(item.id);
          });
        }
        if (item === 'all' && !hasAll) {
          self.checkList = [];
        }
        // 取反
        if (item === 'invert') {
          let _checkList = [];
          self.newChartData.forEach((item) => {
            if (self.idx(item.id, self.checkList) === -1) {
              _checkList.push(item.id);
            }
          });
          self.checkList = _checkList;
        }

        // 颜色选择
        self.colorSelect(item, item);
        // 颜色选择类目
        self.selectChange();
      },
      colorSelect(item, color) {
        let self = this;
        let colorList = ['red', 'green', 'black'];
        let hasInit;
        if (self.idx(item, colorList) === -1) {
          return;
        }
        if (self.idx(color, self.colorCheckList) !== -1) {
          hasInit = true;
        } else {
          hasInit = false;
        };
        if (hasInit) {
          this.newChartData.forEach((item) => {
            if (item.barColor === color && self.idx(item.id, self.checkList) === -1) {
              self.checkList.push(item.id);
            }
          });
        }
        if (!hasInit) {
          this.newChartData.forEach((item) => {
            if (item.barColor === color && self.idx(item.id, self.checkList) !== -1) {
              self.checkList = self.removeItem(item.id, self.checkList);
            }
          });
        }
        self.selectChange();
      },
      getRate() {
        let self = this;
        let totalRate = 0;
        if (self.dataObj.chartType === 'times') {
          for (let i = 0; i < 6; i++) {
            self.dataObj.chartData.forEach((_item, _index) => {
              if (_item['times'] === this.checkList[i]) {
                totalRate = self.floatAdd(totalRate, _item.consumeRatio);
              }
            });
          }
        }
        let _checkList = this.checkList.join(',');
        _checkList = _checkList.split(',');
        _checkList.forEach((item, index) => {
          switch (self.dataObj.chartType) {
            case 'apps':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['app_id'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'slot':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['slot_id'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'timeInterval':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['hour'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'provinces':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['province'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'priceSection':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['price_section'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'platforms':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['platform'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'brandName':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['brand_name'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
            case 'appFlowType':
              self.dataObj.chartData.forEach((_item, _index) => {
                if (_item['app_flow_type'] === item) {
                  totalRate = self.floatAdd(totalRate, _item.consumeRatio);
                }
              });
              break;
          }
        });
        self.costRate = self._precent(totalRate);
      },
      removeItem(val, list) {
        let index = this.idx(val, list);
        if (index > -1) {
          list.splice(index, 1);
          return list;
        }
      },
      idx(val, list) {
        for (var i = 0; i < list.length; i++) {
          if (list[i] === val) return i;
        }
        return -1;
      }
    }
  };
</script>
<style lang="less">
 .chart-area {
   .chart-area-show-chart {
     padding: 14px 0 14px 0;
     border: 1px solid #ccc;
     h1 {
       text-align: center;
       font-size: 16px;
     }
     .tip {
       text-align: center;
       padding-top: 10px;
       font-size: 14px;
       a {
         color: #cbcbcb;
       }
     }
     .filter-item-select {
       padding: 10px 20px;
       .bar-select {
         .filter-label {
           font-size: 14px;
           font-weight: bold;
           color: #444;
           width: 72px;
           display: inline-block;
           vertical-align: top;
           margin-top: 10px;
           text-align: right;
         }
         .filter-label-large {
            width: 120px;
         }
       }
     }
     .bar-scroll-area {
       width: 100%;
       overflow: auto;
     }
   }
   .checkbox-group {
     display: inline-block;
     padding-left: 10px;
     width: 100%;
     .d-checkbox-control {
       padding-left: 18px;
       margin-right: 10px;
       .icon {
         width: 14px;
         height: 14px;
       }
     }
     .select-rate {
       font-size: 14px;
     }
   }
 }
</style>