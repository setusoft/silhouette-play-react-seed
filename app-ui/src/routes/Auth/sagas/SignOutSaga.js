// @flow
import Alert from 'react-s-alert';
import { browserHistory } from 'react-router';
import { call, put, take } from 'redux-saga/effects';
import { deleteUser, resetUserState } from 'routes/Auth/modules/UserModule';
import { signOut } from 'routes/Auth/modules/SignOutModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';
import config from 'config/index';

export function* signOutSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    yield take(signOut().type);
    try {
      yield call([api, api.signOut]);
      yield put(deleteUser());
      yield put(resetUserState());
      yield call(browserHistory.push, config.route.auth.signIn);
    } catch (e) {
      switch (e.response.code) {
        case 'auth.unauthorized': {
          yield put(deleteUser());
          yield put(resetUserState());
          yield call(browserHistory.push, config.route.auth.signIn);
          break;
        }

        default:
          yield call(Alert.error, e.response.description);
          break;
      }
    }
  }
}

const api = new AuthAPI();
export default [signOutSaga, api];
