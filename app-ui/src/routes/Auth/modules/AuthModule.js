import { combineReducers } from 'redux';
import userReducer from 'routes/Auth/modules/UserModule';
import signUpReducer from 'routes/Auth/modules/SignUpModule';
import signInReducer from 'routes/Auth/modules/SignInModule';
import recoverPasswordReducer from 'routes/Auth/modules/RecoverPasswordModule';
import resetPasswordReducer from 'routes/Auth/modules/ResetPasswordModule';
import activateAccountReducer from 'routes/Auth/modules/ActivateAccountModule';

export default combineReducers({
  user: userReducer,
  signUp: signUpReducer,
  signIn: signInReducer,
  recoverPassword: recoverPasswordReducer,
  resetPassword: resetPasswordReducer,
  activateAccount: activateAccountReducer,
});
