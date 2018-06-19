import { APIResponse } from 'util/API';
import Cookies from 'js-cookie';
import ConfigAPI from 'apis/ConfigAPI';
import fetchMock from 'fetch-mock'; // Must be loaded after after anything that polyfills fetch
import config from 'config/index';

import { apiTest } from '../test-helpers';

describe('(API) ConfigAPI', () => {
  const apiResponse = new APIResponse('', '');
  const csrfToken = 'some-csrf-token';
  const testAPI = apiTest(fetchMock, apiResponse, csrfToken);
  const configApi = new ConfigAPI();

  beforeEach(() => {
    Cookies.set(config.csrfCookieName, csrfToken);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('(Method) get', () => {
    it('Should execute a GET request to /api/core/config', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });

      const maybeResult = configApi.get();
      return maybeResult.then(testAPI.get('api/core/config'));
    });
  });
});
