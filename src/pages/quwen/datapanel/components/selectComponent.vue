<template>
  <div class="page-select" :id="className">
    <p class = "filter-select">
        <d-select
            @select='select'
            :options.sync="dimensionType"
            :value.sync ="dimensionTypeItem" ></d-select>
    </p>
    <p class = "filter-item" >
      <span @click="showMask" v-if="emitData.length>0">+</span>
      <span
        v-for="(index,item) in emitData"
        :key="index"
        class='spannode'
        >
         <i class='di'>{{item.label}}</i>
        <i @click = "deleteEmitdata(index,item)" class="icondelete">&#xe635;</i>
      </span>
      <span v-if="emitData.length>0" id="delete-all">
        <i  @click="deleteAll" class="icondelete icon-all">&#xe635;</i>
      </span>
    </p>
    <div class="filtermask-wrapper">
      <filtercomponent
          :show.sync = "show"
          v-if="show"
          :title = "title"
          :maskdata = "maskData"
          :propdata = "propData"
          @getmask = "getmask">
      </filtercomponent>
    </div>
  </div>
</template>
<script>
// import { formatDate } from 'components/utils/dateUtils';
import filtercomponent from './filtercomponent';
import MessageBox from 'components/basic/MessageBox';
const dimensionType = [
  {
    label: '大盘',
    id: 1
  },
  {
    label: '版本',
    id: 2
  },
  {
    label: '渠道',
    id: 3
  },
  {
    label: '用户分层',
    id: 4
  }
];
const dimensionType0 = [
  {
    label: '请选择',
    id: 10
  },
  {
    label: '大盘',
    id: 1
  },
  {
    label: '版本',
    id: 2
  },
  {
    label: '渠道',
    id: 3
  },
  {
    label: '用户分层',
    id: 4
  }
];
// let obj = {};
export default {
  props: {
    key: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    showactive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errorShow: false,
      dimensionTypeItem: this.key !== 0 ? 10 : 1,
      dimensionType: this.key !== 0 ? dimensionType0 : dimensionType,
      show: false,
      title: 'ccs',
      maskObj: {},
      maskData: [],
      emitData: [],
      propData: [],
      indicators: [],
      obj: {},
      className: this.key !== 0 ? '' : 'pagedashBoard'
    };
  },
  methods: {
    deleteAll() {
      this.emitData.splice(0);
      switch (this.dimensionTypeItem) {
        case 1:// 大盘
          this.obj = Object.assign(this.obj, {});
          break;
        case 2:// 版本
          let appVersions = [];
          this.emitData.forEach((ele) => {
            appVersions.push(ele.label);
          });
          this.obj = Object.assign(this.obj, {appVersions: appVersions});
          break;
        case 3: // 渠道
          let appSources = [];
          this.emitData.forEach((ele) => {
            appSources.push(ele.label);
          });
          this.obj = Object.assign(this.obj, {appSources: appSources});
          break;
        case 4:// 用户
          let userTypes = [];
          this.emitData.forEach((ele) => {
            if (ele.label === '新用户') {
              userTypes.push(1);
            } else {
              userTypes.push(2);
            }
          });
          this.obj = Object.assign(this.obj, {userTypes: userTypes});
          break;
        default:// 请选择
          break;
      }
      this.$emit('getobj', this.obj);
      if (this.count > 1) {
        this.$emit('getkey', this.key);
      }
    },
    getDimension() {
      this.$http.post('/quwen/coreData/appVS',
        {
          endDate: this.params.endDate,
          startDate: this.params.startDate
        }
      ).then(res => {
        res = res.json();
        if (res.success) {
          this.maskObj = res.data;
        } else {
          MessageBox({
            title: res.desc,
            type: 'error'
          });
        }
      }, res => {
        MessageBox({
          title: '网络错误',
          type: 'error'
        });
      });
    },
    select(e) {
      switch (this.dimensionTypeItem) {
        case 10:
          this.show = false;
          this.className = '';
          this.emitData = [];
          break;
        case 1:
          this.show = false;
          this.className = 'pagedashBoard';
          this.emitData = [];
          this.$emit('getobj', {});
          break;
        case 2: // 版本
          this.className = 'pageappVersions';
          this.title = '版本';
          this.show = true;
          this.maskData = this.maskObj.appVersions;
          if (this.maskData.length > 5 && this.maskData.length % 5 !== 0) {
            const arr = new Array(5 - this.maskData.length % 5);
            this.maskData.push(...arr);
          }
          this.maskData = this.maskData.map((item, index) => {
            return {
              label: item,
              active: false
            };
          });

          break;
        case 3: // 渠道
          this.className = 'pageappSources';
          this.title = '渠道';
          this.show = true;
          this.maskData = this.maskObj.appSources;
          if (this.maskData.length > 5 && this.maskData.length % 5 !== 0) {
            const arr = new Array(5 - this.maskData.length % 5);
            this.maskData.push(...arr);
          }
          this.maskData = this.maskData.map((item, index) => {
            return {
              label: item,
              active: false
            };
          });
          break;
        default:
          // 用户分层
          this.className = 'pagequeryType';
          this.title = '用户分层';
          this.show = true;
          this.maskData = [
            { label: '新用户', active: false },
            { label: '老用户', active: false }
          ];
          break;
      }
    },
    getmask(emitData) {
      this.show = false;
      if (emitData) {
        this.emitData = emitData;
      }
      switch (this.dimensionTypeItem) {
        case 1:// 大盘
          this.obj = Object.assign({}, {});
          this.className = 'pagedashBoard';
          break;
        case 2:// 版本
          let appVersions = [];
          this.emitData.forEach((ele) => {
            appVersions.push(ele.label);
          });
          this.obj = Object.assign({}, {appVersions: appVersions});
          this.className = 'pageappVersions';
          break;
        case 3: // 渠道
          let appSources = [];
          this.emitData.forEach((ele) => {
            appSources.push(ele.label);
          });
          this.className = 'pageappSources';
          this.obj = Object.assign({}, {appSources: appSources});
          break;
        case 4:// 用户
          let userTypes = [];
          this.emitData.forEach((ele) => {
            if (ele.label === '新用户') {
              userTypes.push(1);
            } else {
              userTypes.push(2);
            }
            this.className = 'pagequeryType';
            // userTypes.push(ele.label);
          });
          this.obj = Object.assign({}, {userTypes: userTypes});
          break;
        default:// 请选择
          break;
      }
      this.$emit('getobj', this.obj);
    },
    // 删除
    deleteEmitdata(index, item) {
      this.emitData.splice(index, 1);
      this.propData = this.emitData;
      switch (this.dimensionTypeItem) {
        case 1:// 大盘
          this.obj = Object.assign(this.obj, {});
          break;
        case 2:// 版本
          let appVersions = [];
          this.emitData.forEach((ele) => {
            appVersions.push(ele.label);
          });
          this.obj = Object.assign(this.obj, {appVersions: appVersions});
          break;
        case 3: // 渠道
          let appSources = [];
          this.emitData.forEach((ele) => {
            appSources.push(ele.label);
          });
          this.obj = Object.assign(this.obj, {appSources: appSources});
          break;
        case 4:// 用户
          let userTypes = [];
          this.emitData.forEach((ele) => {
            // userTypes.push(ele.label);
            if (ele.label === '新用户') {
              userTypes.push(1);
            } else {
              userTypes.push(2);
            }
          });
          this.obj = Object.assign(this.obj, {userTypes: userTypes});
          break;
        default:// 请选择
          break;
      }
      this.$emit('getobj', this.obj);
    },
     //
    showMask() {
      this.show = true;
    }
  },
  ready() {
    this.getDimension();
  },
  components: {
    filtercomponent
  },
  watch: {
    emitData(val) {
      this.propData = val;
    }
  }
};
</script>
<style lang="less" scoped>
.page-select {
    // min-height:35px;
    display: inline-block;
    margin-left: 46px;
    margin-bottom:10px;
    &:nth-of-type(1){
      margin-left:0px;
    }
    .indicators-wrapper{
      height:100px;
    }
    .filter-select{
      float:left;
    }
     .filter-item {
       width:800px;
       min-height: 40px;
       float: left;
      span {
        font-size: 18px;
        background-color: rgba(64, 158, 255, 0.1);
        color: #409eff;
        border: 1px solid rgba(64, 158, 255, 0.2);
        display: inline-block;
        padding: 5px;
        border-radius: 5px;
        margin-left: 5px;
        cursor: pointer;
        margin-bottom:10px;
        i {
          font-size: 18px;
          font-style: normal;
        }
        &:nth-of-type(1) {
          padding: 5px 10px;
        }
      }
    }
    .select-menu{
      max-height:250px !important;
    }
  }
  #delete-all{
    opacity: .5;
    &:hover{
      opacity:1 ;
    }

  }

</style>
