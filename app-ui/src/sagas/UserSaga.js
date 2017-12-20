// @flow
import Alert from 'react-s-alert';
import { call, put, take, all } from 'redux-saga/effects';
import { initApp } from 'modules/AppModule';
import { history } from 'modules/LocationModule';
import { resetState } from 'modules/StateModule';
import { initUser, fetchUser, saveUser, deleteUser, signOutUser, resetUserState } from 'modules/UserModule';
import { combineSagas } from 'util/Saga';
import UserAPI from 'apis/UserAPI';
import config from 'config/index';

export function* fetchUserTask(api: UserAPI): Generator<*, *, *> {
  try {
    const response = yield call([api, api.get]);
    yield put(saveUser(response.details));
  } catch (e) {
    yield put(deleteUser());
    yield put(resetUserState());
  }
}

export function* initUserWorker(api: UserAPI): Generator<*, *, *> {
  while (yield take(initApp().type)) {
    yield call(fetchUserTask, api);
    yield put(initUser());
  }
}

export function* fetchUserWorker(api: UserAPI): Generator<*, *, *> {
  while (yield take(fetchUser().type)) {
    yield call(fetchUserTask, api);
  }
}

export function* signOutUserWorker(api: UserAPI): Generator<*, *, *> {
  while (yield take(signOutUser().type)) {
    try {
      yield call([api, api.signOut]);
      yield put(deleteUser());
      yield put(resetUserState());
      yield call(history.push, config.route.auth.signIn);
    } catch (e) {
      switch (e.response.code) {
        case 'auth.unauthorized': {
          yield put(deleteUser());
          yield put(resetUserState());
          yield call(history.push, config.route.auth.signIn);
          break;
        }

        default:
          yield call(Alert.error, e.response.description);
          break;
      }
    }
  }
}

export function* resetUserStateWorker(): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(resetUserState().type);
    yield put(resetState(payload));
  }
}

export function* userSaga(api: UserAPI): Generator<*, *, *> {
  yield all(combineSagas([
    [initUserWorker, api],
    [fetchUserWorker, api],
    [signOutUserWorker, api],
    [resetUserStateWorker],
  ]));
}

const api = new UserAPI();
export default [userSaga, api];
