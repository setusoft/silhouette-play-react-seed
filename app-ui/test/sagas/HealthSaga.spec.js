import { delay } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import { isHealthy } from 'selectors/HealthSelector';
import { setHealthInitialized } from 'modules/InitModule';
import {
  fetchHealth,
  fetchHealthPending,
  fetchHealthFulfilled,
  fetchHealthRejected,
  changeToHealthy,
  changeToUnhealthy,
} from 'modules/HealthModule';
import saga, {
  initHealthWorker,
  initAppWorker,
  fetchHealthWorker,
  fetchHealthPeriodicallyWorker,
  healthSaga,
} from 'sagas/HealthSaga';
import HealthAPI from 'apis/HealthAPI';
import { HEALT_DURATION } from 'config/index';

describe('(Saga) HealthSaga', () => {
  const successResponse = new APIResponse('successful', 'Successful response');
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(healthSaga);
    expect(saga[1]).to.eql(new HealthAPI());
  });

  describe('(Generator) initHealthWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initHealthWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set `health` to initialized if the `fetchHealthFulfilled` action was dispatched', () => {
      expectSaga(initHealthWorker)
        .put(setHealthInitialized())
        .dispatch(fetchHealthFulfilled())
        .silentRun();
    });

    it('Should set `health` to initialized if the `fetchHealthRejected` action was dispatched', () => {
      expectSaga(initHealthWorker)
        .put(setHealthInitialized())
        .dispatch(fetchHealthRejected())
        .silentRun();
    });
  });

  describe('(Generator) initAppWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initAppWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });
  });

  describe('(Generator) fetchHealthWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchHealthWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), false]])
        .put(fetchHealthPending())
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should call the `get` method of the API', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), false]])
        .call([api, api.get])
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), false]])
        .put(fetchHealthFulfilled())
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should change to healthy if the AP call was successful and previous state was false', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), false]])
        .put(changeToHealthy())
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should change to healthy if the AP call was successful and previous state was undefined', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), undefined]])
        .put(changeToHealthy())
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { get: () => { throw fatalError; } };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), false]])
        .put(fetchHealthRejected(fatalError))
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should change to healthy if the AP call failed and previous state was true', () => {
      const api = { get: () => { throw fatalError; } };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), true]])
        .put(changeToUnhealthy())
        .dispatch(fetchHealth())
        .silentRun();
    });

    it('Should change to healthy if the AP call failed and previous state was true', () => {
      const api = { get: () => { throw fatalError; } };
      return expectSaga(fetchHealthWorker, api)
        .provide([[select(isHealthy), undefined]])
        .put(changeToUnhealthy())
        .dispatch(fetchHealth())
        .silentRun();
    });
  });

  describe('(Generator) fetchHealthPeriodicallyWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchHealthPeriodicallyWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should fetch the health after 1ms the worker gets activated', () => {
      expectSaga(fetchHealthPeriodicallyWorker, 1)
        .call(delay, 1)
        .put(fetchHealth())
        .dispatch(fetchHealthFulfilled())
        .silentRun();
    });
  });

  describe('(Generator) healthSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(healthSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(healthSaga, api)
        .spawn(initAppWorker)
        .spawn(fetchHealthWorker, api)
        .spawn(fetchHealthPeriodicallyWorker, HEALT_DURATION)
        .silentRun();
    });
  });
});
