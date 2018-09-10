import { hashHistory } from 'react-router';

import common from './common';

const utils = {
  // history跳转
  jumpTo(url) {
    hashHistory.push(url);
  },
  // // 登出函数
  // async logout() {
  //   const {system, ssoHomeURL} = await common.fetch('/sso/systemInfo');
  //   window.location.href = `${ssoHomeURL}/login?sysytemId=${system.id}&redirect=${encodeURIComponent(`${window.location.origin}/static/index.html`)}`;
  // },
  // 登出函数
  logout() {
    common.fetch('/sso/systemInfo').then((res) => {
      if (res.success) {
        window.location.href = `${res.ssoHomeURL}/login?systemId=${res.system.id}&redirect=${encodeURIComponent(`${window.location.origin}`)}`;
      }
    });
  },
  // 判断是否有值
  isNothing(value) {
    return value === '' || value === undefined || value === null || (typeof value === 'number' && (isNaN(value) || !isFinite(value)));
  },
  serialize(obj) {
    const str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(this.isNothing(obj[p]) ? '' : obj[p]));
      }
    }
    return str.join('&');
  }
};

export default utils;
