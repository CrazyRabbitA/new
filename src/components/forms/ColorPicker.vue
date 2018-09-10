<template>
  <div class="colorpicker-wrapper">
    <div class="colorpicker-trigger" :class="{'active': active}" @click="active = !active">
      <span class="color-preview" :style="{backgroundColor: bgColor}"></span>
      <i class="iconhandle">&#xe618;</i>
    </div>
    <div class="color-box-wrapper" v-show="active">
      <sketch :colors.sync="colorObj"></sketch>
      <div class="color-options">
        <a href="javascript:;" class="btn btn-default" @click="active = false" >取消</a>
        <a v-if="valid" href="javascript:;" class="btn btn-green" @click="chooseColor">确定</a>
        <a v-else href="javascript:;" class="btn btn-green" disabled>确定</a>
      </div>
    </div>
  </div>
</template>
<script>
import tinycolor from 'tinycolor2';
import {Sketch} from 'vue-color';

export default {
  components: {
    sketch: Sketch
  },
  props: {
    color: {
      type: String,
      twoWay: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: false,
      valid: true,
      colorObj: {
        hex: '#ffffff',
        hsl: {
          h: 0,
          s: 0,
          l: 1,
          a: 1
        },
        hsv: {
          h: 150,
          s: 0.66,
          v: 0.30,
          a: 1
        },
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        },
        a: 1
      }
    };
  },
  watch: {
    'colorObj': {
      handler: function(val) {
        let _color = tinycolor(val.hex);
        this.valid = _color.isValid();
      },
      deep: true
    }
  },
  computed: {
    bgColor: function() {
      return this.type === 'tag' ? '#' + this.color : this.color;
    }
  },
  ready() {
    this.initPicker();
  },
  methods: {
    chooseColor: function() {
      this.color = this.type === 'tag' ? this.colorObj.hex.slice(1) : this.colorObj.hex;
      this.active = false;
    },
    initPicker: function() {
      let _color = tinycolor(this.color);
      let _new = {
        hex: _color.toHexString(),
        a: _color.getAlpha(),
        rgba: _color.toRgb(),
        hsv: _color.toHsv(),
        hsl: _color.toHsl()
      };
      this.colorObj = Object.assign({}, this.colorObj, _new);
    }
  }
};
</script>
<style lang="less">
.colorpicker-wrapper{
  position: relative;
  display: inline-block;
  margin-right: 10px;
  .color-box-wrapper{
    position: absolute;
    top: 50px;
    left: 0px;
    width: 240px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    border-top-left-radius: 0px;
    z-index: 5;
    .vue-color__sketch{
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      width: 240px;
    }
    .vue-color__sketch__presets{
      display: none;
    }
  }
  .clearfix{
    *zoom: 1;
    &:before, &:after {
      content: ' ';
      display: table;
    }
    &:after {
      clear: both;
    }
  }
  .form-control{
    height: 28px;
    display: inline-block;
    width: 160px;
    float: left;
  }
  .palette{
    display: inline-block;
    float: right;
    span{
      display: inline-block;
      width: 34px;
      height: 28px;
    }
  }
  .color-options{
    margin-top: 10px;
    text-align: right;
    .btn-default{
      margin-right: 7px;
    }
  }
  #picker-wrapper {
    position: relative;
    display: inline-block;
    #picker{
      width: 200px;
      height: 200px;
    }
  }
  #slider-wrapper {
    position: relative;
    display: inline-block;
    float: right;
    #slider{
      width: 30px;
      height: 200px;
    }
  }
  #picker-indicator {
    width: 6px;
    height: 6px;
    background-color: #000;
    border-radius: 50%;
    position: absolute;
    border: 1px solid white;
  }
  #slider-indicator {
    width: 100%;
    height: 5px;
    left: -1px;
    position: absolute;
    border: 1px solid black;
  }
}
.colorpicker-trigger{
  border-radius: 2px;
  border: 1px solid #ccc;
  padding: 5px;
  cursor: pointer;
  background-color: #fff;
  user-select: none;
  position: relative;
  z-index: 2;
  &.active{
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    border-bottom: 0px;
  }
  &:hover .iconhandle{
    color: #444;
  }
  .color-preview{
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 1px;
    vertical-align: middle;
  }
  .iconhandle{
    display: inline-block;
    height: 40px;
    color: #888;
    font-size: 12px;
    line-height: 40px;
    padding: 0px 5px;
    vertical-align: middle;
  }
}
.tag-colorpicker {
  .colorpicker-trigger {
    .iconhandle {
      display: none;
    }

    .color-preview {
      height: 22px;
      width: 76px;
    }
  }

  .color-box-wrapper {
    top: 33px;

    .form-control {
      padding-left: 10px;
      width: 160px;
      margin-right: 0;
    }
  }
}
</style>
