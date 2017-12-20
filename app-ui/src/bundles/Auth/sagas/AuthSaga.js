import { all } from 'redux-saga/effects';
import { combineSagas } from 'util/Saga';
import signUpSagaBinding from 'bundles/Auth/sagas/SignUpSaga';
import signInSagaBinding from 'bundles/Auth/sagas/SignInSaga';
import activateAccountSagaBinding from 'bundles/Auth/sagas/ActivateAccountSaga';
import recoverPasswordSagaBinding from 'bundles/Auth/sagas/RecoverPasswordSaga';
import resetPasswordSagaBinding from 'bundles/Auth/sagas/ResetPasswordSaga';

export default function* authSaga() {
  yield all(combineSagas([
    signUpSagaBinding,
    signInSagaBinding,
    activateAccountSagaBinding,
    recoverPasswordSagaBinding,
    resetPasswordSagaBinding,
  ]));
}
