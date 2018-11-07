// @flow
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import {
  call, put, take, all,
} from 'redux-saga/effects';
import { combineSagas, handleError, formErrorHandler } from 'util/Saga';
import { APIError } from 'util/API';
import { history } from 'modules/LocationModule';
import {
  modelPath,
  resetPassword,
  resetPasswordRequest,
  validatePasswordToken,
} from 'bundles/Auth/modules/ResetPasswordModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';
import config from 'config/index';

export function* validatePasswordTokenWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(validatePasswordToken().type);
    try {
      const response = yield call([api, api.validatePasswordToken], payload);
      yield call(Alert.success, response.description);
    } catch (e) {
      yield call(history.push, config.route.auth.passwordRecovery);
      yield call(handleError, e);
    }
  }
}

export function* resetPasswordWorker(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload: { token, data } } = yield take(resetPassword().type);
    try {
      yield put(resetPasswordRequest.pending());
      const response = yield call([api, api.resetPassword], token, data);
      yield put(resetPasswordRequest.success());
      yield put(actions.reset(modelPath));
      yield call(Alert.success, response.description);
      yield call(history.push, config.route.auth.signIn);
    } catch (e) {
      yield put(resetPasswordRequest.failed());
      yield call(handleError, e, {
        'auth.password.reset.form.invalid': formErrorHandler(modelPath),
        'auth.password.reset.token.invalid': (error: APIError) => ([
          put(resetPasswordRequest.failed(error.response.description)),
        ]),
      });
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
