<template>
  <div class="app-logo">
    <a :href="apphome" class="btn-open" @click="toggleDropDownList">
      <p :class="appLogo" class="logo"></p>
      <i class="iconhandle icon-fold" @click="toggleDropDownList" v-el:showapp></i>
    </a>
  </div>
  <div class="sidebar-topbar" :class="{active: showDropDown, 'applist-2-col': applist.length > 6 }">
    <div @click="toggleDropDownList" class="logo-space">
    </div>
    <div class="dropdown-list" v-show="showDropDown">
      <ul class="app-list" v-show="applist && applist.length !== 0" v-el:applist>
        <template v-for="item in applist">
          <li>
            <a :href="'/'+ item.id" >
              <p :class="item.id"></p>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import EventListener from '../utils/EventListener';

export default {
  ready: function() {
    this.getAppList();
  },
  data() {
    return {
      showDropDown: false,
      applist: [
        {
          id: 'tuia',
          name: '推啊'
        }, {
          id: 'duiba',
          name: '兑吧'
        }, {
          id: 'qiho',
          name: '奇货'
        }, {
          id: 'youfen',
          name: '有粉'
        }, {
          id: 'wawaji',
          name: '娃娃机'
        },
        {
          id: 'chartdev',
          name: '报表开发'
        },
        {
          id: 'quwen',
          name: '趣闻'
        }
      ],
      appId: 1,
      appLogo: ''
    };
  },
  props: {
    appShowId: {
      required: true,
      default: '',
      type: String
    }
  },
  methods: {
    toggleDropDownList: function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.localStorage.needShowApp = false;
      let self = this;
      let handle = function(_e) {
        if (!self.$els.applist.contains(_e.target)) {
          self.showDropDown = false;
          EventListener.listen(document, 'click', handle).remove();
        }
      };
      if (this.showDropDown) {
        this.showDropDown = false;
      } else {
        this.showDropDown = true;
        EventListener.listen(document, 'click', handle);
      }
    },
    getAppList: function() {
      let delIndex;
      this.applist.forEach((item, index) => {
        if (item.id === this.appShowId) {
          delIndex = index;
          this.appLogo = item.id;
          this.appName = item.name;
        }
      });
      this.applist.splice(delIndex, 1);
    }
  }
};
</script>

<style lang="less">
.sidebar-topbar {
  background: #272727;
  text-align: left;
  position: relative;
  border-radius: 0 4px 0 0;
  z-index: 2;
  .logo-space {
    width: 80px;
    height: 74px;
    cursor: pointer;
  }
  &.active.applist-2-col {
    transition: all .5s ease;
    .dropdown-list {
      width: 252px;
      .app-list {
        width: 230px;
        li {
          width: 99px;
          display: inline-block;
        }
      }
      .btn-add-app {
        width: 230px;
      }
    }
  }
}
// 弹出下拉框
.dropdown-list {
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 80px;
  width: 120px;
  height: 170px;
  background-color: #333;
  border-radius: 0 0 4px 0;
  padding-bottom: 5px;
  -webkit-box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
  .app-list {
    margin: 0 auto;
    padding: 8px;
    li {
      display: inline-block;
      float: left;
      width: 50px;
      height: 50px;
      padding-top: 7px;
      a {
        color: #444;
        display: inline-block;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
      }
      img {
        width: 40px;
        height: 40px;
        margin-right: 5px;
        overflow: hidden;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
}
// 头像
.app-logo {
  .btn-open {
    position: absolute;
    height: 40px;
    width: 40px;
    z-index: 99;
    left: 20px;
    top: 15px;
    &:hover {
      .logo {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
      }
    }
    .icon-fold {
      color: #999;
      font-size: 10px;
      position: absolute;
      left: 42px;
      top: 17px;
      opacity: 0.8;
    }

    .icon-fold:after {
      content: '\e618';
    }
  }
}
.logo-block{
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  -webkit-transition: .2s ease;
  transition: .2s ease;
  background-size: 100% 100% !important;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
.tuia {
  .logo-block();
  background-image: url('../../assets/images/tuia_app_logo.png');
}
.duiba {
  .logo-block();
  background-image: url('../../assets/images/duiba_app_logo.png');
}
.youfen {
  .logo-block();
  background-image: url('../../assets/images/youfen_app_logo.png');
}
.qiho {
  .logo-block();
  background-image: url('../../assets/images/qiho_app_logo.png');
}
.wawaji {
  .logo-block();
  background-image: url('../../assets/images/wwj_app_logo.png');
}
.chartdev {
  .logo-block();
  background-image: url('../../assets/images/chart_app_logo.png');
}
.quwen {
  .logo-block();
   background-image: url('../../assets/images/qw_app_logo.png');
}
</style>
