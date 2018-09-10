<template>
  <ul class="type-tabs cf">
    <li class="type-item" v-for="tab in tabs">
      <a v-link="{ path: tab.url, activeClass: 'active' }">{{tab.title}}</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tabs: {
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
@theme-color: #663399;
@theme-color-darker: #663399;
.datacenter-app {
  .type-tabs {
    padding-bottom: 20px;
  }

  .type-item {
    float: left;
    position: relative;

    &:first-child {
      padding-left: 0;

      &::before {
        display: none;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 7px;
      left: 0;
      height: 16px;
      width: 0;
      border-left: 1px dotted #ccc;
    }

    &:nth-of-type(1){
      > a {
        border-left: 1px solid #ccc;
      }
    }

    > a {
      display: block;
      line-height: 32px;
      background-color: #fff;
      border-right: 1px solid #ccc;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      padding: 0 30px;
      font-size: 14px;
      color: #444;
      position: relative;

      &.active {
        color: #fff;
        border-color: @theme-color-darker;
        background-color: @theme-color;

        &::before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -10px;
          margin-left: -2px;
          border: 5px solid transparent;
          border-top-color: @theme-color;
        }

        &:hover {
          background-color: @theme-color-darker;
          border-color: @theme-color-darker;

          &::before {
            border-top-color: @theme-color-darker;
          }
        }
      }
    }
  }
}
</style>
