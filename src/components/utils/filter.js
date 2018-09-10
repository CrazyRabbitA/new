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
  }
};
