// @flow
import { actions } from 'react-redux-form';
import { call, put, take } from 'redux-saga/effects';
import { handleError, formErrorHandler } from 'util/Saga';
import {
  modelPath,
  recoverPassword,
  recoverPasswordRequest,
} from 'bundles/Auth/modules/RecoverPasswordModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

export function* recoverPasswordSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(recoverPassword().type);
    try {
      yield put(recoverPasswordRequest.pending());
      const response = yield call([api, api.recoverPassword], payload);
      yield put(recoverPasswordRequest.success(response.description));
      yield put(actions.reset(modelPath));
    } catch (e) {
      yield put(recoverPasswordRequest.failed());
      yield call(handleError, e, {
        'auth.password.recover.form.invalid': formErrorHandler(modelPath),
      });
    }
  }
}

const api = new AuthAPI();
export default [recoverPasswordSaga, api];
