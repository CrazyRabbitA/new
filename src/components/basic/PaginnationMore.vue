<template>
  <div class="pagination-more cf" >
    <div class="more-list pointer" @click="onPagerClick" ><span class="iconhandle add-more">&#xe619;</span> 加载更多（剩余{{hidePagers}}条）</div>
    <div class="fr mr10" >共{{total}}条</div>
    <div class="fr mr10" >共{{pageCount}}页</div>
    <div class="fr mr10" >第{{currentPage}}页</div>
  </div>
</template>

<script>
export default {
  name: 'd-pagination-more',

  props: {
    /**
     * 数据总条数
     */
    total: {
      required: true,
      type: Number
    },
    /**
     * 每页数据条数，默认十条
     */
    pageSize: {
      type: Number,
      default: 10
    },
    /**
     * 当前页
     */
    currentPage: {
      type: Number,
      default: 1
    }
  },

  computed: {
    /**
     * 数据的总页数
     */
    pageCount: function() {
      return Math.ceil(this.total / this.pageSize);
    },
    /*
     * 显示的页码
     */
    hidePagers: function() {
      return (this.total - this.pageSize * this.currentPage) > 0 ? (this.total - this.pageSize * this.currentPage) : 0;
    }
  },
  methods: {
    onPagerClick: function() {
      if (this.hidePagers > 0) {
        let newPage = this.currentPage + 1;
        this.$emit('change', newPage);
      }
    }
  }
};
</script>

<style lang="less">
.pagination-more {
    background-color: #F5F7F9;
    border: 1px solid  #d7dde4;
    border-top: none; 
    padding: 12px 10px;
    .pointer {
      cursor: pointer;
    }
    .add-more {
      display: inline-block;
      transform: rotate(90deg)
    }
    .more-list {
      display: inline-block;
      margin-left: 50%; 
      transform: translateX(-50%);
    }
}

</style>

