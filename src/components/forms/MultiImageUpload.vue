<template>
  <div class="multi-image-upload cf w-{{width}}-h-{{height}}">
    <ul class="uploaded-images fl">
      <li track-by="$index" v-for="(index, img) in images">
        <img :src="img">
        <i class="iconhandle remove-icon" @click="removeImage(index)">&#xe605;</i>
      </li>
    </ul>
    <div class="add-image-container fl" v-show="images.length < max">
      <fileupload class="file-upload" name="file" post-action="/upload/image" put-action="/upload/image" extensions="jpg,png,jpeg" accept="image/jpg,image/jpeg,image/png" :size="size"></fileupload>
      <i class="icontoolbar add-image-btn">&#xe602;</i>
    </div>
    <p class="invalid">{{errorTip}}</p>
  </div>
</template>

<script>
import ImageUploadMixins from './ImageUploadMixins.js';
import coerceNumber from '../utils/coerceNumber.js';

export default {
  mixins: [ImageUploadMixins],

  props: {
    images: {
      type: Array,
      default: () => {
        return [];
      },
      twoWay: true
    },
    max: {
      type: Number,
      default: 5,
      coerce: coerceNumber
    }
  },

  methods: {
    afterFileUpload: function(file) {
      // this.images.push(file.data.data.url);
      this.images.push(file.data.data);
      this.$dispatch('uploaded');
    },

    /**
     * 移除某张图片
     */
    removeImage: function(index) {
      this.images.splice(index, 1);
    }
  }
};
</script>

<style lang="less">
.multi-image-upload {
  &.w-640-h-300 {
    img {
      width: 214px;
      height: 100px;
    }

    .add-image-btn {
      width: 214px;
      font-size: 40px;
      line-height: 100px;
    }
  }

  li {
    float: left;
    padding: 3px;
    position: relative;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    margin-right: 15px;
    margin-bottom: 15px;
  }

  img {
    display: block;
  }

  .remove-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    color: #ccc;
    cursor: pointer;
  }

  .add-image-container {
    padding: 3px;
    border: 1px solid #e5e5e5;
    position: relative;
  }

  .add-image-btn {
    display: block;
    background-color: #d8d8d8;
    text-align: center;
    color: #fff;
  }

  .file-upload {
    position: absolute;
    top: 0;
    left: 0;
    width: 214px;
    height: 100px;
  }

  .invalid {
    clear: both;
    font-size: 14px;
    color: #ff795c;
    padding-top: 10px;
  }
}
</style>
