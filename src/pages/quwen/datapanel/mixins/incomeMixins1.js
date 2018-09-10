export default {
  methods: {
    _fixData1(dataObj) {
       // itemSet1没有初始化
      const colorArr = [
        '#60a4e8',
        '#2ac993',
        '#ff5b5b',
        '#fe8002',
        '#ffbf55',
        '#73cfca',
        '#8291d9'
      ];
      // const keyval = Object.keys(dataObj.appopenCountHori) ||
      // Object.keys(dataObj.clickPvHori) ||
      // Object.keys(dataObj.feeHori) ||
      // Object.keys(dataObj.newuserCountHori);
      const keyval = Object.keys(dataObj.appopenCountHori);
      let objData = {};
      keyval.forEach((ele, index) => {
        objData[ele] = {
          name: ele,
          type: 'line',
          itemStyle: {
            normal: {
              color: colorArr[index],
              borderWidth: 4
            }
          },
          lineStyle: {
            // normal: {
            //   type: 'dashed'
            // }
          }
        };
      });
      this.itemSet1 = objData;
      let cacheObj = {};
      for (let [key, item] of Object.entries(dataObj)) {
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
          // }
          // if (typeof v === 'object') {
          //   let dataArr = v.map(o => {
          //     AdvertConcumeVal += o.value;
          //     return o.value ? o.value : 0;
          //   });
          //   let dataObj = {
          //     data: dataArr
          //   };
          //   Object.assign(dataObj, this.itemSet1[k]);
          //   seriesObj[k] = dataObj;
          // }
          if (k === 'tod') {
            if (typeof v === 'object') {
              v.map(o => {
                AdvertConcumeVal += Number(o.value);
              });
            }
          }
          if (typeof v === 'object') {
            let dataArr = v.map(o => {
              AdvertConcumeVal += o.value;

              return o.value ? parseInt(o.value) : 0;
            });
            let dataObj = {
              data: dataArr
            };
            Object.assign(dataObj, this.itemSet1[k]);
            seriesObj[k] = dataObj;
          }
        }
        cacheObj[key] = {
          name: this.nameMap2[item.key],
          key: key,
          // total: AdvertConcumeVal,
          total: '',
          data: seriesObj,
          isActive: false
        };
      }
      return cacheObj;
    }
  }
};
