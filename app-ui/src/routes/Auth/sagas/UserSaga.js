// @flow
import { call, put, take } from 'redux-saga/effects';
import { resetState } from 'modules/StateModule';
import { initializeUser, fetchUser, saveUser, deleteUser } from 'routes/Auth/modules/UserModule';
import { combineSagas } from 'util/Saga';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

export function* fetchUserWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(fetchUser().type);
    try {
      const response = yield call([api, api.user]);
      yield put(saveUser(response.details));
    } catch (e) {
      yield put(deleteUser());
    }

    if (payload && payload.initialize) yield put(initializeUser());
  }
}

export function* deleteUserWorker(): Generator<*, *, *> {
  while (true) {
    yield take(deleteUser().type);
    yield put(resetState([
      // Add here the state keys you would like to reset
    ]));
  }
}

export function* userSaga(api: AuthAPI): Generator<*, *, *> {
  yield combineSagas([
    [fetchUserWorker, api],
    [deleteUserWorker],
  ]);
}

const api = new AuthAPI();
export default [userSaga, api];
