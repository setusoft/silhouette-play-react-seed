import config from 'config/index';
import { actions } from 'react-redux-form';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { history } from 'modules/LocationModule';
import { fetchUserFulfilled } from 'modules/UserModule';
import { saveActivationEmail } from 'bundles/Auth/modules/ActivateAccountModule';
import saga, { signInSaga } from 'bundles/Auth/sagas/SignInSaga';
import {
  modelPath,
  signIn,
  signInRequest,
} from 'bundles/Auth/modules/SignInModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

describe('(Saga) Auth/SignInSaga', () => {
  const payload = {};
  const formError = { key: 'password', message: 'Is required!' };
  const successResponse = new APIResponse('successful', 'Successful response');
  const invalidFormError = new APIError(new APIResponse('auth.signIn.form.invalid', 'Invalid response', [
    formError,
  ]));
  const inactiveAccountError = new APIError(new APIResponse('auth.signIn.account.inactive', 'Invalid response', {
    email: 'john@doe.com',
  }));
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(signInSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) signInSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(signInSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { signIn: () => successResponse };
      return expectSaga(signInSaga, api)
        .put(signInRequest.pending())
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { signIn: () => successResponse };
      return expectSaga(signInSaga, api)
        .put(signInRequest.success())
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { signIn: () => { throw fatalError; } };
      return expectSaga(signInSaga, api)
        .put(signInRequest.failed())
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should call the `signIn` method of the API', () => {
      const api = { signIn: () => successResponse };
      return expectSaga(signInSaga, api)
        .call([api, api.signIn], payload)
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should save the user on success', () => {
      const api = { signIn: () => successResponse };
      return expectSaga(signInSaga, api)
        .put(fetchUserFulfilled(successResponse.details))
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should reset the form on success', () => {
      const api = { signIn: () => successResponse };
      return expectSaga(signInSaga, api)
        .put(actions.reset(modelPath))
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should route to the index page on success', () => {
      const api = { signIn: () => successResponse };
      return expectSaga(signInSaga, api)
        .call(history.push, config.route.index)
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should handle an invalid form', () => {
      const api = { signIn: () => { throw invalidFormError; } };
      return expectSaga(signInSaga, api)
        .put(actions.setErrors(`${modelPath}.${formError.key}`, formError.message))
        .dispatch(signIn(payload))
        .silentRun();
    });

    it('Should handle an inactive account', () => {
      const api = { signIn: () => { throw inactiveAccountError; } };
      return expectSaga(signInSaga, api)
        .put(saveActivationEmail(inactiveAccountError.response.details.email))
        .call(history.push, config.route.auth.accountActivation)
        .dispatch(signIn(payload))
        .silentRun();
    });
  });
});
