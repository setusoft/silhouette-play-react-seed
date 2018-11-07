
//  Map Request state to Button props;
export const requestButtonProps = formInvalid => r => ({
  disabled: formInvalid || r.data.pending,
  loading: r.data.pending,
});

// Get activate account data from state
export const getActivateAccountEmail = state => state.auth.activateAccount;

//  Get SignIn form data from state
export const getSignInForm = state => state.auth.signIn.form;

//  Get SignUp form from state
export const getSignUpForm = state => state.auth.signUp.form;

//  Get validation token from url in props
export const getResetToken = ownProps => ownProps.match.params.token;

//  Get ResetPassword form from state
export const getResetPasswordForm = state => state.auth.resetPassword.form;

//  Get RecoverPassword form from state
export const getRecoverPasswordForm = state => state.auth.recoverPassword.form;
