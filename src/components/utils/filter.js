import Vue from 'vue';

export default {
  init() {
    Vue.filter('rmbDisplay', {
      // model -> view
      // 在更新 `<input>` 元素之前格式化值
      read: function(val) {
        return (Number(val) / 100).toFixed(2);
      },
      // view -> model
      // 在写回数据之前格式化值
      write: function(val, oldVal) {
        if (!val) {
          return '';
        }
        var number = +val.replace(/[^\d.]/g, '');
        return isNaN(number) ? 0 : parseFloat((number * 100).toFixed(2));
      }
    });
    Vue.filter('thousand', function(val) {
      let result = Number(val);
      if (result) {
        val = val + '';
        let fix = ''; // 小数点情况
        if (val.includes('.')) {
          let splitArr = val.split('.');
          val = splitArr[0];
          fix = splitArr[1];
        }
        val = val.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
          return s + ',';
        });
        if (fix) {
          return val + '.' + fix;
        }
        return val + fix;
      }
      return val;
    });
    Vue.filter('translate', function(val) {
      switch (val) {
        case 'id':
          return '媒体ID';
        case 'appName':
          return '媒体名称';
        case 'currentValue':
          return '分析时段消耗';
        case 'contrastValue':
          return '对比时段消耗';
        case 'variation':
          return '变化值';
        case 'proportion':
          return '占比';
        case 'sdkUvAfModulus':
          return '广告位访问UV影响系数';
        case 'arcPsuAfModulus':
          return '每UV券请求影响系数';
        case 'lcParcAfModulus':
          return '系数发券成功率影响系数';
        case 'plpPlcAfModulus':
          return '付费券占比影响系数';
        case 'acPplpAfModulus':
          return '付费券arpu值影响系数';
      }
    });
    Vue.filter('saveFour', function(val) {
      val = val + '';
      if (val === 'NaN') {
        return '-';
      }
      if (val.indexOf('.') !== -1) {
        var arr = val.split('.');
        if (arr[1].length <= 3) {
          return (val = arr[0].toString() + '.' + arr[1].toString());
        } else {
          return (val =
            arr[0].toString() + '.' + arr[1].toString().substring(0, 3));
        }
      } else {
        return val;
      }
    });
  }
};
