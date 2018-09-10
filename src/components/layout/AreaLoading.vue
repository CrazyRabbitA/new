<template>
  <div class="area-loading" v-bind:class="{
    'hide': !show
  }">
      <div class="sk-wave">
        <div class="sk-rect sk-rect1"></div>
        <div class="sk-rect sk-rect2"></div>
        <div class="sk-rect sk-rect3"></div>
        <div class="sk-rect sk-rect4"></div>
        <div class="sk-rect sk-rect5"></div>
      </div>
  </div>
</template>

<script>
import coerceBoolean from 'components/utils/coerceBoolean.js';

export default {
  props: {
    show: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    }
  }
};
</script>

<style lang="less">
.area-loading {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  .sk-wave {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;
  }
  .sk-wave .sk-rect {
    background-color: #1abc9c;
    height: 100%;
    width: 6px;
    display: inline-block;
    -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
    animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
  }
  .sk-wave .sk-rect1 {
    -webkit-animation-delay: -1.2s;
    animation-delay: -1.2s;
  }
  .sk-wave .sk-rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  .sk-wave .sk-rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
  .sk-wave .sk-rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }
  .sk-wave .sk-rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-waveStretchDelay {
    0%,
    40%,
    100% {
      -webkit-transform: scaleY(0.4);
      transform: scaleY(0.4);
    }
    20% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
    }
  }

  @keyframes sk-waveStretchDelay {
    0%,
    40%,
    100% {
      -webkit-transform: scaleY(0.4);
      transform: scaleY(0.4);
    }
    20% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
    }
  }
}
</style>