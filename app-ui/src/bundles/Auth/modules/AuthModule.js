import { combineReducers } from 'redux';
import signUpReducer from 'bundles/Auth/modules/SignUpModule';
import signInReducer from 'bundles/Auth/modules/SignInModule';
import recoverPasswordReducer from 'bundles/Auth/modules/RecoverPasswordModule';
import resetPasswordReducer from 'bundles/Auth/modules/ResetPasswordModule';
import activateAccountReducer from 'bundles/Auth/modules/ActivateAccountModule';

export default combineReducers({
  signUp: signUpReducer,
  signIn: signInReducer,
  recoverPassword: recoverPasswordReducer,
  resetPassword: resetPasswordReducer,
  activateAccount: activateAccountReducer,
});
