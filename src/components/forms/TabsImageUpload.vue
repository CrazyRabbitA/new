<template>
  <div class="tabs-box">
    <ul class="header-tabs cf" role="tablist">
        <li v-for="(key, tab) in tabs" @click.prevent="select(key)" >
          <template v-if="!tab.hide">
            <a :class="{active: isActive(key)}" href="javascript:void(0)">
              {{tab.title}}
              <i class="iconhandle" :class="{'active': tab.multi ? tab.images.length !== 0 : !!tab.imageUrl}">&#xe629;</i>
            </a>
          </template>
        </li>
    </ul>
    <div class="tab-content" v-el:tab-content>
      <template v-for="(key, tab) in tabs">
          <template v-if="!tab.hide">
            <div role="tabpanel" class="tab-pane active" v-show="isActive(key)">
              <p class="warn-tip" v-show="tab.warnTip"><span class="c-orange">注：</span>{{{tab.warnTip}}}</p>
              <multiimage v-if="tab.multi" :images.sync="tab.images" :width="tab.width" :height="tab.height"></multiimage>
              <imageupload v-else :url.sync="tab.imageUrl" :width="tab.width" :height="tab.height" :tip="tab.uploadTip" :psdurl="tab.psdurl"></imageupload>
              <p class="invalid">{{tab.error}}</p>
            </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import imageupload from './ImageUpload';
import multiimage from './MultiImageUpload';

export default {
  components: {
    imageupload,
    multiimage
  },

  props: {
    tabs: {
      type: Object,
      twoWay: true,
      default: () => {
        return {};
      }
    },
    index: {
      type: String,
      default: ''
    }
  },

  events: {
    'uploaded': 'imageUploaded'
  },

  methods: {
    select: function(index) {
      this.index = index;
    },

    isActive: function(index) {
      return index === this.index;
    },

    imageUploaded: function() {
      this.tabs[this.index].error = '';
    }
  }
};
</script>
