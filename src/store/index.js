import rootSaga from 'sagas';
import rootReducer from 'reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware()
const enhancer = compose(applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || compose);

export default function configureStore (initialstate) {
  const store = createStore(rootReducer,initialstate, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
}
