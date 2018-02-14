// @flow
import { all, put, take } from 'redux-saga/effects';
import { initApp, setInitialized } from 'modules/InitModule';
import { fetchUser, fetchUserFulfilled, fetchUserRejected } from 'modules/UserModule';
import { fetchCatalogFulfilled } from 'modules/I18nModule';
import { combineSagas } from 'util/Saga';

export function* initAppWorker(): Generator<*, *, *> {
  while (yield take(initApp().type)) {
    yield put(fetchUser());
  }
}

export function* initUserWorker(): Generator<*, *, *> {
  while (yield take([fetchUserFulfilled().type, fetchUserRejected().type])) {
    yield put(setInitialized('user'));
  }
}

export function* initI18nWorker(): Generator<*, *, *> {
  while (yield take(fetchCatalogFulfilled().type)) {
    yield put(setInitialized('i18n'));
  }
}

export function* initSaga(): Generator<*, *, *> {
  yield all(combineSagas([
    [initAppWorker],
    [initUserWorker],
    [initI18nWorker],
  ]));
}

export default [initSaga];
