<template>
  <div class="region-selector">
    <div class="form-group bottomline">
      <label class="control-label">请选择地域：</label>
      <div class="province-input">
        <input type="text" class="form-control" placeholder="请选择省份" readonly @click.stop="provinceInputClick" v-model="currCity.provinceName">
        <ul class="provinces" v-show="provinceShow">
          <li v-for="region in regions.province">
            <label>{{region.classify}}</label>
            <div class="province-list">
              <a href="javascript:void(0)" class="province-item" v-for="province in region.provinces" :class="{ 'active': +currCity.provinceCode === +province.proCode}" @click="provinceClick(province.proName, province.proCode)">
                {{province.proName}}
              </a>
            </div>
          </li>
        </ul>
      </div>
      <div class="city-input">
        <input type="text" class="form-control" placeholder="请选择城市" readonly @click.stop="cityInputClick" v-model="currCity.cityName">
        <div class="citys" v-show="cityShow">
          <a href="javascript:void(0)" class="city-item" :class="{'active': currCity.cityCode === 'all'}" @click="cityClick('all')">全省范围</a>
          <a href="javascript:void(0)" class="city-item" v-for="city in currProvinceInfo.cityCodeList"  :class="{ 'active': +currCity.cityCode === +city.code}" @click="cityClick(city.code, city.name)">
            {{city.name}}
          </a>
        </div>
      </div>
      <a class="btn btn-default btn-lg" @click="addCity">添加</a>
    </div>
    <div class="region-selected">
      <p class="error-region-tip c-orange" v-show="emptyError">请选择省份</p>
      <p class="error-region-tip" v-show="errorType === 1">
        已添加 <span class="c-orange">{{currCity.cityName}}</span>
      </p>
      <p class="error-region-tip" v-show="errorType === 2">
        已添加 <span class="c-orange">{{currCity.provinceName}}</span> 全省范围，无需添加 <span class="c-orange">{{currCity.cityName}}</span>
      </p>
      <template v-if="!areas || (areas && areas.length === 0)">
        <p class="empty-region-tip">您还未选择地域</p>
      </template>
      <template v-else>
        <div class="area-tags">
          <a href="javascript:void(0)" class="area-tag" v-for="(index, area) in areas">
            <template v-if="area.cityCode === 'all'">
              {{area.provinceName}}
            </template>
            <template v-else>
              {{area.cityName}}
            </template>
            <i class="iconhandle" @click="removeArea(index)">&#xe609;</i>
          </a>
        </div>
      </template>
    </div>
    <modal :title="modalTitle" :show.sync="errorModalShow" :on-ok="confirmConflict">
      <template slot="modal-body">
        <div class="modal-body">
          <p>已选列表存在属于 <span class="c-orange">{{currCity.provinceName}}</span> 的城市：</p>
          <p>
            <span class="c-orange" v-for="name in conflictNames">
              {{name}}
            </span>
          </p>
          <p>添加“全省范围”后将被全部清除。</p>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import EventListener from '../utils/EventListener.js';
import modal from '../basic/Modal';
import regions from './regions.js';
import expressRegions from './expressRegions.js';

export default {
  components: {
    modal
  },
  props: {
    areas: {
      twoWay: true,
      type: Array,
      default: () => {
        return [];
      }
    },
    currCity: {
      type: Object,
      default: () => {
        return {};
      }
    },
    type: {
      default: ''
    }
  },

  watch: {
    city: function(val) {
      if (val) {
        this.currCity = val;
      }
    }
  },

  data() {
    return {
      // 1->重复添加；2->添加省份后，再添加城市；3->添加城市后，再添加省份
      errorType: 0,
      errorModalShow: false,
      regions: this.type === 'express' ? expressRegions : regions,
      provinceShow: false,
      cityShow: false,
      emptyError: false
    };
  },

  computed: {
    currProvinceInfo: function() {
      var citys = this.regions.citys;
      for (let i = 0; i < citys.length; i++) {
        if (+citys[i].proCode === +this.currCity.provinceCode) {
          return citys[i];
        }
      }
      return {};
    },
    modalTitle: function() {
      return '添加' + this.currCity.provinceName;
    },
    conflictNames: function() {
      var results = [];
      var areas = this.areas || [];
      for (let i = 0; i < areas.length; i++) {
        let item = areas[i];
        if (+this.currCity.provinceCode === +item.provinceCode) {
          results.push(item.cityName);
        }
      }
      return results;
    }
  },

  ready() {
    this._documentClickEvent = EventListener.listen(document, 'click', (e) => {
      this.cityShow = false;
      this.provinceShow = false;
    });
  },

  methods: {
    /**
     * 添加城市
     */
    addCity: function() {
      var city = this.currCity || {};
      if (!city.cityCode || !city.provinceCode) {
        this.emptyError = true;
        return;
      }
      for (let i = 0; i < this.areas.length; i++) {
        let item = this.areas[i];
        // 2->添加省份后，再添加城市；
        if (+item.provinceCode === +city.provinceCode && item.cityCode === 'all') {
          this.errorType = 2;
          return;
        }
        // 1->重复添加；
        if (item.cityCode === city.cityCode && +item.provinceCode === +city.provinceCode) {
          this.errorType = 1;
          return;
        }
        // 3->添加城市后，再添加省份
        if (+item.provinceCode === +city.provinceCode && city.cityCode === 'all') {
          this.errorModalShow = true;
          return;
        }
      }

      this.areas.push({
        cityName: city.cityName,
        cityCode: city.cityCode,
        provinceCode: city.provinceCode,
        provinceName: city.provinceName
      });
    },

    provinceInputClick: function() {
      this.provinceShow = !this.provinceShow;
      this.cityShow = false;
      this.emptyError = false;
    },

    cityInputClick: function() {
      if (!this.currCity.provinceCode) {
        return;
      }
      this.cityShow = !this.cityShow;
      this.provinceShow = false;
    },

    /**
     * 省份点击回调
     *
     * @param {String} code 省code
     * @param {String} name 省名称
     */
    provinceClick: function(proName, proCode) {
      if (+proCode === this.currCity.provinceCode) {
        return;
      }
      this.currCity = {
        provinceCode: proCode,
        provinceName: proName,
        cityName: '全省范围',
        cityCode: 'all'
      };
      this.errorType = 0;
    },

    /**
     * 城市点击回调
     *
     * @param {String} code 城市code
     * @param {String} name 城市名
     */
    cityClick: function(code, name) {
      if (code === 'all') {
        name = '全省范围';
      }
      this.currCity.cityCode = code;
      this.currCity.cityName = name;
      this.errorType = 0;
    },

    /**
     * 移除某个城市
     *
     * @param {Number} index 在`this.areas`中的索引
     */
    removeArea: function(index) {
      this.areas.splice(index, 1);
      this.errorType = 0;
    },

    /**
     * 确认冲突
     */
    confirmConflict: function() {
      var city = this.currCity;
      this.errorModalShow = false;
      this.areas = this.areas.filter((item) => {
        return +item.provinceCode !== +city.provinceCode;
      });
      this.areas.push({
        cityName: city.cityName,
        cityCode: city.cityCode,
        provinceCode: city.provinceCode,
        provinceName: city.provinceName
      });
    }
  },
  beforeDestroy() {
    this._documentClickEvent.remove();
  }
};
</script>

<style lang="less">
.region-selector {
  .modal-title h4 {
    margin-bottom: 0;
  }

  .form-group {
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .province-input,
  .city-input {
    position: relative;
    width: 180px;
    display: inline-block;
    margin-right: 15px;
  }

  .provinces,
  .citys {
    position: absolute;
    left: 0;
    top: 38px;
    z-index: 999;
    background-color: #fff;
    width: 284px;
    border-radius: 5px;
    padding: 10px;
    border: 1px solid #d5d5d5;
  }

  .provinces {
    line-height: 1.2;
    label {
      float: left;
      font-size: 14px;
      padding: 4px;
    }
  }

  .province-list {
    margin-left: 45px;
  }

  .province-item,
  .city-item {
    color: #444;
    font-size: 14px;
    display: inline-block;
    padding: 4px;
    border-radius: 2px;

    &:hover,
    &.active {
      background-color: #29b6b0;
      color: #fff;
    }
  }

  .empty-region-tip,
  .error-region-tip {
    color: #343434;
    font-size: 14px;
    line-height: 28px;
  }

  .area-tag {
    font-size: 14px;
    color: #444;
    display: inline-block;
    position: relative;
    line-height: 26px;
    padding: 0 36px 0 8px;
    margin: 10px 15px 10px 0;
    border: 1px solid #e9e9e9;

    .iconhandle {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #e5e5e5;
      width: 28px;
      line-height: 26px;
      color: #888;
      font-size: 12px;
      text-align: center;
    }

    &:hover {
      border-color: #F66B4E;

      .iconhandle {
        background-color: #F66B4E;
        color: #fff;
      }
    }
  }

  .empty-region-tip,
  .error-region-tip,
  .area-tags {
    padding-left: 110px;
  }
}
</style>
