export function thousand(num, long) {
  let numLong = 2;
  if (long === 0) {
    numLong = long;
  }
  if (long) {
    numLong = long;
  }
  num = Number(num).toFixed(numLong);
  if (num) {
    num = num + '';
    let fix = ''; // 小数点情况
    let splitArr = num.split('.');
    num = splitArr[0];
    fix = splitArr[1] ? splitArr[1] : '';
    num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
      return s + ',';
    });
    if (fix) {
      return num + '.' + fix;
    }
    return num;
  }
  return num;
};
export function addpercent(r, c, i, key, long) {
  let val = r[key];
  let str = '';
  if (!val) {
    str = '<div class="appName tright">-</div>';
  } else {
    if (i === 0) {
      str = '<div class="appName tright">' + (val * 100).toFixed(2) + '%</div>';
    } else {
      str = '<div class="appName tright" name="' + r.appName + '" type="true" appid="' + r.appId + '" curdate="' + r.curDate + '" key="' + key + '" @click="clickModel">' + (val * 100).toFixed(2) + '%</div>';
    }
  }
  return str;
};
export function addcomma(r, c, i, key, long) {
  let val = r[key];
  let str = '';
  if (!val) {
    str = '<div class="appName tright">-</div>';
  } else {
    val = thousand(val, long);
    if (i === 0) {
      str = '<div class="appName tright">' + val + '</div>';
    } else {
      str = '<div class="appName tright" name="' + r.appName + '" type="false" appid="' + r.appId + '" curdate="' + r.curDate + '" key="' + key + '" @click="clickModel">' + val + '</div>';
    }
  }
  return str;
};
export function addpercent2(r, c, i, key, long) {
  let val = r[key];
  let str = '';
  if (!val) {
    str = '<div class="appName tright">-</div>';
  } else {
    if (i === 0) {
      str = '<div class="appName tright">' + (val * 100).toFixed(2) + '%</div>';
    } else {
      str = '<div class="appName tright" name="' + r.slotName + '" type="true" slotid="' + r.slotId + '" curdate="' + r.curDate + '" key="' + key + '" @click="clickModel2">' + (val * 100).toFixed(2) + '%</div>';
    }
  }
  return str;
};
export function addcomma2(r, c, i, key, long) {
  let val = r[key];
  let str = '';
  if (!val) {
    str = '<div class="appName tright">-</div>';
  } else {
    val = thousand(val, long);
    if (i === 0) {
      str = '<div class="appName tright">' + val + '</div>';
    } else {
      str = '<div class="appName tright" name="' + r.slotName + '" type="false" slotid="' + r.slotId + '" curdate="' + r.curDate + '" key="' + key + '" @click="clickModel2">' + val + '</div>';
    }
  }
  return str;
};
