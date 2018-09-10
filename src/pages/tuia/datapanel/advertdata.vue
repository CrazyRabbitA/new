<template>
  <div class="ggdata-container" :style="{
    'height': datatypeindex === 0 ?'2100px':'1100px'
  }">
    <pagetitle  title="广告行业数据" :sub-title="newtime"></pagetitle>
    <p class="table-change">
      <span v-for="(index,item) in datatype"
        :class="{'active': datatypeindex === index}"
        @click="changedatatype(item,index)"
        :key="item">
        {{item.label}}
      </span>
    </p>
    <advertdataoff
    :style="{
      'visibility': datatypeindex === 0 ?'visible':'hidden'
    }"></advertdataoff>
    <advertdataline  :style="{
      'visibility': datatypeindex === 1 ?'visible':'hidden'
    }"></advertdataline>
  </div>
</template>
<script>
import advertdataoff from './components/advertdataoff';
import advertdataline from './components/advertdataline';
export default {
  components: { advertdataoff, advertdataline },
  data() {
    const datatype = [
      {
        label: '离线',
        active: true
      },
      {
        label: '实时',
        active: false
      }
    ];
    return {
      datatype: datatype,
      datatypeindex: 0
    };
  },
  methods: {
    changedatatype(item, index) {
      this.datatypeindex = index;
    }

  }
};
</script>
<style lang="less">
.main {
    background-color: #fff !important;
    padding: 20px;
    margin: 20px;
}
.ggdata-container {
  position:relative;
  .off-container{
    position: absolute;
    top:120px;
    width:100%;
  }
  .line-container{
    position: absolute;
    top:120px;
    width:100%;
  }
  .table-change{
    margin-top:20px;
    font-size:14px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    span{
      display: inline-block;
      height:30px;
      line-height: 30px;
      padding:0 20px;
      border-bottom: 3px solid #fff;
      cursor: pointer;
      margin-right:40px;
    }
    .active{
      border-bottom: 3px solid #ff795c;
      color: #ff795c
    }
  }
}
</style>

