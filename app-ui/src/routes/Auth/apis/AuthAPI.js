// @flow
import API, { APIResponse } from 'util/API';
import type { SignUpForm } from 'routes/Auth/modules/SignUpModule';
import type { SignInForm } from 'routes/Auth/modules/SignInModule';
import type { RecoverPasswordForm } from 'routes/Auth/modules/RecoverPasswordModule';
import type { ResetPasswordForm } from 'routes/Auth/modules/ResetPasswordModule';

/**
 * Executes auth calls against the backend API.
 */
export default class AuthAPI extends API {

  /**
   * Sign up a user.
   *
   * @param data The sign-up data.
   * @return A resolved or rejected promise containing an API result.
   */
  signUp(data: SignUpForm): Promise<APIResponse> {
    return this.jsonRequest('api/auth/sign-up', data);
  }

  /**
   * Sign in a user.
   *
   * @param data The sign-in data.
   * @returns An object indicating if the process was successful or not.
   */
  signIn(data: SignInForm): Promise<APIResponse> {
    return this.jsonRequest('api/auth/sign-in', data);
  }

  /**
   * Sign out a user.
   *
   * @returns An object indicating if the process was successful or not.
   */
  signOut(): Promise<APIResponse> {
    return this.request('api/auth/sign-out');
  }

  /**
   * Gets a user.
   *
   * @returns An object indicating if the process was successful or not.
   */
  user(): Promise<APIResponse> {
    return this.request('api/auth/user');
  }

  /**
   * Activates the account for a user.
   *
   * @param token The token for which the account should be activated.
   * @returns An object indicating if the process was successful or not.
   */
  activateAccount(token: string): Promise<APIResponse> {
    return this.request(`api/auth/account/activation/${token}`);
  }

  /**
   * Sends a new activation email to the given email address.
   *
   * @param email The email address to send the email to.
   * @returns An object indicating if the process was successful or not.
   */
  sendActivationMail(email: string): Promise<APIResponse> {
    return this.jsonRequest('api/auth/account/activation', { email });
  }

  /**
   * Requests an email with password recovery instructions.
   *
   * @param data The forgot password data.
   * @returns An object indicating if the process was successful or not.
   */
  recoverPassword(data: RecoverPasswordForm): Promise<APIResponse> {
    return this.jsonRequest('api/auth/password/recovery', data);
  }

  /**
   * Validates the password recovery token.
   *
   * @param token The token to validate.
   * @returns An object indicating if the token is valid or not.
   */
  validatePasswordToken(token: string): Promise<APIResponse> {
    return this.request(`api/auth/password/recovery/${token}`);
  }

  /**
   * Resets the password.
   *
   * @param token The recovery token.
   * @param data  The reset password data.
   * @returns An object indicating if the process was successful or not.
   */
  resetPassword(token: string, data: ResetPasswordForm): Promise<APIResponse> {
    return this.jsonRequest(`api/auth/password/recovery/${token}`, data);
  }
}
