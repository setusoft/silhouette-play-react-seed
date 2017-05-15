import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { makeRootReducer } from './reducers';
import { updateLocation } from './location';
import rootSaga from './sagas';

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [thunk, sagaMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  let composeEnhancers = compose;

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-underscore-dangle
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers,
    ),
  );
  store.asyncReducers = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
};
