<template>
  <nav class="botbar-nav">
    <a href="javascript:;" class="slide-toggle" @click="slideToggle">
      <i class="iconhandle" >&#xe61c;</i>
      <span class="tiny-tips" v-if="noReadCount > 0 && !simple"></span>
    </a>
    <ul v-bind:class="{
      'hide': hide,
      'nav-link': true
     }">
      <li v-for="item in navList">
        <template v-if="item.id !== 'outlink'">
          <a  v-link="{ path: item.href, activeClass: 'active' }">
            <i class="iconnav">{{{item.icon}}}</i>
            {{item.title}}
          </a>
        </template>
        <template v-else>
          <a v-bind:href="item.href" v-bind:class="{
              'nav-link': true,
              'active': (item.id == type)
            }">
            <i class="iconnav">{{{item.icon}}}</i>
            {{item.title}}
          </a>
        </template>
      </li>
    </ul>
    <!-- <p class="logo"></p> -->
  </nav>
</template>

<script>
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    type: {
      type: String,
      required: true,
      default: ''
    },
    hide: {
      require: true,
      type: Boolean,
      coerce: coerceBoolean,
      twoWay: true
    },
    simple: {
      type: Boolean,
      coerce: coerceBoolean,
      default: false
    }
  },
  data() {
    return {
      navList: [
        {
          id: 'account',
          title: '账户',
          icon: '&#xe697;',
          href: '/account'
        },
        {
          id: 'outlink',
          title: '退出',
          icon: '&#xe696;',
          href: '/logout'
        }
      ],
      noReadCount: 0,
      letterModal: {
        show: false,
        list: []
      }
    };
  },
  methods: {
    slideToggle: function() {
      this.hide = !this.hide;
    }
  }
};
</script>

<style lang="less">
.botbar-nav {
  width: 80px;
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #333;
  .logo {
    background: url('../../assets/images/logo.png');
    width: 45px;
    height: 28px;
    background-size: 45px;
    background-repeat: no-repeat;
    margin: 20px auto;
  }
  .slide-toggle {
    position: relative;
    display: inline-block;
    background: rgba(39, 39, 39, .2);
    width: 80px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #fff;
    .iconhandle {
      opacity: .2;
    }
    &:hover{
       background: rgba(39, 39, 39, 1);
       .iconhandle {
        opacity: 1;
       }
     }
    .tiny-tips {
      position: absolute;
      top: 5px;
      right: 5px;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff795c;
    }
  }
  .hide{
    display: none;
  }
  .btn-letter {
    position: relative;
  }
  .red-tips {
    position: absolute;
    top: 5px;
    right: 20px;
    display: inline-block;
    background: #ff795c;
    padding: 2px 5px;
    border-radius: 10px;
  }
}

</style>
