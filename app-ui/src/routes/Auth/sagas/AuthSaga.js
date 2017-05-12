import { combineSagas } from 'util/Saga';
import { default as userSaga } from 'routes/Auth/sagas/UserSaga';
import { default as signUpSaga } from 'routes/Auth/sagas/SignUpSaga';
import { default as signInSaga } from 'routes/Auth/sagas/SignInSaga';
import { default as signOutSaga } from 'routes/Auth/sagas/SignOutSaga';
import { default as activateAccountSaga } from 'routes/Auth/sagas/ActivateAccountSaga';
import { default as recoverPasswordSaga } from 'routes/Auth/sagas/RecoverPasswordSaga';
import { default as resetPasswordSaga } from 'routes/Auth/sagas/ResetPasswordSaga';

export default function* authSaga() {
  yield combineSagas([
    userSaga,
    signUpSaga,
    signInSaga,
    signOutSaga,
    activateAccountSaga,
    recoverPasswordSaga,
    resetPasswordSaga,
  ]);
}
