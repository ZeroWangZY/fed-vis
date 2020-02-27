import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import history from "./history";
import './index.css';
import App from './route-page/App';
import Gallery from "./route-page/Gallery";
import Treemap from "./component/treemap";
import LineChart from "./component/linechart";
import * as serviceWorker from './serviceWorker';
import configureStore from 'store';


const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/gallery">
          <Gallery />
        </Route>
        <Route exact path="/">
          <App />
        </Route>
        <Route exact path="/treemap">
          <Treemap />
        </Route>
        <Route exact path="/linechart">
          <LineChart />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
// fetch('/api/heatmap/all?type=start&start_time=2017/05/19Z10:00&end_time=2017/05/19Z12:00')
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
