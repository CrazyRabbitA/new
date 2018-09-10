export default {
  data() {
    return {
      typeName: []
    };
  },
  methods: {
    /**
     * @param {any} lineList 图表数据
     * @param {any} type 指标
     */
    getResourcesDate(lineList, type) {
      this.getTypeName(type);
      let leftLine = {
        name: this.typeName[0],
        type: 'line',
        itemStyle: {
          normal: {
            color: '#73cfca',
            borderWidth: 4
          }
        },
        data: []
      };
      let rightLine = {
        name: this.typeName[1],
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#ff9090',
            borderWidth: 4
          }
        },
        data: []
      };
      let dataList = [];
      let xData = Object.keys(lineList);
      let yData = [];
      if (type[0] && !this.isEmptyObject(lineList)) {
        Object.keys(lineList).forEach((key) => {
          if (lineList[key][(type[0])] === 'Infinity') {
            leftLine.data.push('-');
          } else if (lineList[key][(type[0])] === null) {
            leftLine.data.push(0);
          } else {
            leftLine.data.push(lineList[key][(type[0])]);
          }
        });
        yData.push({
          name: this.typeName[0],
          type: 'value',
          nameTextStyle: {
            color: '#444'
          },
          nameLocation: 'end',
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              if (value > 100000) {
                return (value / 1000) + 'k';
              }
              return value;
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        });
        dataList.push(leftLine);
      }
      // && !this.isEmptyObject(rightLine.type[1])
      if (type[1] && !this.isEmptyObject(lineList)) {
        Object.keys(lineList).forEach((key) => {
          if (lineList[key][(type[1])] === 'Infinity') {
            rightLine.data.push('-');
          } else if (lineList[key][(type[1])] === null) {
            rightLine.data.push(0);
          } else {
            rightLine.data.push(lineList[key][(type[1])]);
          }
        });
        yData.push({
          name: this.typeName[1],
          type: 'value',
          nameTextStyle: {
            color: '#444'
          },
          nameLocation: 'end',
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              if (value > 100000) {
                return (value / 1000) + 'k';
              }
              return value;
            },
            margin: 12,
            textStyle: {
              color: '#444'
            }
          }
        });
        dataList.push(rightLine);
      }

      this.renderLineChart(dataList, xData, yData);
    },
    /**
     * @desc 获取legend名字
     * @param {any} type
     */
    getTypeName(type) {
      this.typeName = [];
      if (type[0]) {
        this.quotaArr.forEach((item) => {
          if (item.id === type[0]) {
            this.typeName.push(item.label);
          }
        });
      }
      if (type[1]) {
        this.quotaArr.forEach((item) => {
          if (item.id === type[1]) {
            this.typeName.push(item.label);
          }
        });
      }
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }
  }
};
