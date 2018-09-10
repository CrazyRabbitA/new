<template>
  <div class="resources-line-area" style="width: 100%">
    <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange"></d-select>
    <div :id="lineId" style="height:400px;width:100%;margin-top:20px;"></div>
  </div>
</template>
<script>
  import cheatHotspotMixins from '../mixins/cheatHotspotMixins.js';
  import hotspotMixins from '../mixins/hotspotMixins.js';
  const typeQuotaArr = [
    {
      label: '曝光pv',
      id: 'expPv'
    }, {
      label: '曝光uv',
      id: 'expUv'
    }, {
      label: '点击pv',
      id: 'clickPv'
    }, {
      label: '点击uv',
      id: 'clickUv'
    }, {
      label: 'pv点击率',
      id: 'pvClickRate'
    }
  ];
  const appQuotaArr = [
    {
      label: '曝光pv',
      id: 'expPv'
    }, {
      label: '曝光uv',
      id: 'expUv'
    }, {
      label: '点击pv',
      id: 'clickPv'
    }, {
      label: '点击uv',
      id: 'clickUv'
    }, {
      label: 'pv点击率',
      id: 'pvClickRate'
    }, {
      label: '前七日点击率',
      id: 'lastSevenDayClickRate'
    }, {
      label: '同比增加',
      id: 'growth'
    }
  ];
  export default {
    mixins: [cheatHotspotMixins, hotspotMixins],
    props: {
      resourcesData: {
        type: Object,
        default: () => {}
      },
      type: String,
      lineId: String
    },
    ready() {
      if (this.type === 'type') {
        this.quotaArr = typeQuotaArr;
      } else {
        this.quotaArr = appQuotaArr;
      }
    },
    data() {
      return {
        quotaArr: [],
        selectQuota: 'expPv'
      };
    },
    methods: {
      selectQuotaChange() {
        this.getResourcesDate(this.resourcesData, this.selectQuota);
      }
    }
  };
</script>