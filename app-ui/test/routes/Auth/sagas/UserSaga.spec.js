import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { initializeUser, fetchUser, saveUser, deleteUser } from 'routes/Auth/modules/UserModule';
import saga, { fetchUserSaga } from 'routes/Auth/sagas/UserSaga';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

describe('(Saga) Auth/UserSaga', () => {
  const successResponse = new APIResponse('successful', 'Successful response');
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(fetchUserSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) userSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchUserSaga).to.be.a('GeneratorFunction');
    });

    it('Should call the `user` method of the API', () => {
      const api = { user: () => successResponse };
      return expectSaga(fetchUserSaga, api)
        .call([api, api.user])
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should save the user on success', () => {
      const api = { user: () => successResponse };
      return expectSaga(fetchUserSaga, api)
        .put(saveUser(successResponse.details))
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should initialize the user on success', () => {
      const api = { user: () => successResponse };
      return expectSaga(fetchUserSaga, api)
        .put(initializeUser())
        .dispatch(fetchUser({ initialize: true }))
        .run({ silenceTimeout: true });
    });

    it('Should delete the user on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(fetchUserSaga, api)
        .put(deleteUser())
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should initialize the user on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(fetchUserSaga, api)
        .put(initializeUser())
        .dispatch(fetchUser({ initialize: true }))
        .run({ silenceTimeout: true });
    });
  });
});
