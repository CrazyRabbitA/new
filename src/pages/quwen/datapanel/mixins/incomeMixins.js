export default {
  methods: {
    _fixData(dataObj) {
      let cacheObj = {};
      for (let [key, item] of Object.entries(dataObj)) {
        // if (key === 'ResidueBudget' || key === 'ResidueBalance' || key === 'AdvertConcume') { // 处理数据  分 除以100 化为元
        //   for (let v of Object.values(item)) {
        //     if (typeof v === 'object') {
        //       v = v.map(o => {
        //         if (o.value > 100) {
        //           o.value = Math.floor(o.value / 100);
        //         } else {
        //           o.value = o.value / 100;
        //         }
        //       });
        //     }
        //   }
        // }

        let seriesObj = {};
        let AdvertConcumeVal = 0;
        for (let [k, v] of Object.entries(item)) {
          // 去掉今天末尾为0的填充数据
          // if (k === 'tod') {
          //   for (let len = v.length; len--;) {
          //     if (v[len].value === 0) {
          //       v.pop();
          //     } else {
          //       break;
          //     }
          //   }
          //
          if (k === 'tod') {
            if (typeof v === 'object') {
              v.map(o => {
                AdvertConcumeVal += Number(o.value);
              });
            }
          }
          if (typeof v === 'object') {
            let dataArr = v.map(o => {
                // AdvertConcumeVal += o.value;
              return o.value ? parseInt(o.value) : 0;
            });
            let dataObj = {
              data: dataArr
            };
            Object.assign(dataObj, this.itemSet[k]);
            seriesObj[k] = dataObj;
          }
          // }
        }
        cacheObj[key] = {
          name: this.nameMap1[item.key],
          key: key,
          total: AdvertConcumeVal,
          data: seriesObj,
          isActive: false
        };
      }
      return cacheObj;
    }
  }
};
