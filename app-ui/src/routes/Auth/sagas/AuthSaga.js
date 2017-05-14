import { combineSagas } from 'util/Saga';
import userSagaBinding from 'routes/Auth/sagas/UserSaga';
import signUpSagaBinding from 'routes/Auth/sagas/SignUpSaga';
import signInSagaBinding from 'routes/Auth/sagas/SignInSaga';
import signOutSagaBinding from 'routes/Auth/sagas/SignOutSaga';
import activateAccountSagaBinding from 'routes/Auth/sagas/ActivateAccountSaga';
import recoverPasswordSagaBinding from 'routes/Auth/sagas/RecoverPasswordSaga';
import resetPasswordSagaBinding from 'routes/Auth/sagas/ResetPasswordSaga';

export default function* authSaga() {
  yield combineSagas([
    userSagaBinding,
    signUpSagaBinding,
    signInSagaBinding,
    signOutSagaBinding,
    activateAccountSagaBinding,
    recoverPasswordSagaBinding,
    resetPasswordSagaBinding,
  ]);
}
