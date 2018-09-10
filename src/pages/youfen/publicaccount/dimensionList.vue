<template>
<div class="page-dimensionlist">
  <pagetitle class="media-offline-title" title="公众号维度"></pagetitle>
  <time-select :time-obj.sync="timeObj" :date-tags-type.sync="dateTagsType" :button-time="buttonTime"></time-select>
   <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">管理员：</p>
        <auto-input :input-class="'form-control fl'"  ></auto-input>
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">公众号：</p>
        <auto-input :input-class="'form-control fl'" ></auto-input>
      </div>
      <div class="form-filter-group">
        <p class="filter-label fl">公众号类型：</p>
        <d-select :input-class="'form-control fl'" :options.sync="publicType" :value.sync="params.publicType" ></d-select>
      </div>
    </div>
    <div class="cf">
      <div class="form-filter-group">
        <p class="filter-label fl">公众号状态：</p>
        <d-select :input-class="'form-control fl'" :options.sync="publicStatus" :value.sync="params.publicStatus" ></d-select>
      </div>
      <div class="form-filter-group">
        <p class="sort filter-label fl">图文序号：</p>
        <d-select :input-class="'form-control fl'" :options.sync="sortNum" :value.sync="params.sortNum" ></d-select>
      </div>
      <d-button class="searchfilter" size="large" type="warning"  >查询</d-button>
    </div>
    <div class="cf">
      <!-- <a :href="'/tuia/app/download?appId=' + params.appId + '&extraDate=' + params.extraDate" class="download fr"><i class="iconhandle mr5">&#xe606;</i>导出</a> -->
      <a  class="download fr"><i class="iconhandle mr5">&#xe606;</i>导出</a> 
    </div>
</div>
</template>
<script>
import timeSelect from './components/timeSelect';
import autoInput from './components/autoInput';
const publicType = [
  {
    id: 1,
    label: '全部'
  },
  {
    id: 2,
    label: '订阅号'
  },
  {
    id: 3,
    label: '服务号'
  }
];
const publicStatus = [
  {
    id: 0,
    label: '全部'
  },
  {
    id: 1,
    label: '未投放'
  },
  {
    id: 2,
    label: '投放中'
  },
  {
    id: 3,
    label: '托管'
  },
  {
    id: 4,
    label: '运营中'
  }
];
const sortNum = [
  {
    id: 0,
    label: '全部'
  },
  {
    id: 1,
    label: 1
  },
  {
    id: 2,
    label: 2
  },
  {
    id: 3,
    label: 3
  },
  {
    id: 4,
    label: 4
  },
  {
    id: 5,
    label: 5
  },
  {
    id: 6,
    label: 6
  },
  {
    id: 7,
    label: 7
  },
  {
    id: 8,
    label: 8
  }
];
export default {
  components: {
    timeSelect,
    autoInput
  },
  data() {
    return {
      timeObj: {
        startDate: '',
        endDate: ''
      },
      buttonTime: true,
      dateTagsType: 1,
      publicType: publicType,
      publicStatus: publicStatus,
      sortNum: sortNum,
      params: {
        publicType: 3,
        publicStatus: 4,
        sortNum: 7
      }
    };
  }
};
</script>
<style lang="less">
 
  .page-dimensionlist{
    position: relative;
     .media-offline-title {
       border-bottom: 0px;
     }
     .form-filter-group {
      //  width:250px;
        margin-bottom: 18px;
        float: left;
        .filter-label {
            font-size: 14px;
            font-weight: bold;
            color: #444;
            width: 84px;
            text-align: left;
            display: inline-block;
            vertical-align: top;
            margin-top: 10px;
            &.long {
              width: 120px;
              text-align: left;
            }
        }
        .form-control {
            width: 120px;
            display: inline-block;
            margin-right: 10px;
        }
        .datepicker-input {
            width: 160px !important;
        }
        .iconhandle {
            right: 26px !important;
        }
        .select-group{
          width:160px !important;
        }
    }
    .auto-complete .form-control{
      width:160px !important;
    }
    .sort{
      margin-left: 10px
    }
    .searchfilter {
      float:right;
    }
    .fr{
      color:#657180;
      &:hover{
        color:#ef6b3b;
      }
    }
  }

</style>



