
/**
 * Map Request state to form submit Button props
 * @param formValid Form valid status
 * @param request Request state
 * @returns Button props
 */
export const requestButtonProps = (formValid = true) => request => ({
  disabled: !formValid || request.data.pending,
  loading: request.data.pending,
});

/**
 * Extracts account activation data from redux state
 * @param state
 * @returns {{email: string}|activateAccount|{email}|AuthAPI.activateAccount}
 */
export const getActivateAccountEmail = state => state.auth.activateAccount;

/**
 * Extracts SignIn form data from redux state
 * @param state
 * @returns {{param: string}|form|{param}|{}}
 */
export const getSignInForm = state => state.auth.signIn.form;

/**
 * Extracts SignUp form data from redux state
 * @param state
 * @returns {{param: string}|form|{param}|{}}
 */
export const getSignUpForm = state => state.auth.signUp.form;

/**
 * Extracts account validation token from url props
 * @param ownProps
 * @returns {*}
 */
export const getResetToken = ownProps => ownProps.match.params.token;

/**
 * Extracts ResetPassword form data from redux state
 * @param state
 * @returns {{param: string}|form|{param}|{}}
 */
export const getResetPasswordForm = state => state.auth.resetPassword.form;

/**
 * Extracts RecoverPassword form data from redux state
 * @param state
 * @returns {{param: string}|form|{param}|{}}
 */
export const getRecoverPasswordForm = state => state.auth.recoverPassword.form;
