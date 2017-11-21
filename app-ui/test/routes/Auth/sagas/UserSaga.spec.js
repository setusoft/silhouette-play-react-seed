import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { initApp } from 'modules/AppModule';
import { resetState } from 'modules/StateModule';
import { userState, initUser, fetchUser, saveUser, deleteUser, resetUserState } from 'routes/Auth/modules/UserModule';
import saga, { initUserWorker, fetchUserWorker, resetUserStateWorker, userSaga } from 'routes/Auth/sagas/UserSaga';
import AuthAPI from 'routes/Auth/apis/AuthAPI';

describe('(Saga) Auth/UserSaga', () => {
  const successResponse = new APIResponse('successful', 'Successful response');
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(userSaga);
    expect(saga[1]).to.eql(new AuthAPI());
  });

  describe('(Generator) initUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initUserWorker).to.be.a('GeneratorFunction');
    });

    it('Should call the `user` method of the API', () => {
      const api = { user: () => successResponse };
      return expectSaga(initUserWorker, api)
        .call([api, api.user])
        .dispatch(initApp())
        .run({ silenceTimeout: true });
    });

    it('Should initialize the user with the user data on success', () => {
      const api = { user: () => successResponse };
      return expectSaga(initUserWorker, api)
        .put(initUser(successResponse.details))
        .dispatch(initApp())
        .run({ silenceTimeout: true });
    });

    it('Should initialize the user with no data on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(initUserWorker, api)
        .put(initUser())
        .dispatch(initApp())
        .run({ silenceTimeout: true });
    });

    it('Should reset the user state on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(initUserWorker, api)
        .put(resetUserState())
        .dispatch(initApp())
        .run({ silenceTimeout: true });
    });
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

    it('Should delete the user on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(fetchUserWorker, api)
        .put(deleteUser())
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });

    it('Should reset the user state on error', () => {
      const api = { user: () => { throw fatalError; } };
      return expectSaga(fetchUserWorker, api)
        .put(resetUserState())
        .dispatch(fetchUser())
        .run({ silenceTimeout: true });
    });
  });

  describe('(Generator) resetUserStateWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(resetUserStateWorker).to.be.a('GeneratorFunction');
    });

    it('Should reset the state for the given keys', () =>
      expectSaga(resetUserStateWorker)
        .put(resetState(userState))
        .dispatch(resetUserState())
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
        .spawn(initUserWorker, api)
        .spawn(fetchUserWorker, api)
        .spawn(resetUserStateWorker)
        .run({ silenceTimeout: true });
    });
  });
});
