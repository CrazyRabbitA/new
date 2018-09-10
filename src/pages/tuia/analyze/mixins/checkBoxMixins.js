const sortArr = [
  {
    id: '1',
    title: '第一次'
  },
  {
    id: '2',
    title: '第二次'
  },
  {
    id: '3',
    title: '第三次'
  },
  {
    id: '4',
    title: '第四次'
  },
  {
    id: '5',
    title: '第五次'
  },
  {
    id: 'other',
    title: '其它'
  }
];
const platformArr = [
  {
    id: '0-599',
    title: '0-599'
  },
  {
    id: '600-1099',
    title: '600-1099'
  },
  {
    id: '1100-1699',
    title: '1100-1699'
  },
  {
    id: '1700-2699',
    title: '1700-2699'
  },
  {
    id: '2700-4499',
    title: '2700-4499'
  },
  {
    id: '4500+',
    title: '4500+'
  },
  {
    id: 'other',
    title: '其它'
  }
];

const sysArr = [
  {
    id: 'Android',
    title: 'Android'
  },
  {
    id: 'IOS',
    title: 'IOS'
  },
  {
    id: 'other',
    title: '其它'
  }
];
const netArr = [
  {
    id: 'WIFI',
    title: 'WIFI'
  },
  {
    id: '2G',
    title: '2G'
  },
  {
    id: '3G',
    title: '3G'
  },
  {
    id: '4G',
    title: '4G'
  },
  {
    id: 'other',
    title: '其它'
  }
];
const quotaArr = [
  {
    id: 'advertRequestCount',
    title: '广告券请求量'
  },
  {
    id: 'lcParc',
    title: '发券成功率'
  },
  {
    id: 'plpPlc',
    title: '付费券占比'
  },
  {
    id: 'acPplp',
    title: '付费券arpu值'
  }
];
const mediaArr = [
  {
    id: 'sdkUv',
    title: '广告位访问UV'
  },
  {
    id: 'arcPsu',
    title: '每UV券请求'
  },
  {
    id: 'lcParc',
    title: '发券成功率'
  },
  {
    id: 'plpPlc',
    title: '付费券占比'
  },
  {
    id: 'acPplp',
    title: '付费券arpu值'
  }
];

const brandArr = [
  {
    id: '苹果',
    title: '苹果'
  },
  {
    id: 'OPPO',
    title: 'OPPO'
  },
  {
    id: 'VIVO',
    title: 'VIVO'
  }, {
    id: '小米',
    title: '小米'
  }, {
    id: '华为',
    title: '华为'
  }, {
    id: '荣耀',
    title: '荣耀'
  }, {
    id: '金立',
    title: '金立'
  }, {
    id: '三星',
    title: '三星'
  }, {
    id: '乐视',
    title: '乐视'
  }, {
    id: '酷派',
    title: '酷派'
  }, {
    id: '魅族',
    title: '魅族'
  }, {
    id: '360',
    title: '360'
  }, {
    id: '海尔',
    title: '海尔'
  }, {
    id: '联想',
    title: '联想'
  },
  {
    id: '中兴',
    title: '中兴'
  }, {
    id: '美图',
    title: '美图'
  }, {
    id: '其他品牌',
    title: '其他品牌'
  }, {
    id: '未识别设备',
    title: '未识别设备'
  }
];
const appFlowTypeArr = [
  {
    id: '1',
    title: '微信'
  },
  {
    id: '2',
    title: 'QQ'
  },
  {
    id: '3',
    title: '支付宝'
  },
  {
    id: '4',
    title: '其他'
  }
];
export default {
  data() {
    return {
      sortArr: sortArr,
      platformArr: platformArr,
      sysArr: sysArr,
      netArr: netArr,
      quotaArr: quotaArr,
      mediaArr: mediaArr,
      appList: [],
      sortList: [],
      platformList: [],
      sysList: [],
      netList: [],
      quotaList: [],
      timeNode: [],
      brandArr: brandArr,
      brandList: [],
      appFlowTypeArr: appFlowTypeArr,
      appFlowTypeList: []
    };
  }
};
