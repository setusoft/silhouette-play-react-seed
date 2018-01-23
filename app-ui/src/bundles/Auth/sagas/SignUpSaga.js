// @flow
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { call, put, take, all } from 'redux-saga/effects';
import { handleError, formErrorHandler } from 'util/Saga';
import {
  modelPath,
  signUp,
  signUpPending,
  signUpFulfilled,
  signUpRejected,
} from 'bundles/Auth/modules/SignUpModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

export function* signUpSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(signUp().type);
    try {
      yield put(signUpPending());
      const response = yield call([api, api.signUp], payload);
      yield put(signUpFulfilled(response));
      yield put(actions.reset(modelPath));
      yield call(Alert.success, response.description, { timeout: 30000 });
    } catch (e) {
      yield put(signUpRejected(e));
      yield all(handleError(e, {
        'auth.signUp.form.invalid': formErrorHandler(modelPath),
      }));
    }
  }
}

const api = new AuthAPI();
export default [signUpSaga, api];
