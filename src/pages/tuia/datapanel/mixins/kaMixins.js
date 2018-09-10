export default {
  methods: {
    _fixData(dataObj) {
      let cacheObj = {};
      for (let [key, item] of Object.entries(dataObj)) {
        let seriesObj = {};
        for (let [k, v] of Object.entries(item)) {
          if (typeof v === 'object' && key === 'line') {
            let dataArr = v.map(o => {
              return o.value ? o.value : 0;
            });
            let timeArr = v.map(o => {
              return o.time;
            });
            let dataObj = {
              data: dataArr,
              time: timeArr
            };
            Object.assign(dataObj, this.itemSet[k]);
            seriesObj[k] = dataObj;
          }
        }
        cacheObj[key] = {
          name: 'ka',
          key: key,
          data: seriesObj
        };
      }
      return cacheObj;
    }
  }
};
