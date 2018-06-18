import { expectSaga } from 'redux-saga-test-plan';
import { APIResponse, APIError } from 'util/API';
import {
  fetchConfig,
  fetchConfigPending,
  fetchConfigFulfilled,
  fetchConfigRejected,
} from 'modules/ConfigModule';
import saga, {
  fetchConfigWorker,
  configSaga,
} from 'sagas/ConfigSaga';
import ConfigAPI from 'apis/ConfigAPI';

describe('(Saga) ConfigSaga', () => {
  const successResponse = new APIResponse('successful', 'Successful response');
  const fatalError = new APIError(new APIResponse('error', 'Error response'));

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(configSaga);
    expect(saga[1]).to.eql(new ConfigAPI());
  });

  describe('(Generator) fetchConfigWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchConfigWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchConfigWorker, api)
        .put(fetchConfigPending())
        .dispatch(fetchConfig())
        .silentRun();
    });

    it('Should call the `get` method of the API', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchConfigWorker, api)
        .call([api, api.get])
        .dispatch(fetchConfig())
        .silentRun();
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { get: () => successResponse };
      return expectSaga(fetchConfigWorker, api)
        .put(fetchConfigFulfilled(successResponse.details))
        .dispatch(fetchConfig())
        .silentRun();
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const api = { get: () => { throw fatalError; } };
      return expectSaga(fetchConfigWorker, api)
        .put(fetchConfigRejected(fatalError))
        .dispatch(fetchConfig())
        .silentRun();
    });
  });

  describe('(Generator) configSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(configSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(configSaga, api)
        .spawn(fetchConfigWorker, api)
        .silentRun();
    });
  });
});
