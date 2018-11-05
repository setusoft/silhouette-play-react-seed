import { combineReducers } from 'redux';
import { requestStateReducer } from 'questrar/redux'
import initReducer from 'modules/InitModule';
import locationReducer from 'modules/LocationModule';
import healthReducer from 'modules/HealthModule';
import configReducer from 'modules/ConfigModule';
import i18nReducer from 'modules/I18nModule';
import stateReducer from 'modules/StateModule';
import userReducer from 'modules/UserModule';

// https://github.com/zalmoxisus/redux-devtools-instrument/pull/19#issuecomment-400637274
// https://github.com/reduxjs/redux/issues/2943
const reduxModule = require('redux');

// eslint-disable-next-line no-underscore-dangle
reduxModule.__DO_NOT_USE__ActionTypes.REPLACE = '@@redux/INIT';

export const makeRootReducer = (asyncReducers) => {
  const appReducer = combineReducers({
    init: initReducer,
    location: locationReducer,
    health: healthReducer,
    config: configReducer,
    i18n: i18nReducer,
    user: userReducer,

    ...requestStateReducer,
    ...asyncReducers,
  });

  return (state, action) => appReducer(stateReducer(state, action), action);
};

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  const s = store;
  s.asyncReducers[key] = reducer;
  s.replaceReducer(makeRootReducer(s.asyncReducers));
};

export default makeRootReducer;
