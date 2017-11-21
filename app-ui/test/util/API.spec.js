import API, { APIResponse } from 'util/API';
import Cookies from 'js-cookie';
import fetchMock from 'fetch-mock'; // Must be loaded after after anything that polyfills fetch
import config from 'config/index';

import { apiTest } from '../test-helpers';

describe('(Util) API', () => {
  const apiResponse = new APIResponse('', '');
  const csrfToken = 'some-csrf-token';
  const testAPI = apiTest(fetchMock, apiResponse, csrfToken);
  const api = new API();

  beforeEach(() => {
    Cookies.set(config.csrfCookieName, csrfToken);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  const statusCode = (min, max) => Math.floor((Math.random() * ((max - min) + 1)) + min);

  describe('(Method) request', () => {
    it('Should execute a GET request to a route', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });

      const route = 'some-get';
      const maybeResult = api.request(route);
      return maybeResult.then(testAPI.get(route));
    });
  });

  describe('(Method) jsonRequest', () => {
    it('Should execute a POST request to a route', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const json = {
        name: 'Jon Doe',
        email: 'test@test.com',
      };

      const route = 'some-json-post';
      const maybeResult = api.jsonRequest(route, json);
      return maybeResult.then(testAPI.jsonPost(route, json));
    });
  });

  describe('(Method) formRequest', () => {
    it('Should execute a POST request to a route', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const route = 'some-json-post';
      const maybeResult = api.formRequest(route);
      return maybeResult.then(testAPI.formPost(route));
    });
  });

  describe('(Method) statusHandler', () => {
    it('Should return the response JSON for all 2xx status codes', () => {
      fetchMock.postOnce('*', { status: statusCode(200, 299), body: apiResponse });

      const maybeResult = api.statusHandler(fetch('/route', { method: 'POST' }));
      return maybeResult.then((response) => {
        expect(response).to.eql(apiResponse);
      });
    });

    it('Should return an API error for all 4xx status codes', () => {
      fetchMock.postOnce('*', { status: statusCode(400, 499), body: apiResponse });

      const maybeResult = api.statusHandler(fetch('/route', { method: 'POST' }));
      return maybeResult.catch((error) => {
        expect(error.response).to.eql(apiResponse);
      });
    });

    it('Should return an API error for unexpected status codes', () => {
      fetchMock.postOnce('*', { status: 500, body: apiResponse });

      const maybeResult = api.statusHandler(fetch('/route', { method: 'POST' }));
      return maybeResult.catch((error) => {
        expect(error.response.code).to.eql('unexpected.status');
        expect(error.response.description).to.eql('Unexpected response status: 500');
      });
    });

    it('Should return an API error for a rejected promise from fetch', () => {
      const maybeResult = api.statusHandler(Promise.reject(new Error('fetch issue')));
      return maybeResult.catch((error) => {
        expect(error.response.code).to.eql('fatal.error');
        expect(error.response.description).to.eql('Cannot process request; Got exception: fetch issue');
      });
    });
  });
});
