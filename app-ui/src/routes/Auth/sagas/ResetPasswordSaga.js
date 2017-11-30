// @flow
import Alert from 'react-s-alert';
import { browserHistory } from 'react-router';
import { actions } from 'react-redux-form';
import { call, put, take, all } from 'redux-saga/effects';
import { combineSagas } from 'util/Saga';
import {
  modelPath,
  resetPassword,
  resetPasswordPending,
  resetPasswordFulfilled,
  resetPasswordRejected,
  validatePasswordToken,
} from 'routes/Auth/modules/ResetPasswordModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';
import config from 'config/index';

export function* validatePasswordTokenWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload: { token, cb } } = yield take(validatePasswordToken().type);
    try {
      const response = yield call([api, api.validatePasswordToken], token);
      yield call(cb);
      yield call(Alert.success, response.description);
    } catch (e) {
      yield call(cb, config.route.auth.passwordRecovery);
      yield call(Alert.error, e.response.description);
    }
  }
}

export function* resetPasswordWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload: { token, data } } = yield take(resetPassword().type);
    try {
      yield put(resetPasswordPending());
      const response = yield call([api, api.resetPassword], token, data);
      yield put(resetPasswordFulfilled(response));
      yield put(actions.reset(modelPath));
      yield call(Alert.success, response.description);
      yield call(browserHistory.push, config.route.auth.signIn);
    } catch (e) {
      yield put(resetPasswordRejected(e));
      switch (e.response.code) {
        case 'auth.password.reset.form.invalid': {
          const details = e.response.details || [];
          yield all(details.map(detail => put(actions.setErrors(`${modelPath}.${detail.key}`, detail.message))));
          break;
        }
        case 'auth.password.reset.token.invalid':
          yield call(browserHistory.push, config.route.auth.signIn);
          yield call(Alert.error, e.response.description);
          break;

        default:
          yield call(Alert.error, e.response.description);
      }
    }
  }
}

export function* resetPasswordSaga(api: AuthAPI): Generator<*, *, *> {
  yield all(combineSagas([
    [validatePasswordTokenWorker, api],
    [resetPasswordWorker, api],
  ]));
}

const api = new AuthAPI();
export default [resetPasswordSaga, api];
