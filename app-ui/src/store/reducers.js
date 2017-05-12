import { combineReducers } from 'redux';
import authReducer from 'routes/Auth/modules/AuthModule';
import locationReducer from './location';

export const makeRootReducer = asyncReducers => combineReducers({
  location: locationReducer,
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
