import authReducer from 'bundles/Auth/modules/AuthModule';
import {
  requestState as signUpRequestState,
  formState as signUpFormState,
} from 'bundles/Auth/modules/SignUpModule';
import {
  requestState as signInRequestState,
  formState as signInFormState,
} from 'bundles/Auth/modules/SignInModule';
import {
  requestState as recoverPasswordRequestState,
  formState as recoverPasswordFormState,
} from 'bundles/Auth/modules/RecoverPasswordModule';
import {
  requestState as resetPasswordRequestState,
  formState as resetPasswordFormState,
} from 'bundles/Auth/modules/ResetPasswordModule';
import { initialState as activateAccountInitialState } from 'bundles/Auth/modules/ActivateAccountModule';

describe('(Redux Module) Auth/AuthModule', () => {
  const defaultState = {
    signUp: {
      request: signUpRequestState,
      form: {},
      data: signUpFormState,
    },
    signIn: {
      request: signInRequestState,
      form: {},
      data: signInFormState,
    },
    recoverPassword: {
      request: recoverPasswordRequestState,
      form: {},
      data: recoverPasswordFormState,
    },
    resetPassword: {
      request: resetPasswordRequestState,
      form: {},
      data: resetPasswordFormState,
    },
    activateAccount: activateAccountInitialState,
  };

  describe('(Reducer)', () => {
    it('Should be a function', () => {
      expect(authReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(authReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(defaultState);
    });
  });
});
