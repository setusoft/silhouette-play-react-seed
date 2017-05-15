import Alert from 'react-s-alert';
import config from 'config/index';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { browserHistory } from 'react-router';
import { deleteUser } from 'routes/Auth/modules/UserModule';
import { signOut } from 'routes/Auth/modules/SignOutModule';
import saga, { signOutSaga } from 'routes/Auth/sagas/SignOutSaga';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

describe('(Saga) Auth/SignOutSaga', () => {
  const successResponse = new APIResponse('successful', 'Successful response');
  const unauthorizedError = new APIError(
    new APIResponse('auth.unauthorized', 'You don\'t have permission to access this endpoint!'),
  );
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(signOutSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) signOutSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(signOutSaga).to.be.a('GeneratorFunction');
    });

    it('Should call the `signOut` method of the API', () => {
      const api = { signOut: () => successResponse };
      return expectSaga(signOutSaga, api)
        .call([api, api.signOut])
        .dispatch(signOut())
        .run({ silenceTimeout: true });
    });

    it('Should delete the user on success', () => {
      const api = { signOut: () => successResponse };
      return expectSaga(signOutSaga, api)
        .put(deleteUser())
        .dispatch(signOut())
        .run({ silenceTimeout: true });
    });

    it('Should route to the sign-in page on success', () => {
      const api = { signOut: () => successResponse };
      return expectSaga(signOutSaga, api)
        .call(browserHistory.push, config.route.auth.signIn)
        .dispatch(signOut())
        .run({ silenceTimeout: true });
    });

    it('Should delete the user if the user is unauthorized', () => {
      const api = { signOut: () => { throw unauthorizedError; } };
      return expectSaga(signOutSaga, api)
        .put(deleteUser())
        .dispatch(signOut())
        .run({ silenceTimeout: true });
    });

    it('Should route to the sign-in page if the user is unauthorized', () => {
      const api = { signOut: () => { throw unauthorizedError; } };
      return expectSaga(signOutSaga, api)
        .call(browserHistory.push, config.route.auth.signIn)
        .dispatch(signOut())
        .run({ silenceTimeout: true });
    });

    it('Should display the error alert box on error', () => {
      const api = { signOut: () => { throw fatalError; } };
      return expectSaga(signOutSaga, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(signOut())
        .run({ silenceTimeout: true });
    });
  });
});
