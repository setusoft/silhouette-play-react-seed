// @flow
import API, { APIResponse } from 'util/API';

/**
 * API to handle the health status.
 */
export default class HealthAPI extends API {
  /**
   * Gets the health status.
   *
   * @returns An object indicating if the process was successful or not.
   */
  async get(): Promise<APIResponse> {
    const response = await this.request('api/core/health');

    return response.json();
  }
}
