<template>
  <div v-bind:class="{
    'hidebar': true,
    'hidebar-hide': hide
  }">
    <a href="javascript:void(0)" class="arrow" @click="close">
      <i class="iconhandle" v-if="hide">&#xe619;</i>
      <i class="iconhandle" v-else="hide">&#xe612;</i>
    </a>
  </div>
</template>

<script>
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    hide: {
      require: true,
      type: Boolean,
      coerce: coerceBoolean,
      twoWay: true,
      default: false
    }
  },

  methods: {
    close() {
      this.hide = !this.hide;
    }
  }
};
</script>

<style lang="less">
.hidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 258px;
  z-index: 1000;
  width: 0;
  border-left: 1px solid #dfdfdf;
  height: 100%;
  transition: transform 1s ease;
  transform: translate(0, 0);

  &.hidebar-hide {
    transform: translate(-178px, 0);
    .arrow {
      animation: hidebar-arrow 1s ease forwards;
    }
  }

  .arrow {
    position: absolute;
    top: 50%;
    left: -11px;
    margin-top: -18px;
    width: 10px;
    background: #dfdfdf;
    height: 36px;
    line-height: 36px;
    border-radius: 2px 0 0 2px;
    color: #9b9b9b;

    &:hover {
      background-color: #888;

      .iconhandle {
        color: #fff;
      }
    }
  }

  .iconhandle {
    display: block;
    font-size: 12px;
    transform: scale(.6, .6);
  }
}
@keyframes hidebar-arrow {
  to {
    left: 0;
    border-radius: 0 2px 2px 0;
  }
}
@-webkit-keyframes hidebar-arrow {
  to {
    left: 0;
    border-radius: 0 2px 2px 0;
  }
}
@media (max-width: 1280px) {
  .hidebar {
    left: 258px;

    &.hidebar-hide {
      transform: translate(-178px, 0);
    }
  }
}
</style>
