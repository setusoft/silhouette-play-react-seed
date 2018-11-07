// @flow
import { actions } from 'react-redux-form';
import { call, put, take } from 'redux-saga/effects';
import { handleError, formErrorHandler } from 'util/Saga';
import {
  modelPath,
  signUp,
  signUpRequest,
} from 'bundles/Auth/modules/SignUpModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

export function* signUpSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(signUp().type);
    try {
      yield put(signUpRequest.pending());
      const response = yield call([api, api.signUp], payload);
      yield put(signUpRequest.success(response.description));
      yield put(actions.reset(modelPath));
    } catch (e) {
      yield put(signUpRequest.failed());
      yield call(handleError, e, {
        'auth.signUp.form.invalid': formErrorHandler(modelPath),
      });
    }
  }
}

const api = new AuthAPI();
export default [signUpSaga, api];
