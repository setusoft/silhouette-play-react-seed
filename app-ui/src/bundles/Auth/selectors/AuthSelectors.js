
export const requestButtonProps = (formInvalid) => (r) => ({
  disabled: formInvalid || r.data.pending,
  loading: r.data.pending
});


export const getActivateAccountEmail = (state) => state.auth.activateAccount;

export const getSignInForm = state => state.auth.signIn.form;

export const getSignUpForm = state => state.auth.signUp.form;

export const getResetToken = (ownProps) => ownProps.match.params.token;

export const getResetPasswordForm = (state) => state.auth.resetPassword.form;

export const getRecoverPasswordForm = state => state.auth.recoverPassword.form;
