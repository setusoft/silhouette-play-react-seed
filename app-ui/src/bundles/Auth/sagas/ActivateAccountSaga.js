// @flow
import Alert from 'react-s-alert';
import { combineSagas } from 'util/Saga';
import { call, put, take, all } from 'redux-saga/effects';
import { history } from 'modules/LocationModule';
import {
  activateAccount,
  sendActivationEmail,
  sendActivationEmailPending,
  sendActivationEmailFulfilled,
  sendActivationEmailRejected,
} from 'bundles/Auth/modules/ActivateAccountModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';
import config from 'config/index';

export function* activateAccountWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(activateAccount().type);
    try {
      const response = yield call([api, api.activateAccount], payload);
      yield call(history.push, config.route.auth.signIn);
      yield call(Alert.success, response.description);
    } catch (e) {
      yield call(history.push, config.route.auth.signIn);
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
      yield call(history.push, config.route.auth.signIn);
    } catch (e) {
      yield put(sendActivationEmailRejected(e));
      yield call(Alert.error, e.response.description);
    }
  }
}

export function* activateAccountSaga(api: AuthAPI): Generator<*, *, *> {
  yield all(combineSagas([
    [activateAccountWorker, api],
    [sendActivationEmailWorker, api],
  ]));
}

const api = new AuthAPI();
export default [activateAccountSaga, api];
