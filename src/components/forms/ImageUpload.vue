<template>
  <div class="image-upload-container cf w-{{width}}-h-{{height}}">
    <div class="img fl" v-bind:class="{
      'img-uploaded': !!url
    }">
      <p>
        <img :src="url" alt="">
      </p>
    </div>
    <div class="upload-area">
      <div class="upload-cell">
        <slot name="upload-tip">
          <p v-if="tip">{{tip}}</p>
          <a v-if="psdurl" :href="psdurl" class="psd-link">下载PSD</a>
        </slot>
        <div class="upload-btn">
          <fileupload class="file-upload" name="file" post-action="/upload/image" put-action="/upload/image" :extensions="extensions" :accept="accept" :size="size"></fileupload>
          <a href="javascript:void(0)" class="btn btn-default">选择上传</a>
          <slot name="example-download">
          </slot>
        </div>
      </div>
    </div>
    <p class="invalid">{{errorTip}}</p>
  </div>
</template>

<script>
import ImageUploadMixins from './ImageUploadMixins.js';

export default {
  mixins: [ImageUploadMixins],

  props: {
    tip: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      twoWay: true,
      default: ''
    },
    psdurl: {
      type: String,
      default: ''
    }
  },

  methods: {
    afterFileUpload: function(file) {
      // this.url = file.data.data.url;
      this.url = file.data.data;
      this.$dispatch('uploaded');
    }
  }
};
</script>
