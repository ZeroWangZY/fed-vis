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
import Sankey from "./component/sankey";
import Bar from "./component/bar";
import Ridgeline from "./component/ridgeline";
import Violin from "./component/violin";
import Radar from "./component/radar";
import Lollipop from "./component/lollipop";
import CircularBar from "./component/circularbar";
import Area from "./component/area";
import Pie from "./component/pie";
import CirclePacking from "./component/circle-packing";
import Sunburst from "./component/sunburst";
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
        <Route exact path="/sankey">
          <Sankey />
        </Route>
        <Route exact path="/barchart">
          <Bar />
        </Route>
        <Route exact path="/ridgeline">
          <Ridgeline />
        </Route>
        <Route exact path="/violin">
          <Violin />
        </Route>
        <Route exact path="/radar">
          <Radar />
        </Route>
        <Route exact path="/lollipop">
          <Lollipop />
        </Route>
        <Route exact path="/circularbar">
          <CircularBar />
        </Route>
        <Route exact path="/area">
          <Area />
        </Route>
        <Route exact path="/pie">
          <Pie />
        </Route>
        <Route exact path="/circlepacking">
          <CirclePacking />
        </Route>
        <Route exact path="/sunburst">
          <Sunburst />
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
