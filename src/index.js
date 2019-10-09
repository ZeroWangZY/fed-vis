import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import configureStore from 'store';

import rootSaga from 'sagas';
import rootReducer from 'reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';


const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)
// then run the saga
sagaMiddleware.run(rootSaga)

// const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
