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
  code: string;

  description: string;

  details: any;

  constructor(code: string, description: string, details: any = []) {
    this.code = code;
    this.description = description;
    this.details = details;
  }
}

/**
 * An API error that can transport an `APIResponse`.
 *
 * Works with Babel6 and instanceof.
 * @see https://stackoverflow.com/a/46971044/2153190
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class APIError {
  name: string;

  message: string;

  stack: string;

  response: APIResponse;

  constructor(response: APIResponse) {
    this.response = response;
    this.name = this.constructor.name;
    this.message = response.description;
    this.stack = (new Error(response.description)).stack;
  }
}
Object.setPrototypeOf(APIError, Error);

/**
 * Provides helpers for the API implementations.
 */
export default class API {
  /**
   * The default error message which will be displayed in production mode for an unexpected error.
   */
  errorMsg = 'An error occurred, please try again later!';

  /**
   * Executes a request without a body.
   *
   * @param route  The API route.
   * @param method The request method.
   * @return A resolved or rejected promise.
   * @see http://www.redotheweb.com/2015/11/09/api-security.html
   */
  request(route: string, method: string = 'GET'): Promise<Response> {
    return this.statusHandler(fetch(`${config.apiBaseUrl}/${route}`, {
      method,
      credentials: 'include', // Needed to allow cookies with CORS, see above link
    }));
  }

  /**
   * Executes a request with a JSON body.
   *
   * @param route The API route.
   * @param json  The JSON data to post.
   * @param method The request method.
   * @return A resolved or rejected promise.
   * @see http://www.redotheweb.com/2015/11/09/api-security.html
   */
  jsonRequest(route: string, json: *, method: string = 'POST'): Promise<Response> {
    return this.statusHandler(fetch(`${config.apiBaseUrl}/${route}`, {
      method,
      headers: {
        'Csrf-Token': Cookies.get()[config.csrfCookieName],
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      credentials: 'include', // Needed to allow cookies with CORS, see above link
      body: JSON.stringify(json),
    }));
  }

  /**
   * Executes a request with a application/x-www-form-urlencoded or multipart/form-data body.
   *
   * The `Content-Type` headers will automatically be added based on the passed content:
   * - URLSearchParams -> application/x-www-form-urlencoded
   * - FormData -> multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
   *
   * @param route  The API route.
   * @param body   The body to post.
   * @param method The request method.
   * @return A resolved or rejected promise.
   * @see http://www.redotheweb.com/2015/11/09/api-security.html
   */
  formRequest(route: string, body: URLSearchParams | FormData, method: string = 'POST'): Promise<Response> {
    return this.statusHandler(fetch(`${config.apiBaseUrl}/${route}`, {
      method,
      headers: {
        'Csrf-Token': Cookies.get()[config.csrfCookieName],
      },
      credentials: 'include', // Needed to allow cookies with CORS, see above link
      body,
    }));
  }

  /**
   * Handles the status of a response in a unified manner.
   *
   * All 2xx responses wil be returned directly, so that the caller can extract the body as required. All other
   * responses will be rejected with an APIError.
   *
   * @param promise The result from a fetch call.
   * @return A resolved or rejected promise.
   */
  statusHandler(promise: Promise<*>): Promise<Response> {
    const self = this;
    return promise.then((response) => {
      // We return a resolved promise with the APIResponse for all 2xx status codes
      if (response.status >= 200 && response.status <= 299) {
        return response;
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
