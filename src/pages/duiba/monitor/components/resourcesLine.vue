<template>
  <div class="resources-line-area">
    <d-select :options.sync="quotaArr" :value.sync="selectQuota" @select="selectQuotaChange"></d-select>
    <div :id="lineId" style="height:400px;width:100%;margin-top:20px;"></div>
  </div>
</template>
<script>
  import cheatResourcesMixins from '../mixins/cheatResourcesMixins.js';
  import resourcesMixins from '../mixins/resourcesMixins.js';
  const quotaArr = [
    {
      label: '页面访问pv',
      id: 'pagePv'
    }, {
      label: '页面访问uv',
      id: 'pageUv'
    }, {
      label: '点击pv',
      id: 'clickPv'
    }, {
      label: '点击uv',
      id: 'clickUv'
    }, {
      label: 'uv点击率',
      id: 'uvClickRate'
    }, {
      label: 'uv流失率',
      id: 'wastageRate'
    }, {
      label: 'pv点击率',
      id: 'mainmeetRate'
    }, {
      label: '人均进入主会场次数',
      id: 'perTimes'
    }
  ];
  export default {
    mixins: [cheatResourcesMixins, resourcesMixins],
    props: {
      resourcesData: {
        type: Object,
        default: () => {}
      },
      lineId: String
    },
    data() {
      return {
        quotaArr: quotaArr,
        selectQuota: 'pagePv'
      };
    },
    methods: {
      selectQuotaChange() {
        this.getResourcesDate(this.resourcesData, this.selectQuota);
      }
    }
  };
</script>