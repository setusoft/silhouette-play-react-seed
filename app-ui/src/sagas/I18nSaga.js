// @flow
import { all, call, put, take } from 'redux-saga/effects';
import { combineSagas, handleError } from 'util/Saga';
import {
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
} from 'modules/I18nModule';
import I18nAPI from 'apis/I18nAPI';

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
    [fetchCatalogWorker, api],
  ]));
}

const api = new I18nAPI();
export default [i18nSaga, api];
