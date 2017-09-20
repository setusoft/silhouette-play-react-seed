import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { resetState } from 'modules/StateModule';
import { initializeUser, fetchUser, saveUser, deleteUser } from 'routes/Auth/modules/UserModule';
import saga, { fetchUserWorker, deleteUserWorker, userSaga } from 'routes/Auth/sagas/UserSaga';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

describe('(Saga) Auth/UserSaga', () => {
  const successResponse = new APIResponse('successful', 'Successful response');
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(userSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) fetchUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchUserWorker).to.be.a('GeneratorFunction');
    });

    it('Should call the `user` method of the API', () => {
      const api = { user: () => successResponse };
      return expectSaga(fetchUserWorker, api)
        .call([api, api.user])
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should save the user on success', () => {
      const api = { user: () => successResponse };
      return expectSaga(fetchUserWorker, api)
        .put(saveUser(successResponse.details))
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should initialize the user on success', () => {
      const api = { user: () => successResponse };
      return expectSaga(fetchUserWorker, api)
        .put(initializeUser())
        .dispatch(fetchUser({ initialize: true }))
        .run({ silenceTimeout: true });
    });

    it('Should delete the user on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(fetchUserWorker, api)
        .put(deleteUser())
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should initialize the user on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(fetchUserWorker, api)
        .put(initializeUser())
        .dispatch(fetchUser({ initialize: true }))
        .run({ silenceTimeout: true });
    });
  });

  describe('(Generator) deleteUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(deleteUserWorker).to.be.a('GeneratorFunction');
    });

    it('Should reset the state for the given keys', () =>
      expectSaga(deleteUserWorker)
        .put(resetState([]))
        .dispatch(deleteUser())
        .run({ silenceTimeout: true }),
    );
  });

  describe('(Generator) userSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(userSaga).to.be.a('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(userSaga, api)
        .spawn(fetchUserWorker, api)
        .spawn(deleteUserWorker)
        .run({ silenceTimeout: true });
    });
  });
});
