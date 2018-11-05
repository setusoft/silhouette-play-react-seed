import Alert from 'react-s-alert';
import config from 'config/index';
import { actions } from 'react-redux-form';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { history } from 'modules/LocationModule';
import saga, { recoverPasswordSaga } from 'bundles/Auth/sagas/RecoverPasswordSaga';
import {
  modelPath,
  recoverPassword,
  recoverPasswordRequest
} from 'bundles/Auth/modules/RecoverPasswordModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

describe('(Saga) Auth/RecoverPasswordSaga', () => {
  const payload = 'john@doe.com';
  const formError = { key: 'password', message: 'Is required!' };
  const successResponse = new APIResponse('successful', 'Successful response');
  const invalidFormError = new APIError(new APIResponse('auth.password.recover.form.invalid', 'Invalid response', [
    formError,
  ]));
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(recoverPasswordSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) recoverPasswordSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(recoverPasswordSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending if call is awaited', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .put(recoverPasswordRequest.pending())
        .dispatch(recoverPassword(payload))
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .put(recoverPasswordRequest.success(successResponse.description))
        .dispatch(recoverPassword(payload))
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { recoverPassword: () => { throw fatalError; } };
      return expectSaga(recoverPasswordSaga, api)
        .put(recoverPasswordRequest.failed(fatalError.response.description))
        .dispatch(recoverPassword(payload))
        .silentRun();
    });

    it('Should call the `recoverPassword` method of the API', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .call([api, api.recoverPassword], payload)
        .dispatch(recoverPassword(payload))
        .silentRun();
    });

    it('Should reset the form on success', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .put(actions.reset(modelPath))
        .dispatch(recoverPassword(payload))
        .silentRun();
    });

    /*it('Should display the success alert box on success', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .call(Alert.success, successResponse.description, { timeout: 30000 })
        .dispatch(recoverPassword(payload))
        .silentRun();
    });*/

    //$remove
   /* it('Should route to the sign-in page on success', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .call(history.push, config.route.auth.signIn)
        .dispatch(recoverPassword(payload))
        .silentRun();
    });*/

    it('Should handle an invalid form', () => {
      const api = { recoverPassword: () => { throw invalidFormError; } };
      return expectSaga(recoverPasswordSaga, api)
        .put(actions.setErrors(`${modelPath}.${formError.key}`, formError.message))
        .dispatch(recoverPassword(payload))
        .silentRun();
    });

    it('Should display the error alert box on error', () => {
      const api = { recoverPassword: () => { throw fatalError; } };
      return expectSaga(recoverPasswordSaga, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(recoverPassword(payload))
        .silentRun();
    });
  });
});
