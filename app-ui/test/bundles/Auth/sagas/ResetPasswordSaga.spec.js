import Alert from 'react-s-alert';
import config from 'config/index';
import { actions } from 'react-redux-form';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { history } from 'modules/LocationModule';
import saga, {
  validatePasswordTokenWorker,
  resetPasswordWorker,
  resetPasswordSaga,
} from 'bundles/Auth/sagas/ResetPasswordSaga';
import {
  modelPath,
  resetPassword,
  resetPasswordRequest,
  validatePasswordToken,
} from 'bundles/Auth/modules/ResetPasswordModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

describe('(Saga) Auth/ResetPasswordSaga', () => {
  const validationPayload = 'some-validation-token';
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
        .call([api, api.validatePasswordToken], validationPayload)
        .dispatch(validatePasswordToken(validationPayload))
        .silentRun();
    });

    it('Should display the success alert box on success', () => {
      const api = { validatePasswordToken: () => successResponse };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(Alert.success, successResponse.description)
        .dispatch(validatePasswordToken(validationPayload))
        .silentRun();
    });

    it('Should call the callback with the password/recovery route on error', () => {
      const api = { validatePasswordToken: () => { throw fatalError; } };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(history.push, config.route.auth.passwordRecovery)
        .dispatch(validatePasswordToken(validationPayload))
        .silentRun();
    });

    it('Should display the error alert box on error', () => {
      const api = { validatePasswordToken: () => { throw fatalError; } };
      return expectSaga(validatePasswordTokenWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(validatePasswordToken(validationPayload))
        .silentRun();
    });
  });

  describe('(Generator) resetPasswordWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(resetPasswordWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordRequest.pending())
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordRequest.success())
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should set the state to rejected with message '
      + 'if the call to the API failed due to invalid token', () => {
      const api = { resetPassword: () => { throw invalidTokenError; } };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordRequest.failed(invalidTokenError.response.description))
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { resetPassword: () => { throw fatalError; } };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordRequest.failed())
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should display the error alert box on unhandled rejection if the call to the API failed', () => {
      const api = { resetPassword: () => { throw fatalError; } };
      return expectSaga(resetPasswordWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should call the `resetPassword` method of the API', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .call([api, api.resetPassword], resetPayload.token, resetPayload.data)
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should reset the form on success', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .put(actions.reset(modelPath))
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should display the success alert box on success', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .call(Alert.success, successResponse.description)
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should route to the sign-in page on success', () => {
      const api = { resetPassword: () => successResponse };
      return expectSaga(resetPasswordWorker, api)
        .call(history.push, config.route.auth.signIn)
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should handle an invalid form', () => {
      const api = { resetPassword: () => { throw invalidFormError; } };
      return expectSaga(resetPasswordWorker, api)
        .put(actions.setErrors(`${modelPath}.${formError.key}`, formError.message))
        .dispatch(resetPassword(resetPayload))
        .silentRun();
    });

    it('Should handle an invalid token', () => {
      const api = { resetPassword: () => { throw invalidTokenError; } };
      return expectSaga(resetPasswordWorker, api)
        .put(resetPasswordRequest.failed(invalidTokenError.response.description))
        .dispatch(resetPassword(resetPayload))
        .silentRun();
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
        .silentRun();
    });
  });
});
