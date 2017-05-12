// @flow
import 'whatwg-fetch';
import Cookies from 'js-cookie';
import config from 'config/index';

/**
 * The definition of an API response.
 *
 * Needed to return always the same structure from a API method.
 */
export class APIResponse {
  code: string
  description: string
  details: any
  constructor(code: string, description: string, details: any = []) {
    this.code = code;
    this.description = description;
    this.details = details;
  }
}

/**
 * An API error that can transport an `APIResponse`.
 */
export class APIError extends Error {
  response: APIResponse
  constructor(response: APIResponse) {
    super(response.description);
    this.response = response;
  }
}

/**
 * Provides helpers for the API implementations.
 */
export default class API {

  /**
   * The default error message which will be displayed in production mode for an unexpected error.
   */
  errorMsg: string = 'An error occurred, please try again later!'

  /**
   * Executes a GET request.
   *
   * @param route The API route.
   * @return A resolved or rejected promise containing an API result.
   * @see http://www.redotheweb.com/2015/11/09/api-security.html
   */
  getRequest(route: string): Promise<APIResponse> {
    return this.statusHandler(fetch(`${config.apiBaseUrl}/${route}`, {
      method: 'GET',
      credentials: 'include', // Needed to allow cookies with CORS, see above link
    }));
  }

  /**
   * Executes a POST request with a JSON body.
   *
   * @param route The API route.
   * @param json  The JSON data to post.
   * @return A resolved or rejected promise containing an API result.
   * @see http://www.redotheweb.com/2015/11/09/api-security.html
   */
  jsonPostRequest(route: string, json: *): Promise<APIResponse> {
    return this.statusHandler(fetch(`${config.apiBaseUrl}/${route}`, {
      method: 'POST',
      headers: {
        'Csrf-Token': Cookies.get()[config.csrfCookieName],
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      credentials: 'include',  // Needed to allow cookies with CORS, see above link
      body: JSON.stringify(json),
    }));
  }

  /**
   * Executes a POST request with a application/x-www-form-urlencoded or multipart/form-data body.
   *
   * @param route The API route.
   * @param body  The body to post.
   * @return A resolved or rejected promise containing an API result.
   * @see http://www.redotheweb.com/2015/11/09/api-security.html
   */
  formPostRequest(route: string, body: *): Promise<APIResponse> {
    return this.statusHandler(fetch(`${config.apiBaseUrl}/${route}`, {
      method: 'POST',
      headers: {
        'Csrf-Token': Cookies.get()[config.csrfCookieName],
      },
      credentials: 'include',  // Needed to allow cookies with CORS, see above link
      body,
    }));
  }

  /**
   * Handles the status of a response in a unified manner.
   *
   * @param promise The result from a fetch call.
   * @return A resolved or rejected promise containing an API result.
   */
  statusHandler(promise: Promise<*>): Promise<APIResponse> {
    const self = this;
    return promise.then((response) => {
      // We return a resolved promise with the APIResponse for all 2xx status codes
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      }

      // We return a rejected promise for all 4xx errors
      if (response.status >= 400 && response.status <= 499) {
        return response.json().then(json => Promise.reject(new APIError(json)));
      }

      // We return a rejected promise for all other status codes
      const msg = config.env === 'production' ? self.errorMsg : `Unexpected response status: ${response.status}`;
      return Promise.reject(new APIError(new APIResponse('unexpected.status', msg)));
    }).catch((e) => {
      // If the exception is already an APIError then we throw it again
      if (e.response !== undefined) {
        throw e;
      }

      const msg = config.env === 'production' ? self.errorMsg : `Cannot process request; Got exception: ${e.message}`;
      throw new APIError(new APIResponse('fatal.error', msg));
    });
  }
}
