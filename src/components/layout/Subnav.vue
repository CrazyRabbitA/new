<template>
  <div
    v-bind:class="{
    'subnav': true,
    'subnav-hide': hide
    }"
    >
    <div class="subnav-desc">
      <h1>{{ title }}</h1>
      <p>{{ desc }}</p>
    </div>
    <nav class="subnav-link">
      <ul>
        <li v-for="nav in subnav">
          <template v-if="nav.disabled">
            <a href="javascript:;" class="disabled" disabled>
              <i class="iconnav">{{{ nav.icon }}}</i>
              {{ nav.title }}
              <span v-if="nav.num" class="statesNum">{{nav.num}}</span>
            </a>
          </template>
          <template v-else>
            <a v-if="nav.outLink" href="{{nav.outLink}}" target="_blank">
              <i class="iconnav">{{{ nav.icon }}}</i>
              {{ nav.title }}
              <span v-if="nav.num" class="statesNum">{{nav.num}}</span>
            </a>
            <a v-else v-link="{ path: nav.url, activeClass: 'active' }">
              <i class="iconnav">{{{ nav.icon }}}</i>
              {{ nav.title }}
              <span v-if="nav.num" class="statesNum">{{nav.num}}</span>
            </a>
          </template>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import coerceBoolean from '../utils/coerceBoolean.js';

export default {
  props: {
    title: {
      required: true,
      type: String
    },
    desc: {
      required: true,
      type: String
    },
    subnav: {
      required: true,
      type: Array
    },
    hide: {
      type: Boolean,
      coerce: coerceBoolean
    }
  }
};
</script>

<style lang="less">
.subnav {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 80px;
  z-index: 1000;
  width: 178px;
  background-color: #f7f6f2;
  transition: transform 1s ease;
  transform: translate(0, 0);

  &.subnav-hide {
    transform: translate(-178px, 0);
  }
}

.subnav-desc {
  margin: 32px 0 0 0;
  padding-left: 27px;
}

.subnav-desc {
  h1 {
    font-size: 18px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 2px;
    color: #444;
  }

  p {
    font-size: 12px;
    line-height: 16px;
    color: #888;
  }
}

.subnav-link {
  a {
    color: #888;
    display: block;
    padding-left: 33px;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    text-align: left;
    &.active {
      background: #e0dfda;
      color: #444;
    }

    &:hover {
      background: rgba(224, 223, 218, 0.6);
      color: #444;
    }
  }
  a[disabled]:hover{
    background-color: transparent;
    color: #888;
  }

  .iconnav {
    display: inline;
    font-size: 12px;
    padding-right: 6px;
  }
}
@media (max-width: 1280px) {
  .subnav {
    width: 178px;

    &.subnav-hide {
      transform: translate(-178px, 0);
    }
  }
  .subnav-desc {
    padding-left: 17px;
  }
  .subnav-link a {
    padding-left: 23px;
  }
}
</style>
