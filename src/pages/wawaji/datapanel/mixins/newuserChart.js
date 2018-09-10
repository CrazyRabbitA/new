import echarts from 'echarts';

export default {
  data() {
    return {};
  },
  methods: {
    newuserChart(data, dom, type) {
      let arr = [];
      let sum = 0;
      let maxData = 0;
      let legendName = [];
      if (type === 'newuser') {
        maxData = parseInt(data['launch']);
        legendName = ['广告投放', '广告点击', '登录', '进入房间', '抓娃娃', '充值'];
      } else if (type === 'userswitch') {
        maxData = parseInt(data['login']);
        legendName = ['登录', '进入房间', '抓娃娃', '再来一次'];
      }
      const changeTwoDecimal = (x) => {
        let fx = parseFloat(x);
        if (isNaN(fx)) {
          console.log('function:changeTwoDecimal->parameter error');
          return false;
        }
        fx = Math.round(x * 100) / 100;
        let sx = fx.toString();
        let posDecimal = sx.indexOf('.');
        if (posDecimal < 0) {
          posDecimal = sx.length;
          sx += '.';
        }
        while (sx.length <= posDecimal + 2) {
          sx += '0';
        }
        return sx;
      };
      const toFix = data => {
        if (data === 0) {
          return 0;
        }
        return changeTwoDecimal((data / maxData).toFixed(4) * 100);
      };
      for (let key in data) {
        if (key !== 'curDate') {
          sum += data[key];
        }
        switch (key) {
          case 'charge':
            arr.push({
              name: '充值',
              value: toFix(data[key])
            });
            break;
          case 'click':
            arr.push({
              name: '广告点击',
              value: toFix(data[key])
            });
            break;
          case 'finish':
            arr.push({
              name: '抓娃娃',
              value: toFix(data[key])
            });
            break;
          case 'inroom':
            arr.push({
              name: '进入房间',
              value: toFix(data[key])
            });
            break;
          case 'launch':
            arr.push({
              name: '广告投放',
              value: toFix(data[key])
            });
            break;
          case 'login':
            arr.push({
              name: '登录',
              value: toFix(data[key])
            });
            break;
          case 'again':
            arr.push({
              name: '再来一次',
              value: toFix(data[key])
            });
            break;
        }
      }
      if (sum === 0) {
        document.getElementById(dom).innerHTML = '<p>暂无数据！<p>';
        return;
      } else {
        document.getElementById(dom).innerHTML = '';
      }
      echarts.init(document.getElementById(dom)).dispose();
      this.myChart = echarts.init(document.getElementById(dom));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '漏斗图',
          subtext: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {}
        },
        legend: {
          data: legendName,
          bottom: 0
        },
        calculable: true,
        series: [{
          name: '漏斗图',
          type: 'funnel',
          left: '5%',
          top: 60,
          // x2: 80,
          bottom: 60,
          width: '80%',
          // height: {totalHeight} - y - y2,
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '88%',
          sort: 'none',
          gap: 2,
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{b}\n {c}%'
            }
          },
          labelLine: {
            normal: {
              length: 15,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1
            }
          },
          data: arr
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
    updateChart() {}
  }
};
