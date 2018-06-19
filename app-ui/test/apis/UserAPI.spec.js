import { APIResponse } from 'util/API';
import Cookies from 'js-cookie';
import UserAPI from 'apis/UserAPI';
import fetchMock from 'fetch-mock'; // Must be loaded after after anything that polyfills fetch
import config from 'config/index';

import { apiTest } from '../test-helpers';

describe('(API) UserAPI', () => {
  const apiResponse = new APIResponse('', '');
  const csrfToken = 'some-csrf-token';
  const testAPI = apiTest(fetchMock, apiResponse, csrfToken);
  const userApi = new UserAPI();

  beforeEach(() => {
    Cookies.set(config.csrfCookieName, csrfToken);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('(Method) get', () => {
    it('Should execute a GET request to /api/auth/user', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });

      const maybeResult = userApi.get();
      return maybeResult.then(testAPI.get('api/auth/user'));
    });
  });

  describe('(Method) signOut', () => {
    it('Should execute a GET request to /api/auth/sign-out', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });

      const maybeResult = userApi.signOut();
      return maybeResult.then(testAPI.get('api/auth/sign-out'));
    });
  });
});
