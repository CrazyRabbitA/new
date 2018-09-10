export default {
  methods: {
    _fixData(dataObj) {
      let cacheObj = {};
      for (let [key, item] of Object.entries(dataObj)) {
        if (key === 'ResidueBudget' || key === 'ResidueBalance' || key === 'AdvertConcume') { // 处理数据  分 除以100 化为元
          for (let v of Object.values(item)) {
            if (typeof v === 'object') {
              v = v.map(o => {
                if (o.value > 100) {
                  o.value = Math.floor(o.value / 100);
                } else {
                  o.value = o.value / 100;
                }
              });
            }
          }
        }

        let seriesObj = {};
        let AdvertConcumeVal = 0;
        for (let [k, v] of Object.entries(item)) {
          // 去掉今天末尾为0的填充数据
          if (k === 'today') {
            for (let len = v.length; len--;) {
              if (v[len].value === 0) {
                v.pop();
              } else {
                break;
              }
            }
          }

          if (typeof v === 'object') {
            let dataArr = v.map(o => {
              if (key === 'AdvertConcume' && k === 'today') {
                AdvertConcumeVal += o.value;
              }
              return o.value ? o.value : 0;
            });
            let dataObj = {
              data: dataArr
            };
            Object.assign(dataObj, this.itemSet[k]);
            seriesObj[k] = dataObj;
          }
        }
        cacheObj[key] = {
          name: this.nameMap[item.key],
          key: key,
          desc: this.nameMapdesc[key],
          total: key === 'AdvertConcume' ? AdvertConcumeVal : (item.today[item.today.length - 1] && item.today[item.today.length - 1].value ? item.today[item.today.length - 1] && item.today[item.today.length - 1].value : 0),
          data: seriesObj,
          isActive: false
        };
      }
      return cacheObj;
    }
  }
};
