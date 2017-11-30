// @flow
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { call, put, take, all } from 'redux-saga/effects';
import {
  modelPath,
  signUp,
  signUpPending,
  signUpFulfilled,
  signUpRejected,
} from 'routes/Auth/modules/SignUpModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

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
      if (e.response.code === 'auth.signUp.form.invalid') {
        const details = e.response.details || [];
        yield all(details.map(detail => put(actions.setErrors(`${modelPath}.${detail.key}`, detail.message))));
      } else {
        yield call(Alert.error, e.response.description);
      }
    }
  }
}

const api = new AuthAPI();
export default [signUpSaga, api];
