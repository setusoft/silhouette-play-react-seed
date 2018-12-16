import authReducer from 'bundles/Auth/modules/AuthModule';
import {
  formState as signUpFormState,
} from 'bundles/Auth/modules/SignUpModule';
import {
  formState as signInFormState,
} from 'bundles/Auth/modules/SignInModule';
import {
  formState as recoverPasswordFormState,
} from 'bundles/Auth/modules/RecoverPasswordModule';
import {
  formState as resetPasswordFormState,
} from 'bundles/Auth/modules/ResetPasswordModule';
import { initialState as activateAccountInitialState } from 'bundles/Auth/modules/ActivateAccountModule';

describe('(Redux Module) Auth/AuthModule', () => {
  const defaultState = {
    signUp: {
      form: {},
      data: signUpFormState,
    },
    signIn: {
      form: {},
      data: signInFormState,
    },
    recoverPassword: {
      form: {},
      data: recoverPasswordFormState,
    },
    resetPassword: {
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
