import { combineReducers } from 'redux';
import i18nReducer from 'modules/I18nModule';
import authReducer from 'routes/Auth/modules/AuthModule';
import locationReducer from './location';

export const makeRootReducer = asyncReducers => combineReducers({
  location: locationReducer,
  i18n: i18nReducer,
  auth: authReducer,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  const s = store;
  s.asyncReducers[key] = reducer;
  s.replaceReducer(makeRootReducer(s.asyncReducers));
};

export default makeRootReducer;
