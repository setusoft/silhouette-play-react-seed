import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import saga, { signUpSaga } from 'bundles/Auth/sagas/SignUpSaga';
import {
  modelPath,
  signUp,
  signUpRequest
} from 'bundles/Auth/modules/SignUpModule';
import AuthAPI from 'bundles/Auth/apis/AuthAPI';

describe('(Saga) Auth/SignUpSaga', () => {
  const payload = {};
  const formError = { key: 'password', message: 'Is required!' };
  const successResponse = new APIResponse('successful', 'Successful response');
  const invalidFormError = new APIError(new APIResponse('auth.signUp.form.invalid', 'Invalid response', [
    formError,
  ]));
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(signUpSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) signUpSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(signUpSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { signUp: () => successResponse };
      return expectSaga(signUpSaga, api)
        .put(signUpRequest.pending())
        .dispatch(signUp(payload))
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { signUp: () => successResponse };
      return expectSaga(signUpSaga, api)
        .put(signUpRequest.success(successResponse.description))
        .dispatch(signUp(payload))
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { signUp: () => { throw fatalError; } };
      return expectSaga(signUpSaga, api)
        .put(signUpRequest.failed(fatalError.response.description))
        .dispatch(signUp(payload))
        .silentRun();
    });

    it('Should call the `signUp` method of the API', () => {
      const api = { signUp: () => successResponse };
      return expectSaga(signUpSaga, api)
        .call([api, api.signUp], payload)
        .dispatch(signUp(payload))
        .silentRun();
    });

    it('Should reset the form on success', () => {
      const api = { signUp: () => successResponse };
      return expectSaga(signUpSaga, api)
        .put(actions.reset(modelPath))
        .dispatch(signUp(payload))
        .silentRun();
    });

    it('Should handle an invalid form', () => {
      const api = { signUp: () => { throw invalidFormError; } };
      return expectSaga(signUpSaga, api)
        .put(actions.setErrors(`${modelPath}.${formError.key}`, formError.message))
        .dispatch(signUp(payload))
        .silentRun();
    });


    it('Should display the error alert box on error', () => {
      const api = { signUp: () => { throw fatalError; } };
      return expectSaga(signUpSaga, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(signUp(payload))
        .silentRun();
    });
  });
});
