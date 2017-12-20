// @flow
import API, { APIResponse } from 'util/API';
import type { SignUpForm } from 'bundles/Auth/modules/SignUpModule';
import type { SignInForm } from 'bundles/Auth/modules/SignInModule';
import type { RecoverPasswordForm } from 'bundles/Auth/modules/RecoverPasswordModule';
import type { ResetPasswordForm } from 'bundles/Auth/modules/ResetPasswordModule';

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
  async signUp(data: SignUpForm): Promise<APIResponse> {
    const response = await this.jsonRequest('api/auth/sign-up', data);

    return response.json();
  }

  /**
   * Sign in a user.
   *
   * @param data The sign-in data.
   * @returns An object indicating if the process was successful or not.
   */
  async signIn(data: SignInForm): Promise<APIResponse> {
    const response = await this.jsonRequest('api/auth/sign-in', data);

    return response.json();
  }

  /**
   * Activates the account for a user.
   *
   * @param token The token for which the account should be activated.
   * @returns An object indicating if the process was successful or not.
   */
  async activateAccount(token: string): Promise<APIResponse> {
    const response = await this.request(`api/auth/account/activation/${token}`);

    return response.json();
  }

  /**
   * Sends a new activation email to the given email address.
   *
   * @param email The email address to send the email to.
   * @returns An object indicating if the process was successful or not.
   */
  async sendActivationMail(email: string): Promise<APIResponse> {
    const response = await this.jsonRequest('api/auth/account/activation', { email });

    return response.json();
  }

  /**
   * Requests an email with password recovery instructions.
   *
   * @param data The forgot password data.
   * @returns An object indicating if the process was successful or not.
   */
  async recoverPassword(data: RecoverPasswordForm): Promise<APIResponse> {
    const response = await this.jsonRequest('api/auth/password/recovery', data);

    return response.json();
  }

  /**
   * Validates the password recovery token.
   *
   * @param token The token to validate.
   * @returns An object indicating if the token is valid or not.
   */
  async validatePasswordToken(token: string): Promise<APIResponse> {
    const response = await this.request(`api/auth/password/recovery/${token}`);

    return response.json();
  }

  /**
   * Resets the password.
   *
   * @param token The recovery token.
   * @param data  The reset password data.
   * @returns An object indicating if the process was successful or not.
   */
  async resetPassword(token: string, data: ResetPasswordForm): Promise<APIResponse> {
    const response = await this.jsonRequest(`api/auth/password/recovery/${token}`, data);

    return response.json();
  }
}
