import { expectSaga } from 'redux-saga-test-plan';
import authSaga from 'routes/Auth/sagas/AuthSaga';
import { default as userSaga } from 'routes/Auth/sagas/UserSaga';
import { default as signUpSaga } from 'routes/Auth/sagas/SignUpSaga';
import { default as signInSaga } from 'routes/Auth/sagas/SignInSaga';
import { default as signOutSaga } from 'routes/Auth/sagas/SignOutSaga';
import { default as activateAccountSaga } from 'routes/Auth/sagas/ActivateAccountSaga';
import { default as recoverPasswordSaga } from 'routes/Auth/sagas/RecoverPasswordSaga';
import { default as resetPasswordSaga } from 'routes/Auth/sagas/ResetPasswordSaga';

describe('(Saga) Auth/AuthSaga', () => {
  describe('(Generator) authSaga', () => {
    it('Should spawn all Auth sagas', () =>
      expectSaga(authSaga)
        .spawn(...userSaga)
        .spawn(...signUpSaga)
        .spawn(...signInSaga)
        .spawn(...signOutSaga)
        .spawn(...activateAccountSaga)
        .spawn(...recoverPasswordSaga)
        .spawn(...resetPasswordSaga)
        .run({ silenceTimeout: true })
    );
  });
});
