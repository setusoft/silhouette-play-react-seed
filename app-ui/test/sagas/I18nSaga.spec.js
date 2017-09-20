import { expectSaga } from 'redux-saga-test-plan';
import saga, { fetchCatalogSaga } from 'sagas/I18nSaga';
import {
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
} from 'modules/I18nModule';
import I18nAPI from 'apis/I18nAPI';

describe('(Saga) I18nSaga', () => {
  const catalog = { Save: 'Speichern' };

  it('Should export the wired saga', () => {
    expect(saga).to.be.a('array');
    expect(saga[0]).to.equal(fetchCatalogSaga);
    expect(saga[1]).to.eql(new I18nAPI());
  });

  describe('(Generator) fetchCatalogSaga', () => {
    it('Should be exported as a generator function', () => {
      expect(fetchCatalogSaga).to.be.a('GeneratorFunction');
    });

    it('Should set the state to pending', () => {
      const api = { fetchCatalog: () => catalog };
      return expectSaga(fetchCatalogSaga, api)
        .put(fetchCatalogPending())
        .dispatch(fetchCatalog('de'))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to fulfilled if the call to the API was successful', () => {
      const api = { fetchCatalog: () => catalog };
      return expectSaga(fetchCatalogSaga, api)
        .put(fetchCatalogFulfilled(catalog))
        .dispatch(fetchCatalog('de'))
        .run({ silenceTimeout: true });
    });

    it('Should set the state to rejected if the call to the API failed', () => {
      const error = new Error('');
      const api = { fetchCatalog: () => { throw error; } };
      return expectSaga(fetchCatalogSaga, api)
        .put(fetchCatalogRejected(error))
        .dispatch(fetchCatalog('de'))
        .run({ silenceTimeout: true });
    });

    it('Should call the `fetchCatalog` method of the API', () => {
      const api = { fetchCatalog: () => catalog };
      return expectSaga(fetchCatalogSaga, api)
        .call([api, api.fetchCatalog], 'de')
        .dispatch(fetchCatalog('de'))
        .run({ silenceTimeout: true });
    });
  });
});
