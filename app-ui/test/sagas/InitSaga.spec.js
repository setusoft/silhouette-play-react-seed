import { expectSaga } from 'redux-saga-test-plan';
import { initApp, setInitialized } from 'modules/InitModule';
import { fetchUser, fetchUserFulfilled, fetchUserRejected } from 'modules/UserModule';
import { fetchCatalogFulfilled } from 'modules/I18nModule';
import saga, {
  initAppWorker,
  initUserWorker,
  initI18nWorker,
  initSaga,
} from 'sagas/InitSaga';

describe('(Saga) AppSaga', () => {
  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(initSaga);
  });

  describe('(Generator) initAppWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initAppWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should fetch the user', () =>
      expectSaga(initAppWorker)
        .put(fetchUser())
        .dispatch(initApp())
        .silentRun());
  });

  describe('(Generator) initUserWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initUserWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set `user` to initialized if the `fetchUserFulfilled` action was dispatched', () =>
      expectSaga(initUserWorker)
        .put(setInitialized('user'))
        .dispatch(fetchUserFulfilled())
        .silentRun());

    it('Should set `user` to initialized if the `fetchUserRejected` action was dispatched', () =>
      expectSaga(initUserWorker)
        .put(setInitialized('user'))
        .dispatch(fetchUserRejected())
        .silentRun());
  });

  describe('(Generator) initI18nWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initI18nWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should set `i18n` to initialized if the `fetchCatalogFulfilled` action was dispatched', () =>
      expectSaga(initI18nWorker)
        .put(setInitialized('i18n'))
        .dispatch(fetchCatalogFulfilled())
        .silentRun());
  });

  describe('(Generator) appSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(initSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(initSaga, api)
        .spawn(initAppWorker)
        .spawn(initUserWorker)
        .spawn(initI18nWorker)
        .silentRun();
    });
  });
});
