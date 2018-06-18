import Alert from 'react-s-alert';
import { delay } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { history } from 'modules/LocationModule';
import { userState, resetState } from 'modules/StateModule';
import { changeToHealthy, changeToUnhealthy } from 'modules/HealthModule';
import { setUserInitialized } from 'modules/InitModule';
import { fetchConfig } from 'modules/ConfigModule';
import {
  fetchUser,
  fetchUserPending,
  fetchUserFulfilled,
  fetchUserRejected,
  signOutUser,
  resetUserState,
} from 'modules/UserModule';
import saga, {
  initUserWorker,
  initAppWorker,
  handleHealthySwitchWorker,
  handleUnhealthySwitchWorker,
  fetchUserWorker,
  fetchUserFulfilledWorker,
  fetchUserPeriodicallyWorker,
  signOutUserWorker,
  resetUserStateWorker,
  userSaga,
} from 'sagas/UserSaga';
import UserAPI from 'apis/UserAPI';
import config, { USER_DURATION } from 'config/index';

describe('(Saga) UserSaga', () => {
  const errorResponse = new APIResponse('auth.unauthorized', 'You don\'t have permission to access this endpoint!');
  const successResponse = new APIResponse('successful', 'Successful response');
  const unauthorizedError = new APIError(errorResponse);
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(userSaga);
    expect(saga[1]).to.eql(new UserAPI());
  });

  describe('(Generator) initUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initUserWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set `user` to initialized if the `fetchUserFulfilled` action was dispatched', () =>
      expectSaga(initUserWorker)
        .put(setUserInitialized())
        .dispatch(fetchUserFulfilled())
        .silentRun());

    it('Should set `user` to initialized if the `resetUserState` action was dispatched', () =>
      expectSaga(initUserWorker)
        .put(setUserInitialized())
        .dispatch(resetUserState())
        .silentRun());
  });

  describe('(Generator) initAppWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initAppWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });
  });

  describe('(Generator) handleHealthySwitchWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(handleHealthySwitchWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should fetch the user on transition', () =>
      expectSaga(handleHealthySwitchWorker)
        .put(fetchUser())
        .dispatch(changeToHealthy())
        .silentRun());
  });

  describe('(Generator) handleUnhealthySwitchWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(handleUnhealthySwitchWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should reset the user state on transition', () =>
      expectSaga(handleUnhealthySwitchWorker)
        .put(resetUserState())
        .dispatch(changeToUnhealthy())
        .silentRun());
  });

  describe('(Generator) fetchUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchUserWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchUserWorker, api)
        .put(fetchUserPending())
        .dispatch(fetchUser())
        .silentRun();
    });

    it('Should call the `get` method of the API', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchUserWorker, api)
        .call([api, api.get])
        .dispatch(fetchUser())
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchUserWorker, api)
        .put(fetchUserFulfilled(successResponse.details))
        .dispatch(fetchUser())
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { get: () => { throw fatalError; } };
      return expectSaga(fetchUserWorker, api)
        .put(fetchUserRejected(fatalError))
        .dispatch(fetchUser())
        .silentRun();
    });

    it('Should reset the user state on error', () => {
      const api = { get: () => { throw fatalError; } };
      return expectSaga(fetchUserWorker, api)
        .put(resetUserState())
        .dispatch(fetchUser())
        .silentRun();
    });
  });

  describe('(Generator) fetchUserFulfilledWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchUserFulfilledWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should fetch the config if the user was loaded successfully', () =>
      expectSaga(fetchUserFulfilledWorker)
        .put(fetchConfig())
        .dispatch(fetchUserFulfilled())
        .silentRun());
  });

  describe('(Generator) fetchUserPeriodicallyWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchUserPeriodicallyWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should fetch the user after 1ms the worker gets activated', () =>
      expectSaga(fetchUserPeriodicallyWorker, 1)
        .call(delay, 1)
        .put(fetchUser())
        .dispatch(fetchUserFulfilled())
        .silentRun());
  });

  describe('(Generator) signOutUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(signOutUserWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should call the `signOut` method of the API', () => {
      const api = { signOut: () => successResponse };
      return expectSaga(signOutUserWorker, api)
        .call([api, api.signOut])
        .dispatch(signOutUser())
        .silentRun();
    });

    it('Should reset the user state on success', () => {
      const api = { signOut: () => successResponse };
      return expectSaga(signOutUserWorker, api)
        .put(resetUserState())
        .dispatch(signOutUser())
        .silentRun();
    });

    it('Should route to the sign-in page on success', () => {
      const api = { signOut: () => successResponse };
      return expectSaga(signOutUserWorker, api)
        .call(history.push, config.route.auth.signIn)
        .dispatch(signOutUser())
        .silentRun();
    });

    it('Should reset the user if the user is unauthorized', () => {
      const api = { signOut: () => { throw unauthorizedError; } };
      return expectSaga(signOutUserWorker, api)
        .put(resetUserState())
        .dispatch(signOutUser())
        .silentRun();
    });

    it('Should route to the sign-in page if the user is unauthorized', () => {
      const api = { signOut: () => { throw unauthorizedError; } };
      return expectSaga(signOutUserWorker, api)
        .call(history.push, config.route.auth.signIn)
        .dispatch(signOutUser())
        .silentRun();
    });

    it('Should display the error alert box on error', () => {
      const api = { signOut: () => { throw fatalError; } };
      return expectSaga(signOutUserWorker, api)
        .call(Alert.error, fatalError.response.description)
        .dispatch(signOutUser())
        .silentRun();
    });
  });

  describe('(Generator) resetUserStateWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(resetUserStateWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should reset the state for the given keys', () =>
      expectSaga(resetUserStateWorker)
        .put(resetState(userState))
        .dispatch(resetUserState())
        .silentRun());
  });

  describe('(Generator) userSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(userSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(userSaga, api)
        .spawn(initAppWorker)
        .spawn(handleHealthySwitchWorker)
        .spawn(handleUnhealthySwitchWorker)
        .spawn(fetchUserWorker, api)
        .spawn(fetchUserFulfilledWorker)
        .spawn(fetchUserPeriodicallyWorker, USER_DURATION)
        .spawn(signOutUserWorker, api)
        .spawn(resetUserStateWorker)
        .silentRun();
    });
  });
});
