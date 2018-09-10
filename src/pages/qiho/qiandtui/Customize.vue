<template>
  <div class="custmize-main">
    <div class="form-inline bottomline pt0">
      <div class="form-filter-group">
        <p class="filter-label">数据表名称：</p>
        <input type="text" class="form-control" v-model="params.reportName">
      </div>
    </div>
    <div class="form-inline bottomline">
      <div class="form-filter-group">
        <p class="filter-label">时间粒度：</p>
        <d-select :options.sync="timeOpt" :value.sync="params.timeGranularity" width="100" ></d-select>
        <p class="filter-label">时间区间：</p>
        <daterangepicker :error-show.sync="errorShow" :start.sync="params.beginReportDate" :end.sync="params.endReportDate" :disabled-date="disabledDate"></daterangepicker>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="check-list bottomline">
      <div class="form-inline search-area">
        <p class="label">基本数据列</p>
        <div class="search-btn">
          <d-button class="searchfilter" size="large" type="primary" @click="setDefaultData">设置默认数据</d-button>
          <d-button class="searchfilter" size="large" type="primary" @click="baseAllCheck">全选</d-button>
          <d-button class="searchfilter" size="large" type="primary" @click="baseAllClear">清空</d-button>
        </div>
      </div>
      <d-checkbox-group :value.sync="baseCheckList">
        <template v-for="(index,item) in baseData">
          <d-checkbox :name="item.id">{{item.label}}</d-checkbox>
        </template>
      </d-checkbox-group>
    </div>
    <!-- 主数据 -->
    <div class="check-list bottomline">
      <div class="form-inline search-area">
        <p class="label">主要数据列</p>
        <div class="search-btn">
          <d-button class="searchfilter" size="large" type="primary" @click="setDefaultData">设置默认数据</d-button>
          <d-button class="searchfilter" size="large" type="primary" @click="mainAllCheck">全选</d-button>
          <d-button class="searchfilter" size="large" type="primary" @click="mainAllClear">清空</d-button>
        </div>
      </div>
      <d-checkbox-group :value.sync="mainCheckList">
        <template v-for="(index,item) in mainData">
          <d-checkbox :name="item.id">{{item.label}}</d-checkbox>
        </template>
      </d-checkbox-group>
    </div>
    <div class="form-inline search-mr">
      <d-button class="searchfilter" size="large" type="primary" @click="download">下载</d-button>
    </div>
  </div>
</template>

<script>
  import { formatDate } from 'components/utils/dateUtils';
  import MessageBox from 'components/basic/MessageBox';
  export default {
    data() {
      return {
        passedTime: false,
        params: {
          reportName: '',
          timeGranularity: 'day',
          beginReportDate: this._getYesDay(formatDate(new Date()), 1),
          endReportDate: this._getYesDay(formatDate(new Date()), 1),
          baseDataColumn: '',
          mainDataColumn: ''
        },
        timeOpt: [
          {
            id: 'day',
            label: '日数据'
          },
          {
            id: 'week',
            label: '周数据'
          },
          {
            id: 'month',
            label: '月数据'
          }
        ],
        baseCheckList: [], // 选中的基本数据列
        baseData: [
          {
            id: 'ad_id',
            label: '广告ID'
          },
          {
            id: 'ad_name',
            label: '广告名称'
          },
          {
            id: 'item_id',
            label: '商品ID'
          },
          {
            id: 'item_name',
            label: '商品名称'
          },
          {
            id: 'advert_name',
            label: '广告主名称'
          },
          {
            id: 'agent_name',
            label: '代理商名称'
          },
          {
            id: 'first_category',
            label: '一级类目'
          },
          {
            id: 'second_category',
            label: '二级类目'
          },
          {
            id: 'third_category',
            label: '三级类目'
          }
        ],
        mainCheckList: [], // 选中的主要数据列
        mainData: [
          {
            id: 'consume',
            label: '消耗'
          },
          {
            id: 'budget',
            label: '预算'
          },
          {
            id: 'issue_coupons',
            label: '发券'
          },
          {
            id: 'exposure',
            label: '曝光'
          },
          {
            id: 'click_total',
            label: '总点击'
          },
          {
            id: 'billing_click',
            label: '计费点击'
          },
          {
            id: 'billing_click_uv',
            label: '计费点击UV'
          },
          {
            id: 'billing_click_rate',
            label: '计费点击率'
          },
          {
            id: 'page_pv',
            label: '落地页访问PV'
          },
          {
            id: 'page_uv',
            label: '落地页访问UV'
          },
          {
            id: 'page_consume',
            label: '落地页访问损耗'
          },
          {
            id: 'transform_pv',
            label: '转化PV'
          },
          {
            id: 'transform_uv',
            label: '转化UV'
          },
          {
            id: 'cvr',
            label: 'CVR'
          },
          {
            id: 'click_avg_price',
            label: '计费点击均价'
          },
          {
            id: 'cpa',
            label: 'CPA'
          },
          {
            id: 'coupons_arpu',
            label: '发券arpu'
          }
        ]
      };
    },
    ready() {
      this.getAllDefualtData();
    },
    methods: {
      getAllDefualtData() { // 获取所有默认信息
        this.$http.get('/dataDownload/query', {}).then((res) => {
          res = res.json();
          if (res.success && res.data) {
            if (res.data.baseDataColumn && !res.data.baseDataColumn.length) {
              this.baseAllCheck();
            } else {
              this.baseCheckList = res.data.baseDataColumn;
            }
            if (res.data.mainDataColumn && !res.data.mainDataColumn.length) {
              this.mainAllCheck();
            } else {
              this.mainCheckList = res.data.mainDataColumn;
            }
          } else {
            this.baseCheckList = [];
            this.mainCheckList = [];
          }
        }, (res) => {
          this.baseCheckList = [];
          this.mainCheckList = [];
        });
      },
      setDefaultData() { // 设置默认数据
        if (!this.baseCheckList.length) {
          MessageBox({
            title: '基本数据列至少选择一项',
            type: 'error'
          });
          return false;
        }
        if (!this.mainCheckList.length) {
          MessageBox({
            title: '主要数据列至少选择一项',
            type: 'error'
          });
          return false;
        }
        this.$http.post('/dataDownload/save', {
          'baseDataColumn': this.baseCheckList.join(','),
          'mainDataColumn': this.mainCheckList.join(',')
        }).then((res) => {
          res = res.json();
          MessageBox({
            title: res.success ? '设置成功' : '设置失败',
            type: res.success ? 'success' : 'error'
          });
        }, (res) => {
          MessageBox({
            title: '网络错误！',
            type: 'error'
          });
        });
      },
      allCheck(data) { // 全选
        // 基本数据列全选
        let len = data.length;
        let list = [];
        for (var i = 0; i < len; i++) {
          list.push(data[i].id);
        }
        return list;
      },
      baseAllCheck() { // 选中
        // 基本数据列全选
        this.baseCheckList = this.allCheck(this.baseData);
      },
      baseAllClear() { // 清除
        this.baseCheckList = [];
      },
      baseSelected() {
        this.baseCheckList = [];
      },
      mainAllCheck() {
        // 主要数据列全选
        this.mainCheckList = this.allCheck(this.mainData);
      },
      mainAllClear() {
        this.mainCheckList = [];
      },
      _getYesDay(dateStr, n) {
        let yes = new Date(dateStr) - 1000 * 60 * 60 * 24 * n;
        return formatDate(yes);
      },
      download() {
        // 下载地址拼接
        let url = '';
        // 校验时间粒度
        this.timeBeyond();
        if (!this.passedTime) {
          return;
        }
        // 校验数据列
        if (!this.baseCheckList.length) {
          MessageBox({
            title: '基本数据列至少选择一项',
            type: 'error'
          });
          return false;
        }
        if (!this.mainCheckList.length) {
          MessageBox({
            title: '主要数据列至少选择一项',
            type: 'error'
          });
          return false;
        }

        // 基础数据  主数据
        this.params.baseDataColumn = this.baseCheckList.join(',');
        this.params.mainDataColumn = this.mainCheckList.join(',');
        url = '/dataDownload/report?reportName=' + this.strip(this.params.reportName) + '&timeGranularity=' + this.params.timeGranularity + '&beginReportDate=' + this.params.beginReportDate + '&endReportDate=' + this.params.endReportDate + '&baseDataColumn=' + this.params.baseDataColumn + '&mainDataColumn=' + this.params.mainDataColumn;
        window.open(url);
      },
      timeBeyond() { // 时间校验
        if (this.params.endReportDate === '' || this.params.beginReportDate === '') {
          MessageBox({
            title: '起始时间和结束时间都不能为空',
            type: 'error'
          });
          this.passedTime = false;
        } else if (Date.parse(this.params.endReportDate) - Date.parse(this.params.beginReportDate) > 15552000000) {
          MessageBox({
            title: '时间区间不大于6个月',
            type: 'error'
          });
          this.passedTime = false;
        } else if (this.params.timeGranularity === 'week' && Date.parse(this.params.endReportDate) - Date.parse(this.params.beginReportDate) < 518400000) {
          MessageBox({
            title: '时间粒度为周数据，时间区间不小于7天',
            type: 'error'
          });
          this.passedTime = false;
        } else if (this.params.timeGranularity === 'month' && Date.parse(this.params.endReportDate) - Date.parse(this.params.beginReportDate) < 2419200000) {
          MessageBox({
            title: '时间粒度为月数据，时间区间不小于28天',
            type: 'error'
          });
          this.passedTime = false;
        } else {
          this.passedTime = true;
        }
      },
      strip(s) { // 特殊字符过滤
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
        var rs = '';
        for (var i = 0; i < s.length; i++) {
          rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
      }
    }
  };
</script>
<style lang="less">
  .custmize-main {
    .d-checkbox-control {
      padding-left: 18px;
      margin-right: 20px;
    }
    .bottomline {
      padding: 20px 0;
      input,
      .select-group {
        float: none;
      }
    }
    .pt0 {
      padding-top: 0px;
    }
    .check-list {
      padding-top: 20px;
      .checkbox-group {
        margin-top: 15px;
      }
      .search-area {
        .label {
          height: 34px;
          line-height: 34px;
          font-weight: bold;
          float: left;
          font-size: 14px;
        }
        .search-btn {
          float: right;
        }
      }
    }
    .search-mr {
      height: 50px;
      padding-bottom: 50px;
      margin-top: 20px;
      .d-button {
        float: right;
      }
    }
  }
</style>

<!-- 
http://cf.dui88.com/pages/viewpage.action?pageId=6860346
日期  cur_date  
AE名称  ae_name 
广告ID ad_id
广告名称 ad_name
商品id item_id
商品名称 item_name
广告主id  advert_id
广告主名称 advert_name
代理商名称 agent_name
一级类目id first_category_id
一级类目名称 first_category
二级类目id second_category_id
二级类目名称 second_category
三级类目id  third_category_id
三级类目名称 third_category
消耗 consume
预算 budget
发券 issue_coupons
曝光 exposure
总点击 click_total  
计费点击 billing_click 
计费点击uv billing_click_uv
计费点击率 billing_click_rate
落地页访问pv page_pv
落地页访问uv page_uv
落地页访问损耗 page_consume
转化pv transform_pv
转化uv transform_uv
CVR 广告转化率 cvr
计费点击均价 click_avg_price
CPA 每次行动计费 cpa
发券arpu issue_coupons_arpu
 -->