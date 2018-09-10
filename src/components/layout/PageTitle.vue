<template>
  <div class="page-title">
    <h2 v-bind:class="{
      'has-sub-title': subTitle
    }">
      {{title}}
      <template v-if="typeof subTitle === 'object'">
        <template v-for="(index, item) in subTitle">
          <i class="iconhandle">&#xe619;</i>
          <span :class="{'sub-title': index === subTitle.length - 1}">{{item}}</span>
        </template>
      </template>
      <template v-else>
        <i class="iconhandle" v-if="subTitle">&#xe619;</i>
        <span v-if="subTitle" class="sub-title">{{subTitle}}</span>
      </template>
    </h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'subTitle'
  ]
};
</script>

<style lang="less">
.page-title {
  padding: 40px 0 10px;
  border-bottom: 1px solid #e1e1e1;
  position: relative;

  h2 {
    font-size: 18px;
    font-weight: bold;
    display: inline-block;

    &.has-sub-title {
      font-weight: normal;
    }
  }

  .sub-title {
    font-weight: bold;
  }

  .iconhandle {
    font-size: 12px;
    vertical-align: middle;
    margin: 0 5px;
  }
}
</style>
