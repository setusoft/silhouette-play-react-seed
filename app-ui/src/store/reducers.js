import { combineReducers } from 'redux';
import initReducer from 'modules/InitModule';
import locationReducer from 'modules/LocationModule';
import i18nReducer from 'modules/I18nModule';
import stateReducer from 'modules/StateModule';
import userReducer from 'modules/UserModule';

export const makeRootReducer = (asyncReducers) => {
  const appReducer = combineReducers({
    init: initReducer,
    location: locationReducer,
    i18n: i18nReducer,
    user: userReducer,
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
