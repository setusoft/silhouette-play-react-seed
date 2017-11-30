import { all } from 'redux-saga/effects';
import { combineSagas } from 'util/Saga';
import i18nSaga from 'sagas/I18nSaga';
import authSaga from 'routes/Auth/sagas/AuthSaga';
import { sagaMiddleware } from './middleware';

export function* rootSaga() {
  yield all(combineSagas([
    i18nSaga,
    authSaga,
  ]));
}

export const injectSaga = (store, { key, saga }) => {
  if (Object.hasOwnProperty.call(store.asyncSagas, key)) return;

  const s = store;
  s.asyncSagas[key] = saga;
  sagaMiddleware.run(s.asyncSagas[key]);
};
