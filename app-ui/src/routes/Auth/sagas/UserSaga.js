// @flow
import { call, put, take } from 'redux-saga/effects';
import { initializeUser, fetchUser, saveUser, deleteUser } from 'routes/Auth/modules/UserModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

export function* fetchUserSaga(api: AuthAPI): Generator<*, *, *> {
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

const api = new AuthAPI();
export default [fetchUserSaga, api];
