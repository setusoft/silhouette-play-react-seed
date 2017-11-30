// @flow
import Alert from 'react-s-alert';
import { browserHistory } from 'react-router';
import { actions } from 'react-redux-form';
import { call, put, take, all } from 'redux-saga/effects';
import { saveUser } from 'routes/Auth/modules/UserModule';
import { saveActivationEmail } from 'routes/Auth/modules/ActivateAccountModule';
import {
  modelPath,
  signIn,
  signInPending,
  signInFulfilled,
  signInRejected,
} from 'routes/Auth/modules/SignInModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';
import config from 'config/index';

export function* signInSaga(api: AuthAPI): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(signIn().type);
    try {
      yield put(signInPending());
      const response = yield call([api, api.signIn], payload);
      yield put(signInFulfilled(response));
      yield put(saveUser(response.details));
      yield put(actions.reset(modelPath));
      yield call(browserHistory.push, config.route.index);
    } catch (e) {
      yield put(signInRejected(e));
      switch (e.response.code) {
        case 'auth.signIn.form.invalid': {
          const details = e.response.details || [];
          yield all(details.map(detail => put(actions.setErrors(`${modelPath}.${detail.key}`, detail.message))));
          break;
        }

        case 'auth.signIn.account.inactive':
          yield put(saveActivationEmail(e.response.details.email));
          yield call(browserHistory.push, config.route.auth.accountActivation);
          break;

        default:
          yield call(Alert.error, e.response.description);
          break;
      }
    }
  }
}

const api = new AuthAPI();
export default [signInSaga, api];
