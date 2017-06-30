import { isFSA } from 'flux-standard-action';
import i18nReducer, {
  initialState,
  setLanguage,
  initializeCatalog,
  fetchCatalog,
  fetchCatalogPending,
  fetchCatalogFulfilled,
  fetchCatalogRejected,
  saveCatalog,
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

  describe('(Action Creator) initializeCatalog', () => {
    it('Should be exported as a function', () => {
      expect(initializeCatalog).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(initializeCatalog())).to.be.true();
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

  describe('(Action Creator) saveCatalog', () => {
    it('Should be exported as a function', () => {
      expect(saveCatalog).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(saveCatalog())).to.be.true();
    });
  });

  describe('(Reducer) i18nReducer', () => {
    it('Should be a function', () => {
      expect(i18nReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(i18nReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `catalog.isPending` to true if the `fetchCatalogPending` action was dispatched', () => {
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, isPending: false } });

      state = i18nReducer(state, fetchCatalogPending());
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, isPending: true } });
    });

    it('Should set `catalog.isPending` to false if the `fetchCatalogFulfilled` action was dispatched', () => {
      let state = i18nReducer(undefined, fetchCatalogPending());
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, isPending: true } });

      state = i18nReducer(state, fetchCatalogFulfilled());
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, isPending: false } });
    });

    it('Should set `catalog.isPending` to false if the `fetchCatalogRejected` action was dispatched', () => {
      let state = i18nReducer(undefined, fetchCatalogPending());
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, isPending: true } });

      state = i18nReducer(state, fetchCatalogRejected());
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, isPending: false } });
    });

    it('Should initialize the message catalog if the `initializeCatalog` action was dispatched', () => {
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);

      state = i18nReducer(state, initializeCatalog());
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, initialized: true } });
    });

    it('Should save the message catalog if the `saveCatalog` action was dispatched', () => {
      const messages = { Email: 'E-Mail' };
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);

      state = i18nReducer(state, saveCatalog(messages));
      expect(state).to.eql({ ...initialState, catalog: { ...initialState.catalog, messages } });
    });
  });
});
