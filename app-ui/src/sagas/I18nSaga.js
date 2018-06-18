// @flow
import { all, call, put, take, fork, cancel } from 'redux-saga/effects';
import { combineSagas, handleError } from 'util/Saga';
import { initApp, setI18nInitialized } from 'modules/InitModule';
import {
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
} from 'modules/I18nModule';
import I18nAPI from 'apis/I18nAPI';

export function* initI18nWorker(): Generator<*, *, *> {
  while (yield take(fetchCatalogFulfilled().type)) {
    yield put(setI18nInitialized());
  }
}

export function* initAppWorker(): Generator<*, *, *> {
  const task = yield fork(initI18nWorker);
  yield take(initApp().type);
  yield take(setI18nInitialized);
  yield cancel(task);
}

export function* fetchCatalogWorker(api: I18nAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(fetchCatalog().type);
    try {
      yield put(fetchCatalogPending());
      const catalog = yield call([api, api.fetchCatalog], payload);
      yield put(fetchCatalogFulfilled(catalog));
    } catch (e) {
      yield put(fetchCatalogRejected(e));
      yield call(handleError, e);
    }
  }
}

export function* i18nSaga(api: I18nAPI): Generator<*, *, *> {
  yield all(combineSagas([
    initAppWorker,
    [fetchCatalogWorker, api],
  ]));
}

const api = new I18nAPI();
export default [i18nSaga, api];
