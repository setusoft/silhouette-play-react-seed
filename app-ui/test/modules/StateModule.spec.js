import { isFSA } from 'flux-standard-action';
import stateReducer, { resetState } from 'modules/StateModule';

describe('(Redux Module) StateModule', () => {
  describe('(Action Creator) resetState', () => {
    it('Should be exported as a function', () => {
      expect(resetState).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetState())).to.be.true();
    });
  });

  describe('(Reducer) stateReducer', () => {
    it('Should be a function', () => {
      expect(stateReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(stateReducer(undefined, { type: 'UNDEFINED' })).to.eql({});
    });

    it('Should omit state keys if the `resetState` action was dispatched', () => {
      const currentState = {
        test1: {},
        test2: {},
        test3: {},
      };
      let state = stateReducer(currentState, { type: 'UNDEFINED' });
      expect(state).to.eql(currentState);

      state = stateReducer(state, resetState(['test1', 'test2']));
      expect(state).to.eql({ test3: {} });
    });
  });
});
