import Alert from 'react-s-alert';
import config from 'config/index';
import { actions } from 'react-redux-form';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { browserHistory } from 'react-router';
import saga, { recoverPasswordSaga } from 'routes/Auth/sagas/RecoverPasswordSaga';
import {
  modelPath,
  recoverPassword,
  recoverPasswordPending,
  recoverPasswordFulfilled,
  recoverPasswordRejected,
} from 'routes/Auth/modules/RecoverPasswordModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

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
      expect(recoverPasswordSaga).to.be.a('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .put(recoverPasswordPending())
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .put(recoverPasswordFulfilled(successResponse))
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { recoverPassword: () => { throw fatalError; } };
      return expectSaga(recoverPasswordSaga, api)
        .put(recoverPasswordRejected(fatalError))
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should call the `recoverPassword` method of the API', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .call([api, api.recoverPassword], payload)
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should reset the form on success', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .put(actions.reset(modelPath))
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should display the success alert box on success', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .call(Alert.success, successResponse.description, { timeout: 30000 })
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should route to the sign-in page on success', () => {
      const api = { recoverPassword: () => successResponse };
      return expectSaga(recoverPasswordSaga, api)
        .call(browserHistory.push, config.route.auth.signIn)
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should handle an invalid form', () => {
      const api = { recoverPassword: () => { throw invalidFormError; } };
      return expectSaga(recoverPasswordSaga, api)
        .put(actions.setErrors(`${modelPath}.${formError.key}`, formError.message))
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });

    it('Should display the error alert box on error', () => {
      const api = { recoverPassword: () => { throw fatalError; } };
      return expectSaga(recoverPasswordSaga, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(recoverPassword(payload))
        .run({ silenceTimeout: true });
    });
  });
});
