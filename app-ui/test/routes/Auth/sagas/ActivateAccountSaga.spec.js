import Alert from 'react-s-alert';
import config from 'config/index';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { browserHistory } from 'react-router';
import saga, {
  activateAccountWorker,
  sendActivationEmailWorker,
  activateAccountSaga,
} from 'routes/Auth/sagas/ActivateAccountSaga';
import {
  activateAccount,
  sendActivationEmail,
  sendActivationEmailPending,
  sendActivationEmailFulfilled,
  sendActivationEmailRejected,
} from 'routes/Auth/modules/ActivateAccountModule';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

describe('(Saga) Auth/ActivateAccountSaga', () => {
  const activationPayload = {
    token: 'some-activation-token',
    cb: () => null,
  };
  const emailPayload = 'john@doe.com';
  const successResponse = new APIResponse('successful', 'Successful response');
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(activateAccountSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) activateAccountWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(activateAccountWorker).to.be.a('GeneratorFunction');
    });

    it('Should call the `activateAccount` method of the API', () => {
      const api = { activateAccount: () => successResponse };
      return expectSaga(activateAccountWorker, api)
        .call([api, api.activateAccount], activationPayload.token)
        .dispatch(activateAccount(activationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should call the callback with the sign-in route on success', () => {
      const api = { activateAccount: () => successResponse };
      return expectSaga(activateAccountWorker, api)
        .call(activationPayload.cb, config.route.auth.signIn)
        .dispatch(activateAccount(activationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the success alert box on success', () => {
      const api = { activateAccount: () => successResponse };
      return expectSaga(activateAccountWorker, api)
        .call(Alert.success, successResponse.description)
        .dispatch(activateAccount(activationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should call the callback with the sign-in route on error', () => {
      const api = { activateAccount: () => { throw fatalError; } };
      return expectSaga(activateAccountWorker, api)
        .call(activationPayload.cb, config.route.auth.signIn)
        .dispatch(activateAccount(activationPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the error alert box on error', () => {
      const api = { activateAccount: () => { throw fatalError; } };
      return expectSaga(activateAccountWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(activateAccount(activationPayload))
        .run({ silenceTimeout: true });
    });
  });

  describe('(Generator) sendActivationEmailSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(sendActivationEmailWorker).to.be.a('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { sendActivationMail: () => successResponse };
      return expectSaga(sendActivationEmailWorker, api)
        .put(sendActivationEmailPending())
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { sendActivationMail: () => successResponse };
      return expectSaga(sendActivationEmailWorker, api)
        .put(sendActivationEmailFulfilled(successResponse))
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { sendActivationMail: () => { throw fatalError; } };
      return expectSaga(sendActivationEmailWorker, api)
        .put(sendActivationEmailRejected(fatalError))
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });

    it('Should call the `sendActivationMail` method of the API', () => {
      const api = { sendActivationMail: () => successResponse };
      return expectSaga(sendActivationEmailWorker, api)
        .call([api, api.sendActivationMail], emailPayload)
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });

    it('Should route to the sign-in page on success', () => {
      const api = { sendActivationMail: () => successResponse };
      return expectSaga(sendActivationEmailWorker, api)
        .call(browserHistory.push, config.route.auth.signIn)
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the success alert box on success', () => {
      const api = { sendActivationMail: () => successResponse };
      return expectSaga(sendActivationEmailWorker, api)
        .call(Alert.success, successResponse.description, { timeout: 30000 })
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });

    it('Should display the error alert box on error', () => {
      const api = { sendActivationMail: () => { throw fatalError; } };
      return expectSaga(sendActivationEmailWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(sendActivationEmail(emailPayload))
        .run({ silenceTimeout: true });
    });
  });

  describe('(Generator) activateAccountSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(activateAccountSaga).to.be.a('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(activateAccountSaga, api)
        .spawn(activateAccountWorker, api)
        .spawn(sendActivationEmailWorker, api)
        .run({ silenceTimeout: true });
    });
  });
});
