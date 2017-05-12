// @flow
import Alert from 'react-s-alert';
import { browserHistory } from 'react-router';
import { combineSagas } from 'util/Saga';
import { call, put, take } from 'redux-saga/effects';
import {
  activateAccount,
  sendActivationEmail,
  sendActivationEmailPending,
  sendActivationEmailFulfilled,
  sendActivationEmailRejected,
} from 'routes/Auth/modules/ActivateAccountModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';
import config from 'config/index';

export function* activateAccountWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload: { token, cb } } = yield take(activateAccount().type);
    try {
      const response = yield call([api, api.activateAccount], token);
      yield call(cb, config.route.auth.signIn);
      yield call(Alert.success, response.description);
    } catch (e) {
      yield call(cb, config.route.auth.signIn);
      yield call(Alert.error, e.response.description);
    }
  }
}

export function* sendActivationEmailWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(sendActivationEmail().type);
    try {
      yield put(sendActivationEmailPending());
      const response = yield call([api, api.sendActivationMail], payload);
      yield put(sendActivationEmailFulfilled(response));
      yield call(Alert.success, response.description, { timeout: 30000 });
      yield call(browserHistory.push, config.route.auth.signIn);
    } catch (e) {
      yield put(sendActivationEmailRejected(e));
      yield call(Alert.error, e.response.description);
    }
  }
}

export function* activateAccountSaga(api: AuthAPI): Generator<*, *, *> {
  yield combineSagas([
    [activateAccountWorker, api],
    [sendActivationEmailWorker, api],
  ]);
}

const api = new AuthAPI();
export default [activateAccountSaga, api];
