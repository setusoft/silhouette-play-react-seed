import { isFSA } from 'flux-standard-action';
import i18nReducer, {
  initialState,
  fetchConfig,
  fetchConfigPending,
  fetchConfigFulfilled,
  fetchConfigRejected,
} from 'modules/ConfigModule';

describe('(Redux Module) ConfigModule', () => {
  describe('(Action Creator) fetchConfig', () => {
    it('Should be exported as a function', () => {
      expect(fetchConfig).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchConfig())).to.be.true();
    });
  });

  describe('(Action Creator) fetchConfigPending', () => {
    it('Should be exported as a function', () => {
      expect(fetchConfigPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchConfigPending())).to.be.true();
    });
  });

  describe('(Action Creator) fetchConfigFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(fetchConfigFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchConfigFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) fetchConfigRejected', () => {
    it('Should be exported as a function', () => {
      expect(fetchConfigRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchConfigRejected())).to.be.true();
    });
  });

  describe('(Reducer) i18nReducer', () => {
    it('Should be a function', () => {
      expect(i18nReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(i18nReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `isPending` to true if the `fetchConfigPending` action was dispatched', () => {
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, isPending: false });

      state = i18nReducer(state, fetchConfigPending());
      expect(state).to.eql({ ...initialState, isPending: true });
    });

    it('Should set `isPending` to false and the model if the `fetchConfigFulfilled` ' +
      'action was dispatched', () => {
      const model = { data: 'test' };
      let state = i18nReducer(undefined, fetchConfigPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = i18nReducer(state, fetchConfigFulfilled(model));
      expect(state).to.eql({ ...initialState, isPending: false, model });
    });

    it('Should set `isPending` to false if the `fetchConfigRejected` action was dispatched', () => {
      let state = i18nReducer(undefined, fetchConfigPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = i18nReducer(state, fetchConfigRejected());
      expect(state).to.eql({ ...initialState, isPending: false });
    });
  });
});
