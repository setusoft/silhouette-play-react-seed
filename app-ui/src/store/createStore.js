import { applyMiddleware, compose, createStore } from 'redux';
import { history, updateLocation } from 'modules/LocationModule';
import { middleware, sagaMiddleware } from './middleware';
import { makeRootReducer } from './reducers';
import { rootSaga } from './sagas';

export default (initialState = {}) => {
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
  store.asyncSagas = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = history.listen(updateLocation(store));

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
