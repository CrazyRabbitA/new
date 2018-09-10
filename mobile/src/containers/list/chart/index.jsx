import React from 'react';
import echarts from 'echarts';
import { observer } from 'mobx-react';
import store from '../store';
import styles from './index.less';

@observer
class ChartRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourcesline: ''
    }
  }
  componentDidMount() {
    const { updataResourcesline, getDataList, renderLineChart, updateParams} = store;
    updateParams({
      appSource: 2,
      quota: 'totalChargeFees',
      name: '消耗'
    });
    this.setState({
      resourcesline: echarts.init(document.getElementById('reportCahrt'))
    }, () => {
      getDataList().then(() => {
        updataResourcesline(this.state.resourcesline).then(() => {
          renderLineChart();
        });
      });
    })
  }
  render() {
    return (
       <div id='reportCahrt' className={styles.reportCahrt}></div>
    )
  }
}
export default ChartRender