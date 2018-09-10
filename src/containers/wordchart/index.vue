<template>
<div  class = "coredata-wrapper">
  <h2>核心指标</h2>
   <ul  :class="size">
    <template v-for="(index,item) in datas" track-by="$index">
      <li @click="goLink(item)"  class="core-item" v-if="item"  :key="item">
        <h2>{{item.label}}</h2>
        <p><span>{{time.date+ '~' + time.endDate}}</span></p>
        <p class="data-item"><span>{{item.data}}</span></p>
        <p v-if="item.sequential || item.sequential === '0' "><span>环比：</span> <span
          :class="item.sequential.indexOf('+') === 0 ? 'reditem' : 'greenitem'">{{item.sequential}}</span> </p>
        <p v-if="item.sequential || item.sequential === '0' "><span>同比：</span> <span
          :class="item.comparedSame.indexOf('+') === 0 ? 'reditem' : 'greenitem'">{{item.comparedSame}}</span> </p>
      </li>
      <li v-else class="core-item" :key="item" style="visibility:hidden"></li>
    </template>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: 'sm'
    },
    datas: {
      type: Array,
      default: []
    },
    params: {
      type: Object,
      default: null
    },
    url: {
      type: String,
      default: ''
    },
    isShowloading: {
      type: Boolean,
      default: true
    },
    time: {
      type: Object,
      default: null
    }
  },
  data() {
    return {

    };
  },
  methods: {
    goLink(item) {
      if (!this.url) return;
      window.open(this.url + `&id=${item.id}&name=${item.label}`);
    }
  },
  ready() {

  }
};
</script>
<style lang="less" scoped>
.coredata-wrapper {
   h2{
    cursor: pointer;
    font-size:20px;
     &:hover{
      color:chocolate
    }
  }
  ul{
  margin-top:20px;
  li{
    cursor: pointer;
    margin-bottom:20px;
    box-sizing: border-box;
    padding:20px;
    box-shadow: 0 2px 11px 0 rgba(190,202,218,.17);
    border: 2px #eee solid;
    &:hover{
      border:2px solid rgb(141, 218, 170);
    }
    h2{
      font-size:14px;
      margin-bottom:10px;
    }
    p{
      margin-bottom:10px;
      font-size:14px;
     &.data-item{
        font-size:24px;
        font-weight:600;
        margin-top:20px;
      }
      span{
        &.greenitem{
          color:green
        }
        &.reditem{
          color:red
        }
      }
    }
  }
}
.common() {
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  align-content: flex-start
}
.sm{
  .common;
  .core-item {
    flex:0 1 23%
  }
}
.mid {
  .common;
  .core-item {
    flex:0 1 45%
  }
}
.lg {
  .common;
  .core-item {
    flex: 1;
  }
}
}

</style>
