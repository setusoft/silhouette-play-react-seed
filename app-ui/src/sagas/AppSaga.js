// @flow
import { all, put, take } from 'redux-saga/effects';
import { initApp } from 'modules/AppModule';
import { fetchUser } from 'modules/UserModule';
import { combineSagas } from 'util/Saga';

export function* initAppWorker(): Generator<*, *, *> {
  while (yield take(initApp().type)) {
    yield put(fetchUser());
  }
}

export function* appSaga(): Generator<*, *, *> {
  yield all(combineSagas([
    [initAppWorker],
  ]));
}

export default [appSaga];
