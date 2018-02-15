// @flow
import { delay } from 'redux-saga';
import { call, put, take, race, all } from 'redux-saga/effects';
import { history } from 'modules/LocationModule';
import { resetState } from 'modules/StateModule';
import {
  fetchUser,
  fetchUserPending,
  fetchUserFulfilled,
  fetchUserRejected,
  signOutUser,
  resetUserState,
} from 'modules/UserModule';
import { combineSagas, handleError } from 'util/Saga';
import UserAPI from 'apis/UserAPI';
import config from 'config/index';

export function* fetchUserWorker(api: UserAPI): Generator<*, *, *> {
  while (yield take(fetchUser().type)) {
    try {
      yield put(fetchUserPending());
      const response = yield call([api, api.get]);
      const user = response.details;
      yield put(fetchUserFulfilled(user));
    } catch (e) {
      yield put(resetUserState());
      yield put(fetchUserRejected(e));
    }
  }
}

export function* fetchUserPeriodicallyWorker(duration: number): Generator<*, *, *> {
  while (yield take(fetchUserFulfilled().type)) {
    while (true) {
      const { stop } = yield race({
        stop: take(resetUserState().type),
        tick: call(delay, duration),
      });

      if (stop) {
        break;
      }

      yield put(fetchUser());
    }
  }
}

export function* signOutUserWorker(api: UserAPI): Generator<*, *, *> {
  while (yield take(signOutUser().type)) {
    try {
      yield call([api, api.signOut]);
      yield put(resetUserState());
      yield call(history.push, config.route.auth.signIn);
    } catch (e) {
      yield all(handleError(e, {
        'auth.unauthorized': () => ([
          put(resetUserState()),
          call(history.push, config.route.auth.signIn),
        ]),
      }));
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
    [fetchUserWorker, api],
    [fetchUserPeriodicallyWorker, 5 * 60 * 1000],
    [signOutUserWorker, api],
    [resetUserStateWorker],
  ]));
}

const api = new UserAPI();
export default [userSaga, api];
