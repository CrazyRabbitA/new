import React from 'react';
import { observer } from 'mobx-react';
import store from '../store';
import styles from './index.less';
import FilterItem from '../item';
const sourceArr = [
  {
    text: '全部',
    id: 2
  },
  {
    text: '推啊',
    id: 1
  },
  {
    text: '兑吧',
    id: 0
  }
];
const quotaArr = [
  {
    text: '消耗',
    id: 'totalChargeFees'
  },
  {
    text: '券请求数',
    id: 'orderAskCnt'
  },
  {
    text: '发券量',
    id: 'orderCnt'
  },
  {
    text: '曝光量',
    id: 'exposurePv'
  },
  {
    text: '点击量',
    id: 'clickPv'
  },
  {
    text: '点击率',
    id: 'ctr'
  },
  {
    text: '点击单价',
    id: 'avgClickFee'
  },
  {
    text: '总发券Arpu',
    id: 'orderAvgFee'
  },
  {
    text:'付费券Arpu',
    id:'feeArpu'
  },
  {
    text: '人均发券量',
    id: 'userFaquanAvgCnt'
  },
  {
    text: '免费券占比',
    id: 'freeRate'
  },
  {
    text: '失败比例',
    id: 'bianliRatio'
  },
  {
    text: '请求UV',
    id: 'requestUv'
  },
  {
    text: '免费UV',
    id: 'freeBianliUv'
  },
  {
    text: '失败UV',
    id: 'reqBianliUv'
  },
  {
    text: '在线广告',
    id: 'advertNums'
  },
  {
    text: '新增广告',
    id: 'newAdvertNums'
  }
];
@observer
class Filter extends React.Component {
  render() {
    return (
      <div className="styles.filter">
        <FilterItem itemList={sourceArr} label="来源" defaultText="全部" needFetch="need"/>
        <FilterItem itemList={quotaArr} label="指标" defaultText="消耗"/>
      </div>
    );
  };
};

export default Filter;