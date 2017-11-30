// @flow
import Alert from 'react-s-alert';
import { browserHistory } from 'react-router';
import { actions } from 'react-redux-form';
import { call, put, take, all } from 'redux-saga/effects';
import {
  modelPath,
  recoverPassword,
  recoverPasswordPending,
  recoverPasswordFulfilled,
  recoverPasswordRejected,
} from 'routes/Auth/modules/RecoverPasswordModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';
import config from 'config/index';

export function* recoverPasswordSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(recoverPassword().type);
    try {
      yield put(recoverPasswordPending());
      const response = yield call([api, api.recoverPassword], payload);
      yield put(recoverPasswordFulfilled(response));
      yield put(actions.reset(modelPath));
      yield call(Alert.success, response.description, { timeout: 30000 });
      yield call(browserHistory.push, config.route.auth.signIn);
    } catch (e) {
      yield put(recoverPasswordRejected(e));
      if (e.response.code === 'auth.password.recover.form.invalid') {
        const details = e.response.details || [];
        yield all(details.map(detail => put(actions.setErrors(`${modelPath}.${detail.key}`, detail.message))));
      } else {
        yield call(Alert.error, e.response.description);
      }
    }
  }
}

const api = new AuthAPI();
export default [recoverPasswordSaga, api];
