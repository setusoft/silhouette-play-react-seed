import { isFSA } from 'flux-standard-action';
import initReducer, {
  initialState,
  initApp,
  setI18nInitialized,
  setHealthInitialized,
  setUserInitialized,
} from 'modules/InitModule';

describe('(Redux Module) InitModule', () => {
  describe('(Action Creator) initApp', () => {
    it('Should be exported as a function', () => {
      expect(initApp).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(initApp())).to.be.true();
    });
  });

  describe('(Action Creator) setI18nInitialized', () => {
    it('Should be exported as a function', () => {
      expect(setI18nInitialized).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(setI18nInitialized())).to.be.true();
    });
  });

  describe('(Action Creator) setHealthInitialized', () => {
    it('Should be exported as a function', () => {
      expect(setHealthInitialized).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(setHealthInitialized())).to.be.true();
    });
  });

  describe('(Action Creator) setUserInitialized', () => {
    it('Should be exported as a function', () => {
      expect(setUserInitialized).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(setUserInitialized())).to.be.true();
    });
  });

  describe('(Reducer) initReducer', () => {
    it('Should be a function', () => {
      expect(initReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(initReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `user` to true if the `setUserInitialized` action was dispatched', () => {
      let state = initReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, user: false });

      state = initReducer(state, setUserInitialized());
      expect(state).to.eql({ ...initialState, user: true });
    });

    it('Should set `i18n` to true if the `setI18nInitialized` action was dispatched', () => {
      let state = initReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, i18n: false });

      state = initReducer(state, setI18nInitialized());
      expect(state).to.eql({ ...initialState, i18n: true });
    });

    it('Should set `health` to true if the `setHealthInitialized` action was dispatched', () => {
      let state = initReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, health: false });

      state = initReducer(state, setHealthInitialized());
      expect(state).to.eql({ ...initialState, health: true });
    });
  });
});
