<template>
  <div id="main" v-if="chartData && chartData.length">
    <div id="sequence"></div>
    <div id="chart">
      <div id="chart-container">
        <div id="explanation" style="visibility: hidden;">
          <span id="percentage"></span>
        </div>
        <div id="sidebar">
          <div id="legend"></div>
        </div>
      </div>
      <div id="legend-data" v-if="nodeDetail.depth">
        <div>
          <p class="title"><span><i class="line"></i>当前节点名称</span><span>{{nodeDetail.name}}</span></p>
        </div>
        <div>
          <p class="title">
            <span>
              节点转化
              <Tooltip content="本节点访问/父节点访问" placement="right">
                <i class="iconhandle disable">&#xe649;</i>
              </Tooltip>  
            </span><span>{{nodeDetail.value}}，{{nodeDetail.rate}}</span>
          </p>
        </div>
        <div v-if="nodeDetail.continueRate.length">
          <p class="title">
            <span>
              节点流出
            </span>
            <span v-if="nodeDetail.allContinueRate">{{nodeDetail.allContinueCount}}，{{nodeDetail.allContinueRate + '%'}}</span>
          </p>
          <p v-for="item in nodeDetail.continueRate">
            <span v-if="item.rate != '0.00'">链路{{$index + 1}}：{{ item.name }}，{{ item.value }}，{{ item.rate + '%' }}</span>
          </p>
        </div>
        <div v-if="nodeDetail.depth === 1">
          <p class="title">
            <span>
            节点跳出率
            <Tooltip content="本节点没有操作就退出的用户/本节点访问总量" placement="right">
              <i class="iconhandle disable">&#xe649;</i>
            </Tooltip>
            </span>
            <span>{{nodeDetail.breakRate + '%'}}</span>
          </p>
        </div>
        <div v-if="nodeDetail.depth === 1">
          <p class="title">
            <span>
              资源位导流比例
              <Tooltip content="用户离开本节点的方式" placement="right">
                <i class="iconhandle disable">&#xe649;</i>
              </Tooltip>
            </span>
            <span></span>
          </p>
          <p>浮标：{{nodeDetail.floatDiversionValue}}，{{nodeDetail.floatDiversionRate + '%'}}</p>
          <p>返回拦截：{{nodeDetail.backDiversionValue}}，{{nodeDetail.backDiversionRate + '%'}}</p>
          <p>推荐弹层：{{nodeDetail.recommandDiversionValue}}，{{nodeDetail.recommandDiversionRate + '%'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import d3 from 'd3';
import Tooltip from 'iview/src/components/tooltip';
export default {
  components: {
    Tooltip
  },
  data() {
    return {
      nodeDetail: {
        name: undefined,
        depth: undefined,
        value: undefined,
        rate: undefined,
        continueRate: [],
        allContinueRate: undefined,
        allContinueCount: undefined,
        breakRate: undefined,
        floatDiversionRate: undefined,
        floatDiversionValue: undefined,
        backDiversionValue: undefined,
        backDiversionRate: undefined,
        recommandDiversionValue: undefined,
        recommandDiversionRate: undefined
      }
    };
  },
  props: {
    chartData: {
      type: Array,
      require: true
    },
    detailData: {
      type: Object,
      require: false
    }
  },
  watch: {
    chartData: function(data) {
      d3.select('#sequence').html('');
      d3.selectAll('#chart-container svg').remove();
      d3.select('#legend').html('');
      if (!data || !data.length) return false;
      let _this = this;
      // Dimensions of sunburst.
      var width = 500;
      var height = 500;
      var radius = Math.min(width, height) / 2;

      // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
      var b = {
        w: 100,
        h: 30,
        s: 3,
        t: 10
      };

      // Total size of all segments; we set this later, after loading the data.
      var totalSize = 0;
      var vis = d3
        .select('#chart-container')
        .append('svg:svg')
        .attr('width', width)
        .attr('height', height)
        .append('svg:g')
        .attr('id', 'container')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      var partition = d3.layout
        .partition()
        .size([2 * Math.PI, radius * radius])
        .value(function(d) {
          return d.size;
        });

      var arc = d3.svg
        .arc()
        .startAngle(function(d) {
          return d.x;
        })
        .endAngle(function(d) {
          return d.x + d.dx;
        })
        .innerRadius(function(d) {
          return Math.sqrt(d.y);
        })
        .outerRadius(function(d) {
          return Math.sqrt(d.y + d.dy);
        });
      // Use d3.text and d3.csv.parseRows so that we do not need to have a header
      // row, and can receive the csv as an array of arrays.
      var json = buildHierarchy(this.chartData);

      // Mapping of step names to colors.
      var colors = {
        活动: '#7c7dfc',
        活动中心: '#de783b',
        直投页: '#6ab975',
        主会场: '#92911b',
        end: '#bbbbbb'
      };

      function getName(d) {
        return d.name.indexOf('(') === -1
          ? d.name
          : d.name.replace(d.name.match(/\((.*?)\)/)[0], '');
      }
      function getColor(d) {
        return colors[getName(d)];
      }
      /* 自动获取节点并分配颜色
      var colors = {}
      var colorsMap = [];
      // 查询所有节点名称
      function loop(arr) {
        arr.children.map((el, index) => {
          const name = el.name.indexOf('(') === -1 ? el.name : el.name.replace(el.name.match(/\((.*?)\)/)[0], '')
          if (colorsMap.indexOf(name) === -1) {
            colorsMap.push(name);
          }
          if (el.children) {
            loop(el);
          }
        });
      }
      loop(json);

      // 节点名称排序
      const nodeSort = ['活动', '活动中心', '直投页', '主会场', 'end'];
      colorsMap.sort((a, b) => {
        return nodeSort.indexOf(a) - nodeSort.indexOf(b);
      });

      // 给节点分配颜色
      colorsMap.map((el, index) => {
        if (el.indexOf('活动') !== -1) {
          colors[el] = '#7c7dfc';
        }
        else if (el.indexOf('直投页') !== -1) {
          colors[el] = '#92911b';
        }
        else if (el.indexOf('主会场') !== -1) {
          colors[el] = '#ffd57e';
        }
        else if (el.indexOf('other') !== -1) {
          colors[el] = '#ff7d79';
        }
        else if (el.indexOf('search') !== -1) {
          colors[el] = '#ff298f';
        }
        else if (el.indexOf('end') !== -1) {
          colors[el] = '#bbbbbb';
        }
      });
       */

      createVisualization(json);

      // Main function to draw and set up the visualization, once we have the data.
      function createVisualization(json) {
        // Basic setup of page elements.
        initializeBreadcrumbTrail();
        drawLegend();

        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        vis
          .append('svg:circle')
          .attr('r', radius)
          .style('opacity', 0);

        // For efficiency, filter nodes to keep only those large enough to see.
        var nodes = partition.nodes(json).filter(function(d) {
          return d.dx > 0.005; // 0.005 radians = 0.29 degrees
        });

        var path = vis
          .data([json])
          .selectAll('path')
          .data(nodes)
          .enter()
          .append('svg:path')
          .attr('display', function(d) {
            return d.depth ? null : 'none';
          })
          .attr('d', arc)
          .attr('fill-rule', 'evenodd')
          .style('fill', function(d) {
            return getColor(d);
          })
          .style('opacity', 1)
          // .on('mouseover', mouseover);
          .on('click', mouseover);

        // Add the mouseleave handler to the bounding circle.
        // d3.select('#container').on('mouseleave', mouseleave);

        // Get total size of the tree = value of root node from partition.
        totalSize = path.node().__data__.value;
      }

      function getPercentageString(a, b) {
        var percentage = (100 * a / b).toFixed(2);
        var percentageString = percentage + '%';
        if (percentage < 0.1) {
          percentageString = '< 0.1%';
        }
        return percentageString;
      }

      // Fade all but the current sequence, and show it in the breadcrumb trail.
      function mouseover(d) {
        d3.select('#percentage').text(getPercentageString(d.value, totalSize));

        d3.select('#explanation').style('visibility', '');

        var sequenceArray = getAncestors(d);

        updateBreadcrumbs(
          sequenceArray,
          getPercentageString(d.value, totalSize)
        );

        updateDetailData(d);

        // Fade all the segments.
        d3.selectAll('path').style('opacity', 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        vis
          .selectAll('path')
          .filter(function(node) {
            return sequenceArray.indexOf(node) >= 0;
          })
          .style('opacity', 1);
      }

      // Restore everything to full opacity when moving off the visualization.
      // function mouseleave(d) {
        // Hide the breadcrumb trail
        // d3.select('#trail').style('visibility', 'hidden');

        // Deactivate all segments during transition.
        // d3.selectAll('path').on('mouseover', null);

        // Transition each segment to full opacity and then reactivate it.
        // d3
        //   .selectAll('path')
        //   .transition()
        //   .duration(1000)
        //   .style('opacity', 1)
        //   .each('end', function() {
        //     d3.select(this).on('mouseover', mouseover);
        //   });

        // d3.select('#explanation').style('visibility', 'hidden');

        // 离开图标清空右上角数据
        // _this.nodeDetail.depth = 0;
      // }

      // Given a node in a partition layout, return an array of all of its ancestor
      // nodes, highest first, but excluding the root.
      function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
          path.unshift(current);
          current = current.parent;
        }
        return path;
      }

      function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3
          .select('#sequence')
          .append('svg:svg')
          .attr('width', '100%')
          .attr('height', 30)
          .attr('id', 'trail');
        // Add the label at the end, for the percentage.
        trail
          .append('svg:text')
          .attr('id', 'endlabel')
          .style('fill', '#000');
      }

      // Generate a string that describes the points of a breadcrumb polygon.
      function breadcrumbPoints(d, i) {
        var points = [];
        points.push('0,0');
        points.push(b.w + ',0');
        points.push(b.w + b.t + ',' + b.h / 2);
        points.push(b.w + ',' + b.h);
        points.push('0,' + b.h);
        if (i > 0) {
          // Leftmost breadcrumb; don't include 6th vertex.
          points.push(b.t + ',' + b.h / 2);
        }
        return points.join(' ');
      }

      // Update the breadcrumb trail to show the current sequence and percentage.
      function updateBreadcrumbs(nodeArray, percentageString) {
        // Data join; key function combines name and depth (= position in sequence).
        var g = d3
          .select('#trail')
          .selectAll('g')
          .data(nodeArray, function(d) {
            return d.name + d.depth;
          });

        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append('svg:g');

        entering
          .append('svg:polygon')
          .attr('points', breadcrumbPoints)
          .style('fill', function(d) {
            return getColor(d);
          });

        entering
          .append('svg:text')
          .attr('x', (b.w + b.t) / 2)
          .attr('y', b.h / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .text(function(d) {
            return d.name;
          });

        // Set position for entering and updating nodes.
        g.attr('transform', function(d, i) {
          return 'translate(' + i * (b.w + b.s) + ', 0)';
        });

        // Remove exiting nodes.
        g.exit().remove();

        // Now move and update the percentage at the end.
        d3
          .select('#trail')
          .select('#endlabel')
          .attr('x', (nodeArray.length + 0.5) * (b.w + b.s))
          .attr('y', b.h / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select('#trail').style('visibility', '');
      }

      function drawLegend() {
        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
          w: 75,
          h: 30,
          s: 3,
          r: 3
        };

        var legend = d3
          .select('#legend')
          .append('svg:svg')
          .attr('width', d3.keys(colors).length * (li.w + li.s))
          .attr('height', li.h);

        var g = legend
          .selectAll('g')
          .data(d3.entries(colors))
          .enter()
          .append('svg:g')
          .attr('transform', function(d, i) {
            return 'translate(' + i * (li.w + li.s) + ', 0)';
          });

        g
          .append('svg:rect')
          .attr('rx', li.r)
          .attr('ry', li.r)
          .attr('width', li.w)
          .attr('height', li.h)
          .style('fill', function(d) {
            return d.value;
          });

        g
          .append('svg:text')
          .attr('x', li.w / 2)
          .attr('y', li.h / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .text(function(d) {
            return d.key;
          });
      }

      // Take a 2-column CSV and transform it into a hierarchical structure suitable
      // for a partition layout. The first column is a sequence of step names, from
      // root to leaf, separated by hyphens. The second column is a count of how
      // often that sequence occurred.
      function buildHierarchy(csv) {
        var root = { name: 'root', children: [] };
        for (var i = 0; i < csv.length; i++) {
          var sequence = csv[i][0];
          var size = +csv[i][1];
          if (isNaN(size)) {
            // e.g. if this is a header row
            continue;
          }
          var parts = sequence.split('-');
          var currentNode = root;
          for (var j = 0; j < parts.length; j++) {
            var children = currentNode['children'];
            var nodeName = parts[j];
            var childNode;
            if (j + 1 < parts.length) {
              // Not yet at the end of the sequence; move down the tree.
              var foundChild = false;
              for (var k = 0; k < children.length; k++) {
                if (children[k]['name'] === nodeName) {
                  childNode = children[k];
                  foundChild = true;
                  break;
                }
              }
              // If we don't already have a child node for this branch, create it.
              if (!foundChild) {
                childNode = { name: nodeName, children: [] };
                children.push(childNode);
              }
              currentNode = childNode;
            } else {
              // Reached the end of the sequence; create a leaf node.
              childNode = { name: nodeName, size: size };
              children.push(childNode);
            }
          }
        }
        return root;
      }

      // 以下代码都是更新右上角信息提示
      function updateDetailData(d) {
        // 节点名称
        _this.nodeDetail.name = d.name;
        // 节点层级
        _this.nodeDetail.depth = d.depth;
        // 节点数值
        _this.nodeDetail.value = d.value;
        // 节点转化
        _this.nodeDetail.rate = getPercentageString(d.value, d.parent.value);
        // 节点流出比例
        _this.nodeDetail.continueRate = [];
        if (d.children) {
          d.children.map(el => {
            _this.nodeDetail.continueRate.push({
              name: `${getAllPath(d)} - ${el.name}`,
              value: el.value,
              rate: (el.value / d.value * 100).toFixed(2)
            });
          });
        }

        // 总流出
        // _this.nodeDetail.allContinueRate = undefined;
        // const endContinueRate = _this.nodeDetail.continueRate.find(el => {
        //   return el.name.indexOf('end') !== -1;
        // });
        // if (endContinueRate) {
        //   _this.nodeDetail.allContinueRate = `${(
        //     100 - endContinueRate.rate
        //   ).toFixed(2)}%`;
        // }

        _this.nodeDetail.allContinueRate = 100;
        _this.nodeDetail.allContinueCount = 0;
        _this.nodeDetail.continueRate.map(el => {
          if (el.name.indexOf('end') !== -1) {
            _this.nodeDetail.allContinueRate -= parseFloat(el.rate);
          } else {
            _this.nodeDetail.allContinueCount += el.value;
          }
        });
        _this.nodeDetail.allContinueRate = parseFloat(_this.nodeDetail.allContinueRate).toFixed(2);

        // 跳出率
        _this.nodeDetail.breakRate =
          d.depth === 1
            ? (_this.detailData[getName(d)].breakRate * 100).toFixed(2)
            : undefined;

        // 资源位导流比例

        if (d.depth === 1) {
          _this.nodeDetail.floatDiversionValue = 0;
          _this.nodeDetail.floatDiversionRate = 0;

          _this.nodeDetail.backDiversionValue = 0;
          _this.nodeDetail.backDiversionRate = 0;

          _this.nodeDetail.recommandDiversionValue = 0;
          _this.nodeDetail.recommandDiversionRate = 0;

          _this.nodeDetail.continueRate.map(el => {
            if (el.name.indexOf('浮标') !== -1) {
              _this.nodeDetail.floatDiversionValue += el.value;
              _this.nodeDetail.floatDiversionRate += parseFloat(el.rate);
            } else if (el.name.indexOf('返回拦截') !== -1) {
              _this.nodeDetail.backDiversionValue += el.value;
              _this.nodeDetail.backDiversionRate += parseFloat(el.rate);
            } else if (el.name.indexOf('推荐弹层') !== -1) {
              _this.nodeDetail.recommandDiversionValue += el.value;
              _this.nodeDetail.recommandDiversionRate += parseFloat(el.rate);
            }
          });
          _this.nodeDetail.floatDiversionRate = parseFloat(
            _this.nodeDetail.floatDiversionRate
          ).toFixed(2);
          _this.nodeDetail.backDiversionRate = parseFloat(
            _this.nodeDetail.backDiversionRate
          ).toFixed(2);
          _this.nodeDetail.recommandDiversionRate = parseFloat(
            _this.nodeDetail.recommandDiversionRate
          ).toFixed(2);
        } else {
          _this.nodeDetail.floatDiversionRate = 0;
          _this.nodeDetail.backDiversionRate = 0;
          _this.nodeDetail.recommandDiversionRate = 0;
        }
      }
      // 获取当前节点的链路

      function getAllPath(d) {
        let path = '';

        function loopPath(node) {
          path = path ? `${node.name} - ${path}` : node.name;
          if (node.parent && node.parent.name !== 'root') {
            loopPath(node.parent);
          }
        }
        loopPath(d);
        return path;
      }
    }
  }
};
</script>
<style>
#sequence text,
#legend text {
  font-weight: 600;
  fill: #fff;
  font-size: 12px;
}
#chart-container path {
  stroke: #fff;
}
</style>

<style lang="less" scoped>
#main {
  position: relative;
}

#sidebar {
  position: absolute;
  left: 55px;
  bottom: 0;
}

#legend-data {
  float: left;
  min-width: 200px;
  max-width: 400px;
  min-height: 500px;
  background: #FFFFFF;
  border: 1px solid #eeeeee;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  border-radius: 8px;
  padding: 20px;
  position: relative;
  &:after{
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 10px;
    border-right-color: #fff;
    left: -20px;
    top: 226px;
    
  }
  &:before{
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 10px;
    border-right-color: #eeeeee;
    left: -21px;
    top: 226px;
  }
  > div {
    padding: 10px 0;
    margin-bottom: 10px;
    &:last-child {
      border-bottom: none;
    }
  }
  p {
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 2;
    &.title{
      span{
        color: #000;
        .line{
          width: 3px;
          height: 15px;
          background-color: #ff795c;
          display: inline-block;
          margin-right: 5px;
          vertical-align: -2px;
        }
        &:last-child {
          color: #ff795c;
          white-space: nowrap;
          font-weight: 700;
        }
        &:first-child {
          display: inline-block;
          width: 145px;
          font-size: 16px;
          line-height: initial;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .iconhandle{
    color: #ff795c;
  }
}

#chart {
  position: relative;
  margin-bottom: 20px;
  min-height: 700px;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

#chart-container {
  float: left;
  position: relative;
}

#explanation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  text-align: center;
  color: #666;
}

#percentage {
  font-size: 1.5em;
}
</style>