// @flow
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { call, put, take } from 'redux-saga/effects';
import { handleError, formErrorHandler } from 'util/Saga';
import {
  modelPath,
  signUp,
  signUpPending,
  signUpFulfilled,
  signUpRejected,
} from 'bundles/Auth/modules/SignUpModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';
import { requestPending, requestSuccessful, requestFailed } from "modules/RequestStateModule";

export function* signUpSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(signUp().type);
    const rId = signUp().type;
    try {
      yield put(requestPending(rId));
      const response = yield call([api, api.signUp], payload);
      yield put(requestSuccessful({ rId, description: response.details }));
      yield put(actions.reset(modelPath));
      yield call(Alert.success, response.description, { timeout: 30000 });
    } catch (e) {
      yield put(requestFailed({ rId, description: e.response.details }));
      yield call(handleError, e, {
        'auth.signUp.form.invalid': formErrorHandler(modelPath),
      });
    }
  }
}

const api = new AuthAPI();
export default [signUpSaga, api];
