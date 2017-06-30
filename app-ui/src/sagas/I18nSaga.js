// @flow
import { call, put, take } from 'redux-saga/effects';
import {
  initializeCatalog,
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
  saveCatalog,
} from 'modules/I18nModule';
import I18nAPI from 'apis/I18nAPI';

export function* fetchCatalogSaga(api: I18nAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(fetchCatalog().type);
    try {
      yield put(fetchCatalogPending());
      const response = yield call([api, api.fetchCatalog], payload);
      yield put(fetchCatalogFulfilled(response));
      yield put(saveCatalog(response));
      yield put(initializeCatalog());
    } catch (e) {
      yield put(fetchCatalogRejected(e));
    }
  }
}

const api = new I18nAPI();
export default [fetchCatalogSaga, api];
