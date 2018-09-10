import React from 'react';
import Chart from './chart';
import Filter from './filter';
class List extends React.Component {
  render() {
    return (
      <div>
        <Chart/>
        <Filter/>
      </div>
    );
  };
};

export default List;