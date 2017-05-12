// @flow
import { call, put, take } from 'redux-saga/effects';
import { fetchUser, saveUser, deleteUser } from 'routes/Auth/modules/UserModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

export function* fetchUserSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    yield take(fetchUser().type);
    try {
      const response = yield call([api, api.user]);
      yield put(saveUser(response.details));
    } catch (e) {
      yield put(deleteUser());
    }
  }
}

const api = new AuthAPI();
export default [fetchUserSaga, api];
