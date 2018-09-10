import React from 'react';
import store from '../store';
import styles from './index.less';
import { Flex, Button } from 'antd-mobile';
const SelectBtn = (props) => (
  <div className={styles.btn_warp} onClick={props.fn}>
  {
    props.isActive ? <div className={styles.active}>{props.d.text}</div> : <div className={styles.btn}>{props.d.text}</div>
  }
  </div>
);

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }  
  componentDidMount() {
    this.setState({
      text: this.props.defaultText
    });
  }
  select = (d) => {
    const { updateParams, getDataList, renderLineChart} = store;
    this.setState({
      text: d.text
    }, () => {
      if (this.props.needFetch === 'need') {
        updateParams({
          appSource: d.id
        });
        getDataList().then(() => {
          renderLineChart();
        });
      } else {
        updateParams({
          quota: d.id,
          name: d.text
        });
        renderLineChart();
      }
    });
  }
  render() {
    return (
      <div>
        <div className={styles.item_label}>{this.props.label}</div>
        <div className={styles.item_list}>
          <Flex wrap="wrap">
            {this.props.itemList && this.props.itemList.map((d, index) => <SelectBtn d={d} isActive={d.text === this.state.text} fn={() => this.select(d)}/>)}
          </Flex>
        </div>
      </div>
    );
  };
};

export default Item;