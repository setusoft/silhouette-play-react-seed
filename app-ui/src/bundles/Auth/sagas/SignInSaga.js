// @flow
import { actions } from 'react-redux-form';
import { call, put, take } from 'redux-saga/effects';
import { handleError, formErrorHandler } from 'util/Saga';
import { history } from 'modules/LocationModule';
import { fetchUserFulfilled } from 'modules/UserModule';
import { saveActivationEmail } from 'bundles/Auth/modules/ActivateAccountModule';
import {
  modelPath,
  signIn,
  signInRequest,
} from 'bundles/Auth/modules/SignInModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';
import config from 'config/index';
import { APIError } from '../../../util/API';

export function* signInSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(signIn().type);
    try {
      yield put(signInRequest.pending());
      const response = yield call([api, api.signIn], payload);
      yield put(signInRequest.success());
      yield put(fetchUserFulfilled(response.details));
      yield put(actions.reset(modelPath));
      yield call(history.push, config.route.index);
    } catch (e) {
      yield put(signInRequest.failed());
      yield call(handleError, e, {
        'auth.signIn.form.invalid': formErrorHandler(modelPath),
        'auth.signIn.credentials': (error: APIError) => ([
          put(signInRequest.failed(error.response.description)),
        ]),
        'auth.signIn.account.inactive': (error: APIError) => ([
          put(saveActivationEmail(error.response.details.email)),
          call(history.push, config.route.auth.accountActivation),
        ]),
      });
    }
  }
}

const api = new AuthAPI();
export default [signInSaga, api];
