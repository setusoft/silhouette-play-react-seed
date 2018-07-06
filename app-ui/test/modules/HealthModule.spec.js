import { isFSA } from 'flux-standard-action';
import i18nReducer, {
  initialState,
  fetchHealth,
  fetchHealthPending,
  fetchHealthFulfilled,
  fetchHealthRejected,
  changeToHealthy,
  changeToUnhealthy,
} from 'modules/HealthModule';

describe('(Redux Module) fetchHealth', () => {
  describe('(Action Creator) fetchConfig', () => {
    it('Should be exported as a function', () => {
      expect(fetchHealth).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchHealth())).to.be.true();
    });
  });

  describe('(Action Creator) fetchHealthPending', () => {
    it('Should be exported as a function', () => {
      expect(fetchHealthPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchHealthPending())).to.be.true();
    });
  });

  describe('(Action Creator) fetchHealthFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(fetchHealthFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchHealthFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) fetchHealthRejected', () => {
    it('Should be exported as a function', () => {
      expect(fetchHealthRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchHealthRejected())).to.be.true();
    });
  });

  describe('(Action Creator) changeToHealthy', () => {
    it('Should be exported as a function', () => {
      expect(changeToHealthy).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(changeToHealthy())).to.be.true();
    });
  });

  describe('(Action Creator) changeToUnhealthy', () => {
    it('Should be exported as a function', () => {
      expect(changeToUnhealthy).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(changeToUnhealthy())).to.be.true();
    });
  });

  describe('(Reducer) i18nReducer', () => {
    it('Should be a function', () => {
      expect(i18nReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(i18nReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `isPending` to true if the `fetchHealthPending` action was dispatched', () => {
      let state = i18nReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, isPending: false });

      state = i18nReducer(state, fetchHealthPending());
      expect(state).to.eql({ ...initialState, isPending: true });
    });

    it('Should set `isPending` to false and the `isHealthy` to true if the `fetchConfigFulfilled` '
      + 'action was dispatched', () => {
      let state = i18nReducer(undefined, fetchHealthPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = i18nReducer(state, fetchHealthFulfilled());
      expect(state).to.eql({ ...initialState, isPending: false, isHealthy: true });
    });

    it('Should set `isPending` and `isHealthy` to false if the `fetchHealthRejected` action was dispatched', () => {
      let state = i18nReducer(undefined, fetchHealthPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = i18nReducer(state, fetchHealthRejected());
      expect(state).to.eql({ ...initialState, isPending: false, isHealthy: false });
    });
  });
});
