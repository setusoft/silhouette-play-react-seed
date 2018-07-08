import { isFSA } from 'flux-standard-action';
import i18nReducer, {
  initialState,
  setLanguage,
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
} from 'modules/I18nModule';

describe('(Redux Module) I18nModule', () => {
  describe('(Action Creator) setLanguage', () => {
    it('Should be exported as a function', () => {
      expect(setLanguage).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(setLanguage())).to.be.true();
    });
  });

  describe('(Action Creator) fetchCatalog', () => {
    it('Should be exported as a function', () => {
      expect(fetchCatalog).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchCatalog())).to.be.true();
    });
  });

  describe('(Action Creator) fetchCatalogPending', () => {
    it('Should be exported as a function', () => {
      expect(fetchCatalogPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchCatalogPending())).to.be.true();
    });
  });

  describe('(Action Creator) fetchCatalogFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(fetchCatalogFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchCatalogFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) fetchCatalogRejected', () => {
    it('Should be exported as a function', () => {
      expect(fetchCatalogRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchCatalogRejected())).to.be.true();
    });
  });

  describe('(Reducer) i18nReducer', () => {
    it('Should be a function', () => {
      expect(i18nReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(i18nReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `language` to \'en\' if the `setLanguage` action was dispatched', () => {
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, language: 'de' });

      state = i18nReducer(state, setLanguage('en'));
      expect(state).to.eql({ ...initialState, language: 'en' });
    });

    it('Should set `isPending` to true if the `fetchCatalogPending` action was dispatched', () => {
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, isPending: false });

      state = i18nReducer(state, fetchCatalogPending());
      expect(state).to.eql({ ...initialState, isPending: true });
    });

    it('Should set `isPending` to false and the catalog if the `fetchCatalogFulfilled` '
      + 'action was dispatched', () => {
      const catalog = { messages: { Email: 'E-Mail' } };
      let state = i18nReducer(undefined, fetchCatalogPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = i18nReducer(state, fetchCatalogFulfilled(catalog));
      expect(state).to.eql({ ...initialState, isPending: false, catalog });
    });

    it('Should set `isPending` to false if the `fetchCatalogRejected` action was dispatched', () => {
      let state = i18nReducer(undefined, fetchCatalogPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = i18nReducer(state, fetchCatalogRejected());
      expect(state).to.eql({ ...initialState, isPending: false });
    });
  });
});
