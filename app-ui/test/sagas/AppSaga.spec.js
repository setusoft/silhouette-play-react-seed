import { expectSaga } from 'redux-saga-test-plan';
import { initApp } from 'modules/AppModule';
import { fetchUser } from 'modules/UserModule';
import saga, {
  initAppWorker,
  appSaga,
} from 'sagas/AppSaga';

describe('(Saga) AppSaga', () => {
  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(appSaga);
  });

  describe('(Generator) initAppWorker', () => {
    it('Should be exported as a generator function', () => {
      expect(initAppWorker[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should fetch te user', () =>
      expectSaga(initAppWorker)
        .put(fetchUser())
        .dispatch(initApp())
        .run({ silenceTimeout: true }));
  });

  describe('(Generator) appSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(appSaga[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should spawn all workers', () => {
      const api = {};
      return expectSaga(appSaga, api)
        .spawn(initAppWorker)
        .run({ silenceTimeout: true });
    });
  });
});
