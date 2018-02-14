import { all } from 'redux-saga/effects';
import { combineSagas } from 'util/Saga';
import initSagaBinding from 'sagas/InitSaga';
import i18nSagaBinding from 'sagas/I18nSaga';
import userSagaBinding from 'sagas/UserSaga';
import { sagaMiddleware } from './middleware';

export function* rootSaga() {
  yield all(combineSagas([
    initSagaBinding,
    i18nSagaBinding,
    userSagaBinding,
  ]));
}

export const injectSaga = (store, { key, saga }) => {
  if (Object.hasOwnProperty.call(store.asyncSagas, key)) return;

  const s = store;
  s.asyncSagas[key] = saga;
  sagaMiddleware.run(s.asyncSagas[key]);
};
