import { APIResponse } from 'util/API';
import Cookies from 'js-cookie';
import HealthAPI from 'apis/HealthAPI';
import fetchMock from 'fetch-mock'; // Must be loaded after after anything that polyfills fetch
import config from 'config/index';

import { apiTest } from '../test-helpers';

describe('(API) HealthAPI', () => {
  const apiResponse = new APIResponse('', '');
  const csrfToken = 'some-csrf-token';
  const testAPI = apiTest(fetchMock, apiResponse, csrfToken);
  const healthApi = new HealthAPI();

  beforeEach(() => {
    Cookies.set(config.csrfCookieName, csrfToken);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('(Method) get', () => {
    it('Should execute a GET request to /api/core/health', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });

      const maybeResult = healthApi.get();
      return maybeResult.then(testAPI.get('api/core/health'));
    });
  });
});
