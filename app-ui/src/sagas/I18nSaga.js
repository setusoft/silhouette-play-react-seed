// @flow
import { call, put, take } from 'redux-saga/effects';
import {
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
} from 'modules/I18nModule';
import I18nAPI from 'apis/I18nAPI';

export function* fetchCatalogSaga(api: I18nAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(fetchCatalog().type);
    try {
      yield put(fetchCatalogPending());
      const catalog = yield call([api, api.fetchCatalog], payload);
      yield put(fetchCatalogFulfilled(catalog));
    } catch (e) {
      yield put(fetchCatalogRejected(e));
    }
  }
}

const api = new I18nAPI();
export default [fetchCatalogSaga, api];
