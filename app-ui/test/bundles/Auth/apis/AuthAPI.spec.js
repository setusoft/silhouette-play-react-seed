import { APIResponse } from 'util/API';
import Cookies from 'js-cookie';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';
import fetchMock from 'fetch-mock'; // Must be loaded after after anything that polyfills fetch
import config from 'config/index';

import { apiTest } from '../../../test-helpers';

describe('(API) Auth/AuthAPI', () => {
  const apiResponse = new APIResponse('', '');
  const csrfToken = 'some-csrf-token';
  const testAPI = apiTest(fetchMock, apiResponse, csrfToken);
  const authApi = new AuthAPI();

  beforeEach(() => {
    Cookies.set(config.csrfCookieName, csrfToken);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('(Method) signUp', () => {
    it('Should execute a POST request to /api/auth/sign-up', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const signUpData = {
        name: 'Jon Doe',
        email: 'test@test.com',
        password: '12345',
      };

      const maybeResult = authApi.signUp(signUpData);
      return maybeResult.then(testAPI.jsonPost('api/auth/sign-up', signUpData));
    });
  });

  describe('(Method) signIn', () => {
    it('Should execute a POST request to /api/auth/sign-in', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const signInData = {
        email: 'test@test.com',
        password: '12345',
        rememberMe: true,
      };

      const maybeResult = authApi.signIn(signInData);
      return maybeResult.then(testAPI.jsonPost('api/auth/sign-in', signInData));
    });
  });

  describe('(Method) activateAccount', () => {
    it('Should execute a GET request to /api/auth/account/activation/:token', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });
      const token = 'some-activation-token';
      const maybeResult = authApi.activateAccount(token);
      return maybeResult.then(testAPI.get(`api/auth/account/activation/${token}`));
    });
  });

  describe('(Method) sendActivationMail', () => {
    it('Should execute a POST request to /api/auth/account/activation', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const email = 'test@test.com';
      const maybeResult = authApi.sendActivationMail(email);
      return maybeResult.then(testAPI.jsonPost('api/auth/account/activation', { email }));
    });
  });

  describe('(Method) recoverPassword', () => {
    it('Should execute a POST request to /api/auth/password/recovery', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const email = 'test@test.com';
      const maybeResult = authApi.recoverPassword({ email });
      return maybeResult.then(testAPI.jsonPost('api/auth/password/recovery', { email }));
    });
  });

  describe('(Method) validatePasswordToken', () => {
    it('Should execute a GET request to /api/auth/password/recovery/:token', () => {
      fetchMock.getOnce('*', { status: 200, body: apiResponse });
      const token = 'some-password-token';
      const maybeResult = authApi.validatePasswordToken(token);
      return maybeResult.then(testAPI.get(`api/auth/password/recovery/${token}`));
    });
  });

  describe('(Method) resetPassword', () => {
    it('Should execute a POST request to /api/auth/password/recovery/:token', () => {
      fetchMock.postOnce('*', { status: 200, body: apiResponse });

      const token = 'some-password-token';
      const password = '12345';
      const maybeResult = authApi.resetPassword(token, { password });
      return maybeResult.then(testAPI.jsonPost(`api/auth/password/recovery/${token}`, { password }));
    });
  });
});
