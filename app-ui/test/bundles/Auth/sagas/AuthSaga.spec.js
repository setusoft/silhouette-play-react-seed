import { expectSaga } from 'redux-saga-test-plan';
import authSaga from 'bundles/Auth/sagas/AuthSaga';
import signUpSagaBinding from 'bundles/Auth/sagas/SignUpSaga';
import signInSagaBinding from 'bundles/Auth/sagas/SignInSaga';
import activateAccountSagaBinding from 'bundles/Auth/sagas/ActivateAccountSaga';
import recoverPasswordSagaBinding from 'bundles/Auth/sagas/RecoverPasswordSaga';
import resetPasswordSagaBinding from 'bundles/Auth/sagas/ResetPasswordSaga';

describe('(Saga) Auth/AuthSaga', () => {
  describe('(Generator) authSaga', () => {
    it('Should spawn all Auth sagas', () =>
      expectSaga(authSaga)
        .spawn(...signUpSagaBinding)
        .spawn(...signInSagaBinding)
        .spawn(...activateAccountSagaBinding)
        .spawn(...recoverPasswordSagaBinding)
        .spawn(...resetPasswordSagaBinding)
        .run({ silenceTimeout: true }));
  });
});
