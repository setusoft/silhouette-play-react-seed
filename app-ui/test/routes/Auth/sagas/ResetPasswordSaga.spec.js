import Alert from 'react-s-alert';
import config from 'config/index';
import { actions } from 'react-redux-form';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { browserHistory } from 'react-router';
import saga, {
  validatePasswordTokenWorker,
  resetPasswordWorker,
  resetPasswordSaga,
} from 'routes/Auth/sagas/ResetPasswordSaga';
import {
  modelPath,
  resetPassword,
  resetPasswordPending,
  resetPasswordFulfilled,
  resetPasswordRejected,
  validatePasswordToken,
} from 'routes/Auth/modules/ResetPasswordModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

describe('(Saga) Auth/ResetPasswordSaga', () => {
  const validationPayload = {
    token: 'some-validation-token',
    cb: () => null,
  };
  const resetPayload = {
    token: 'some-validation-token',
    data: {},
  };
  const formError = { key: 'password', message: 'Is required!' };
  const successResponse = new APIResponse('successful', 'Successful response');
  const invalidFormError = new APIError(new APIResponse('auth.password.reset.form.invalid', 'Invalid response', [
    formError,
  ]));
  const invalidTokenError = new APIError(new APIResponse('auth.password.reset.token.invalid', 'Invalid response'));
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(resetPasswordSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) validatePasswordTokenWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(validatePasswordTokenWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should call the `validatePasswordToken` method of the API', () => {
      const api = { validatePasswordToken: () => successResponse };
      return expectSaga(validatePasswordTokenWorker, api)
        .call([api, api.validatePasswordToken], validationPayload.token)
        .dispatch(validatePasswordToken(validationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should call the callback on success', () => {
      const api = { validatePasswordToken: () => successResponse };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(validationPayload.cb)
        .dispatch(validatePasswordToken(validationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the success alert box on success', () => {
      const api = { validatePasswordToken: () => successResponse };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(Alert.success, successResponse.description)
        .dispatch(validatePasswordToken(validationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should call the callback with the sign-in route on error', () => {
      const api = { validatePasswordToken: () => { throw fatalError; } };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(validationPayload.cb, config.route.auth.passwordRecovery)
        .dispatch(validatePasswordToken(validationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the error alert box on error', () => {
      const api = { validatePasswordToken: () => { throw fatalError; } };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(validatePasswordToken(validationPayload))
        .run({ silenceTimeout: true });
    });
  });

  describe('(Generator) resetPasswordWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(resetPasswordWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordPending())
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordFulfilled(successResponse))
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { resetPassword: () => { throw fatalError; } };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordRejected(fatalError))
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should call the `resetPassword` method of the API', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .call([api, api.resetPassword], resetPayload.token, resetPayload.data)
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should reset the form on success', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .put(actions.reset(modelPath))
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the success alert box on success', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .call(Alert.success, successResponse.description)
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should route to the sign-in page on success', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .call(browserHistory.push, config.route.auth.signIn)
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should handle an invalid form', () => {
      const api = { resetPassword: () => { throw invalidFormError; } };
      return expectSaga(resetPasswordWorker, api)
        .put(actions.setErrors(`${modelPath}.${formError.key}`, formError.message))
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should handle an invalid token', () => {
      const api = { resetPassword: () => { throw invalidTokenError; } };
      return expectSaga(resetPasswordWorker, api)
        .call(browserHistory.push, config.route.auth.signIn)
        .call(Alert.error, invalidTokenError.response.description)
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the error alert box on error', () => {
      const api = { resetPassword: () => { throw fatalError; } };
      return expectSaga(resetPasswordWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(resetPassword(resetPayload))
        .run({ silenceTimeout: true });
    });
  });

  describe('(Generator) resetPasswordSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(resetPasswordSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(resetPasswordSaga, api)
        .spawn(validatePasswordTokenWorker, api)
        .spawn(resetPasswordWorker, api)
        .run({ silenceTimeout: true });
    });
  });
});
