import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import Home from './containers/home';
import List from './containers/list';
import Water from './lib/water';
import './index.less';
const PrimaryLayout = props => (
  <div>
    <main>
      {props.children}
    </main>
  </div>
);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={PrimaryLayout}>
      <IndexRoute component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/list" component={List} />
    </Route>
  </Router>
, document.getElementById('app'));
