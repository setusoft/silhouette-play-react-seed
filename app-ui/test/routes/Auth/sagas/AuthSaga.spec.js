import { expectSaga } from 'redux-saga-test-plan';
import authSaga from 'routes/Auth/sagas/AuthSaga';
import userSagaBinding from 'routes/Auth/sagas/UserSaga';
import signUpSagaBinding from 'routes/Auth/sagas/SignUpSaga';
import signInSagaBinding from 'routes/Auth/sagas/SignInSaga';
import signOutSagaBinding from 'routes/Auth/sagas/SignOutSaga';
import activateAccountSagaBinding from 'routes/Auth/sagas/ActivateAccountSaga';
import recoverPasswordSagaBinding from 'routes/Auth/sagas/RecoverPasswordSaga';
import resetPasswordSagaBinding from 'routes/Auth/sagas/ResetPasswordSaga';

describe('(Saga) Auth/AuthSaga', () => {
  describe('(Generator) authSaga', () => {
    it('Should spawn all Auth sagas', () =>
      expectSaga(authSaga)
        .spawn(...userSagaBinding)
        .spawn(...signUpSagaBinding)
        .spawn(...signInSagaBinding)
        .spawn(...signOutSagaBinding)
        .spawn(...activateAccountSagaBinding)
        .spawn(...recoverPasswordSagaBinding)
        .spawn(...resetPasswordSagaBinding)
        .run({ silenceTimeout: true }),
    );
  });
});
