/**
 * 转换函数
 */

export default {
  /**
   * 分为单位的价格转2位小数人民币
   * @param  {String} val 价格（分）
   * @return {String}     2位小数人民币（元）
   */
  toRmb: function(val) {
    return (Number(val) / 100).toFixed(2);
  }
};
