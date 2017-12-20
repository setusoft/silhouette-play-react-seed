// @flow
import API, { APIResponse } from 'util/API';

/**
 * Executes user calls against the backend API.
 */
export default class UserAPI extends API {
  /**
   * Gets a user.
   *
   * @returns An object indicating if the process was successful or not.
   */
  async get(): Promise<APIResponse> {
    const response = await this.request('api/auth/user');

    return response.json();
  }

  /**
   * Sign out a user.
   *
   * @returns An object indicating if the process was successful or not.
   */
  async signOut(): Promise<APIResponse> {
    const response = await this.request('api/auth/sign-out');

    return response.json();
  }
}
