import { combineSagas } from 'util/Saga';
import authSaga from 'routes/Auth/sagas/AuthSaga';
import { sagaMiddleware } from './middleware';

export function* rootSaga() {
  yield combineSagas([
    authSaga,
  ]);
}

export const injectSaga = (store, { key, saga }) => {
  if (Object.hasOwnProperty.call(store.asyncSagas, key)) return;

  const s = store;
  s.asyncSagas[key] = saga;
  sagaMiddleware.run(s.asyncSagas[key]);
};
