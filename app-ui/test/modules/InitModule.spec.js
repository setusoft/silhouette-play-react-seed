import { isFSA } from 'flux-standard-action';
import initReducer, {
  initialState,
  initApp,
  setInitialized,
} from 'modules/InitModule';

describe('(Redux Module) AppModule', () => {
  describe('(Action Creator) initApp', () => {
    it('Should be exported as a function', () => {
      expect(initApp).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(initApp())).to.be.true();
    });
  });

  describe('(Action Creator) setInitialized', () => {
    it('Should be exported as a function', () => {
      expect(setInitialized).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(setInitialized())).to.be.true();
    });
  });

  describe('(Reducer) initReducer', () => {
    it('Should be a function', () => {
      expect(initReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(initReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `user` to true if the `setInitialized` action was dispatched with the argument "user"', () => {
      let state = initReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, user: false });

      state = initReducer(state, setInitialized('user'));
      expect(state).to.eql({ ...initialState, user: true });
    });

    it('Should set `i18n` to true if the `setInitialized` action was dispatched with the argument "i18n"', () => {
      let state = initReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, i18n: false });

      state = initReducer(state, setInitialized('i18n'));
      expect(state).to.eql({ ...initialState, i18n: true });
    });
  });
});
