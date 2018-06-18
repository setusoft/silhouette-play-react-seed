// @flow
import API, { APIResponse } from 'util/API';

/**
 * API to handle the config.
 */
export default class ConfigAPI extends API {
  /**
   * Gets the config.
   *
   * @returns An object indicating if the process was successful or not.
   */
  async get(): Promise<APIResponse> {
    const response = await this.request('api/core/config');

    return response.json();
  }
}
