<template>
  <div class="image-upload-container cf">
    <div class="img fl" v-bind:class="{
      'img-uploaded': !!url
    }">
      <p>
        <img :src="url" alt="">
        <fileupload class="file-upload" name="file" post-action="/upload/image" put-action="/upload/image" :extensions="extensions" :accept="accept" :size="size"></fileupload>
      </p>
    </div>
    <h3>{{name}}</h3>
    <p class="invalid">{{errorTip}}</p>
  </div>
</template>

<script>
import ImageUploadMixins from './ImageUploadMixins.js';

export default {
  mixins: [ImageUploadMixins],

  props: {
    url: {
      type: String,
      twoWay: true,
      default: ''
    },
    name: {
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
