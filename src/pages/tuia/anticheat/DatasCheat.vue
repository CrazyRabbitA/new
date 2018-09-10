<template>
  <div class="cheat">
    <div class="income-top-content">
      <div class="top-item">
        <pagetitle title="防作弊数据" class="title"></pagetitle>
        <daterangepicker :error-show.sync="params.errorShow" :start.sync="params.startDate" :end.sync="params.endDate" :range="90"></daterangepicker>
      </div>
      <div class="top-item right-item">
        <div class="title"><h2>查看维度</h2></div>
        <div class="form-filter-wrap">
          <div class="form-combination">
            <d-select :options.sync="typeOptions" :value.sync="params.dimension" :on-select="dselectChange"></d-select>
            <label :class="{visibili: params.dimension === '0' }">
              <span>ID</span>
              <input type="text" class="form-control" :placeholder="`请输入${typeOptions[params.dimension].label}ID`"
                    v-model="params.id">
            </label>
            <a href="javascript:void(0)" class="btn btn-default btn-lg ml20" @click="risklevelChange">查询</a>
          </div>
        </div>
      </div>
    </div>
    <div class="titleName">
      <h2 style="display:inline-block" v-if = "showId">{{params.name}}<span >({{params.showId}})</span> / {{params.type}}</h2>
      <h2  style="display:inline-block" v-else>全局</h2>
      <d-button class="d-button d-button--primary d-button--large"  style="float:right">导出</d-button>
    </div>
    <div class="table-wrap">
      <table class="tables">
        <tr>
          <!-- <th>风险内容</th> -->
          <th v-for='item in items' :key='item'>{{item}}</th>
        </tr>
        <tr class='ruleItem' v-for='item in datas.clickTable' :key='item'>
          <td><div >{{item.cheatTag}}</div></td>
          <td><div class='num'>{{_fix(item.launchCount,0)}}</div></td>
          <td><div class='num'>{{_fix(item.advertExposurePv,0)}}</div></td>
          <td><div class='num'>{{_fix(item.clickCount ,0)}}</div></td>
          <td><div class='num'>{{item.clickRate}}</div></td>
          <td><div class='num'>{{_fix(item.efClicks,0)}}</div></td>
          <td><div class='num'>{{item.efClickRate}}</div></td>
          <td><div class='num'>{{item.launchCountPercent}}</div></td>
          <td><div class='num'>{{item.clickCountPercent}}</div></td>
          <td><div class='num'>{{_fix(item.jsClickCount,0)}}</div></td>
          <td><div class='num'>{{_fix(item.visitPv,0)}}</div></td>
          <td><div class='num'>{{_fix(item.effectPv,0)}}</div></td>
          <td><div class='num'>{{item.cvr}}</div></td>
          <td><div class='num'>{{_fix(item.adConsume,2)}}</div></td>
        </tr>
      </table>
    </div>

    <!-- 以下是图表内容 -->
    <div id="main"  class="canvas" v-el:echarts style="height:400px; width: 100%;margin-top:10px;"></div>
    <div class='rulesDetail' style='margin-bottom:10px'><h2>命中规则明细</h2></div> 
    <div class="table-wrap">
      <table class="tables">
        <tr>
          <!-- <th>规则</th> -->
          <th v-for='item in itemsPercent' :key='item'>{{item}}</th>
        </tr>
        <tr class='ruleItem' v-for='item in datas.dimensionClickTable' :key='item'>
          <td><div >{{item.dtype}}</div></td>
          <td><div class='num'>{{_fix(item.launchCount,0)}}</div></td>
          <td><div class='num'>{{_fix(item.advertExposurePv,0)}}</div></td>
          <td><div class='num'>{{_fix(item.clickCount,0)}}</div></td>
          <td><div class='num'>{{item.clickRate}}</div></td>
          <td><div class='num'>{{_fix(item.efClicks,0)}}</div></td>
          <td><div class='num'>{{item.efClickRate}}</div></td>
          <td><div class='num'>{{item.launchCountPercent}}</div></td>
          <td><div class='num'>{{item.clickCountPercent}}</div></td>
          <td><div class='num'>{{_fix(item.jsClickCount,0)}}</div></td>
          <td><div class='num'>{{_fix(item.visitPv,0)}}</div></td>
          <td><div class='num'>{{_fix(item.effectPv,0)}}</div></td>
          <td><div class='num'>{{item.cvr}}</div></td>
          <td><div class='num'>{{_fix(item.adConsume,2)}}</div></td>
          <td><div class='num'>{{item.adConsumePercent}}</div></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { _fixNum } from 'components/utils/cheatDataUtils';
  import MessageBox from 'components/basic/MessageBox';
  import cheatMixins from './mixins/cheatMixins';
  import { formatDate } from 'components/utils/dateUtils';
  // 维度配置
  const typeOptions = [
    {
      id: '0',
      label: '全局'
    },
    {
      id: '1',
      label: '媒体'
    },
    {
      id: '2',
      label: '广告位'
    }
  ];
  // indicatorsOptions指标类型与后端约定使用type确定类型。
  export default {
    mixins: [cheatMixins],
    route: {
      data(transition) {
  
      }
    },
    data() {
      return {
        mytableTitle: '',
        params: {
          startDate: this._getYesDay(formatDate(new Date())), // 默认选中前一天
          endDate: this._getYesDay(formatDate(new Date())),
          id: '',
          type: '',
          dimension: 0, // 维度选择
          target: '', // 指标
          errorShow: false,
          name: ''
        },
        datas: [],
        typeOptions,
        showId: false, // 控制是否为全局时候的显示隐藏;
        items: ['风险内容', '发券量', '曝光量', '点击量', '点击率', '计费点击量', '点击率(计费)', '发券占比', '点击占比', 'JS点击', '落地页访问PV', '落地页效果PV', 'CVR', '消耗'],
        itemsPercent: ['规则', '发券量', '曝光量', '点击量', '点击率', '计费点击量', '点击率(计费)', '发券占比', '点击占比', 'JS点击', '落地页访问PV', '落地页效果PV', 'CVR', '消耗', '消耗占比']
      };
    },
    ready() {
      // 是否由上一个页面跳转来;
      if (this.$route.params.id) {
        this.params.startDate = this.$route.params.start;
        this.params.endDate = this.$route.params.end;
        this.params.id = this.$route.params.id;
        this.params.type = this.$route.params.type;
        // 给title赋值
        if (this.$route.params.type === '1') {
          this.params.dimension = '1';
        } else {
          this.params.dimension = '2';
        }
      };
      this.getDatas(this._getParams());
    },
    methods: {
      // 转换
      _fix(num, long) {
        return _fixNum(num, long);
      },
      dselectChange(v) {
        this.params.id = '';
      },
      /**
       * [查询内容处理函数]
       * @return {[type]} [description]
       */
      risklevelChange() {
        if (this.params.dimension !== '0' && this.params.id === '') {
          MessageBox({
            title: '请输入ID',
            type: 'error'
          });
          return;
        }
  
        this.myChartLoading().show();
        // 事件触发更新数据数据;
        this.getDatas(this._getParams());
      },
      myChartLoading() {
        return {
          show: () => {
            if (this.myChart) {
              this.myChart.showLoading();
            }
          },
          hide: () => {
            if (this.myChart) {
              this.myChart.hideLoading();
            }
          }
        };
      },
      _fixZreo(dateStr) {
        dateStr = dateStr + ' 00:00:00';
        let data = (new Date(dateStr)).getTime() + '';
        return data;
      },
      _fix24(dateStr) {
        dateStr = dateStr + ' 24:00:00';
        let data = (new Date(dateStr)).getTime() + '';
        return data;
      },
      //
      _getYesDay(dateStr) {
        let yes = new Date(dateStr) - 1000 * 60 * 60 * 24;
        return formatDate(yes);
      },
      _sort(data, key) {
        return data.sort((prev, next) => {
          return prev[key] - next[key];
        });
      },
      // 参数转化
      _getParams() {
        return {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          type: this.params.dimension,
          id: this.params.dimension === '0' ? '' : this.params.id  // 如果type=0 ,id重置为空;
        };
      },
      // 接口封装;
      getDatas(params) {
        this.$http.get('/cheat/data', {params: params}).then((res) => {
          const result = res.json();
          this.datas = result.data;
          if (result.success) {
            // 都没有数据的时候
            if (this.datas.clickTable.length === 0 && this.datas.dimensionClickTable.length === 0) {
              this.myChartLoading().hide();
              // 同时删除图表信息;
              MessageBox({
                title: '该查询项暂无数据',
                type: 'error'
              });
              return;
            }
            // 这里还有clickTable或 dimensionClickTable为空的情况
            // clickTable有数据
            if (this.datas.clickTable.length !== 0) {
                  // 全局  slotId和appId同时等于null
              if (this.datas.clickTable[0].appId === null && this.datas.clickTable[0].slotId === null) {
                this.showId = false;
              } else {
                this.showId = true;
                // 媒体
                if (this.datas.clickTable[0].appId !== null) {
                  this.params.name = this.datas.clickTable[0].appName;
                  this.params.showId = this.datas.clickTable[0].appId;
                  this.params.type = '媒体';
                } else {
                  // 广告位
                  this.params.name = this.datas.clickTable[0].slotName;
                  this.params.showId = this.datas.clickTable[0].slotId;
                  this.params.type = '广告位';
                }
              };
              this.myChartLoading().hide();
              this.echartInit();
              return;
            };
            // dimensionClickTable有数据
            if (this.datas.dimensionClickTable.length !== 0) {
              if (this.datas.dimensionClickTable[0].appId === null && this.datas.dimensionClickTable[0].slotId === null) {
                this.showId = false;
              } else {
                this.showId = true;
                // 媒体
                if (this.datas.dimensionClickTable[0].appId !== null) {
                  this.params.name = this.datas.dimensionClickTable[0].appName;
                  this.params.showId = this.datas.dimensionClickTable[0].appId;
                  this.params.type = '媒体';
                } else {
                  // 广告位
                  this.params.name = this.datas.dimensionClickTable[0].slotName;
                  this.params.showId = this.datas.dimensionClickTable[0].slotId;
                  this.params.type = '广告位';
                }
              };
              this.myChartLoading().hide();
              this.echartInit();
              return;
            }
          } else {
            MessageBox({
              title: result.desc,
              type: 'error'
            });
          };
        }, (res) => {
          this.myChartLoading().hide();
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      }
    }
  };
</script>

<style lang="less" >
.cheat{
  // table{
  //   background: #fff
  // }
  .table-wrap{
    overflow-x: auto;
  }
  .canvas{
    // background: #fff !
  }
  .titleName{
    text-align: center;
    margin-bottom:10px ;
    display: inline-block;
    width:100%
  }
  .th-title{text-align: center}
  .form-filter-wrap .form-control,
  .form-filter-wrap .select-group {
    display: inline-block;
    margin-right: 6px;
    vertical-align: middle;
    margin-bottom: 10px;
  }
  .form-filter-wrap {
    .form-control {
      width: 204px;
    }
    .select-group {
      width: 134px;
    }
    .form-combination {
      font-size: 0;
      display: inline-block;
      vertical-align: middle;
      span {
        font-size: 14px;
        margin: 0 6px;
      }
      .select-group {
        margin-right: 24px;
      }
      .form-control {
        width: 161px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  .title {
    padding: 8px 0;
    border: none;
  }
  .table-wrap{
    min-width:900px;
  }
  .tables{
   border-radius:2px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    th {
      font-family:HiraginoSansGB-W6;
      font-size:14px;
      color:#444444;
      background-color: #e8e7e2;
      padding: 12px 0;
      min-width:130px;
      }
      
    td {
      line-height: 60px;
      border-bottom: 1px dashed #ccc;
     
      div {
        text-align: center;
      }
    }
    .td-title {
      border: none;
      vertical-align: middle;
      text-align: center;
    }
    .num {
      width: 80%;
      text-align: right;
      margin: auto;
      transform: translateX(-20%);
    }
  }
  .mytable {
    border-radius:2px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    th {
      font-family:HiraginoSansGB-W6;
      font-size:14px;
      color:#444444;
      background-color: #e8e7e2;
      padding: 12px 0;
      
    } 
    td {
      line-height: 60px;
      border-bottom: 1px dashed #ccc;
      div {
        text-align: center;
      }
    }
    .td-title {
      border: none;
      vertical-align: middle;
      text-align: center;
    }
    .num {
      // width: 60%;
      // text-align: right;
      // margin: auto;
      // transform: translateX(-20%);
      width: 80%;
      text-align: right;
      margin: auto;
      transform: translateX(-10%);
    }
  }
  .income-top-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .right-item {
      justify-content: flex-end;
    }
    .form-filter-wrap {
      margin: 0;
    }
    .btn {
      width: 110px;
      background-color: #ef6b3b;
      color: #fff;
      border: none;
      text-align: center;
    }
  }
  .visibili {
    visibility: hidden;
  }
  .main {
    // background-color: #fff;
    padding: 20px;
    margin: 20px;
    width:100%;
  }
  .page-title {
    border-bottom: none;
    h2 {
      font-family:HiraginoSansGB-W6;
      font-weight: bold;
      font-size:16px;
      color:#444444;
    }
  }
}
</style>
