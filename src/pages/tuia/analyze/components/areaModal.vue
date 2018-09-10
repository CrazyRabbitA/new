<template>
 <d-modal effect="fade" :show.sync="show" width="800" class="areamodal" :on-ok="submit" :on-close="onClose">
   <template slot="modal-body">
     <div class="modal-body">
       <div class="area-warp">
        <div class="quota-list">
          <h1 class="qota-type">全选:</h1>
          <d-checkbox-group :value.sync="checkAll">
              <div class="quota-item">          
                <d-checkbox :name="'all'" @change="selectAllChange('all')">全选</d-checkbox>
              </div>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">中国:</h1>
          <d-checkbox-group :value.sync="checkList">
              <div class="quota-item">          
                <d-checkbox :name="'中国'" @change="selectChange('中国')">中国</d-checkbox>
              </div>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">华北地区:</h1>
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in huabeiArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">东北地区:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in dongbeiArr" track-by="$index">
              <div class="quota-item">
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div> 
        <div class="quota-list">
          <h1 class="qota-type">华东地区:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in huadongArr" track-by="$index">
              <div class="quota-item">          
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>  
            </template>
          </d-checkbox-group>
        </div> 
        <div class="quota-list">
          <h1 class="qota-type">华中地区:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in huazhongArr" track-by="$index">
              <div class="quota-item">          
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
        <h1 class="qota-type">华南地区:</h1> 
        <d-checkbox-group :value.sync="checkList">
          <template v-for="(index,item) in huananArr" track-by="$index">
            <div class="quota-item">          
              <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
            </div>
          </template>
        </d-checkbox-group>
        </div> 
        <div class="quota-list">
          <h1 class="qota-type">西南地区:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in xinanArr" track-by="$index">
              <div class="quota-item">          
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">西北地区:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in xibeiArr" track-by="$index">
              <div class="quota-item">          
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">港澳台地区:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <template v-for="(index,item) in gangaotaiArr" track-by="$index">
              <div class="quota-item">          
                <d-checkbox :name="item" @change="selectChange(item)" >{{item}}</d-checkbox>
              </div>
            </template>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">海外:</h1> 
          <d-checkbox-group :value.sync="checkList">
            <div class="quota-item">          
              <d-checkbox :name="'海外'" @change="selectChange('海外')" >海外</d-checkbox>
            </div>
          </d-checkbox-group>
        </div>
        <div class="quota-list">
          <h1 class="qota-type">其他:</h1>
          <d-checkbox-group :value.sync="checkList">
              <div class="quota-item">          
                <d-checkbox :name="'other'" @change="selectChange('other')">其他</d-checkbox>
              </div>
          </d-checkbox-group>
        </div>
      </div>
     </div>    
   </template>   
   <div class="modal-footer" slot="modal-footer">
     <d-button class="searchfilter" size="large" type="warning" @click="close">确认</d-button>
     <d-button size="large" @click="close">取消</d-button>
   </div>
 </d-modal>
</template>
<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';
const huabeiArr = ['北京', '天津', '河北', '山西', '内蒙古'];
const dongbeiArr = ['辽宁', '吉林', '黑龙江'];
const huadongArr = ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东'];
const huazhongArr = ['河南', '湖南', '湖北'];
const huananArr = ['广东', '广西', '海南'];
const xinanArr = ['重庆', '四川', '贵州', '云南', '西藏'];
const xibeiArr = ['陕西', '甘肃', '青海', '宁夏', '新疆'];
const gangaotaiArr = ['香港', '澳门', '台湾'];
export default {
  props: {
    show: {
      require: true,
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    },
    checkList: {
      require: true,
      default: () => []
    },
    areaList: String,
    onOk: {
      require: true,
      type: Function
    }
  },
  data() {
    return {
      huabeiArr: huabeiArr,
      dongbeiArr: dongbeiArr,
      huadongArr: huadongArr,
      huazhongArr: huazhongArr,
      huananArr: huananArr,
      xinanArr: xinanArr,
      xibeiArr: xibeiArr,
      gangaotaiArr: gangaotaiArr,
      checkAll: []
    };
  },
  methods: {
    selectAllChange(id) {
      if (this.checkAll.length > 0) {
        this.checkList = [].concat(huabeiArr, dongbeiArr, huadongArr, huazhongArr, huananArr, xinanArr, xibeiArr, gangaotaiArr, ['海外'], ['中国'], ['other']);
      } else {
        this.checkList = [];
      }
    },
    selectChange() {
      if (this.checkList.length < 36) {
        this.checkAll = [];
      } else {
        this.checkAll = ['all'];
      }
    },
    close() {
      this.show = false;
      this.areaList = this.checkList.join(',');
    }
  }
};
</script>
<style lang="less">
.areamodal {
  .area-warp {
    max-height: 440px;
    overflow-y: scroll;
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
  .quota-list {
    margin-bottom: 20px;
    .qota-type {
     font-size: 100%;
    }
    .quota-item {
      display: inline-block;
      width: 100px;
    }
  }
}
</style>

