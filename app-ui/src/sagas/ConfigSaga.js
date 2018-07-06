// @flow
import {
  call, put, take, all,
} from 'redux-saga/effects';
import {
  fetchConfig,
  fetchConfigPending,
  fetchConfigFulfilled,
  fetchConfigRejected,
} from 'modules/ConfigModule';
import { combineSagas, handleError } from 'util/Saga';
import ConfigAPI from 'apis/ConfigAPI';

export function* fetchConfigWorker(api: ConfigAPI): Generator<*, *, *> {
  while (yield take(fetchConfig().type)) {
    try {
      yield put(fetchConfigPending());
      const response = yield call([api, api.get]);
      yield put(fetchConfigFulfilled(response.details));
    } catch (e) {
      yield put(fetchConfigRejected(e));
      yield call(handleError, e);
    }
  }
}

export function* configSaga(api: ConfigAPI): Generator<*, *, *> {
  yield all(combineSagas([
    [fetchConfigWorker, api],
  ]));
}

const api = new ConfigAPI();
export default [configSaga, api];
