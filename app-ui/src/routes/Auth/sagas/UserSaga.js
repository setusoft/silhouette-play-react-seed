// @flow
import { call, put, take } from 'redux-saga/effects';
import { initApp } from 'modules/AppModule';
import { resetState } from 'modules/StateModule';
import { initUser, fetchUser, saveUser, deleteUser, resetUserState } from 'routes/Auth/modules/UserModule';
import { combineSagas } from 'util/Saga';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

export function* initUserWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    yield take(initApp().type);
    try {
      const response = yield call([api, api.user]);
      yield put(initUser(response.details));
    } catch (e) {
      yield put(initUser());
      yield put(resetUserState());
    }
  }
}

export function* fetchUserWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    yield take(fetchUser().type);
    try {
      const response = yield call([api, api.user]);
      yield put(saveUser(response.details));
    } catch (e) {
      yield put(deleteUser());
      yield put(resetUserState());
    }
  }
}

export function* resetUserStateWorker(): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(resetUserState().type);
    yield put(resetState(payload));
  }
}

export function* userSaga(api: AuthAPI): Generator<*, *, *> {
  yield combineSagas([
    [initUserWorker, api],
    [fetchUserWorker, api],
    [resetUserStateWorker],
  ]);
}

const api = new AuthAPI();
export default [userSaga, api];
