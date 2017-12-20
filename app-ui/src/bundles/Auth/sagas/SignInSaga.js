// @flow
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { call, put, take, all } from 'redux-saga/effects';
import { history } from 'modules/LocationModule';
import { saveUser } from 'modules/UserModule';
import { saveActivationEmail } from 'bundles/Auth/modules/ActivateAccountModule';
import {
  modelPath,
  signIn,
  signInPending,
  signInFulfilled,
  signInRejected,
} from 'bundles/Auth/modules/SignInModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';
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
      yield call(history.push, config.route.index);
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
          yield call(history.push, config.route.auth.accountActivation);
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
