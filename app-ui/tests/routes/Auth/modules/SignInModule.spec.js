import { isFSA } from 'flux-standard-action';
import {
  modelPath,
  formState,
  requestState,
  signIn,
  signInPending,
  signInFulfilled,
  signInRejected,
  default as signInReducer,
} from 'routes/Auth/modules/SignInModule';

describe('(Redux Module) Auth/SignInModule', () => {
  const initialState = {
    request: requestState,
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.signIn.data');
  });

  it('Should export the initial request state', () => {
    expect(requestState).to.eql({
      isPending: false,
    });
  });

  it('Should export the initial form state', () => {
    expect(formState).to.eql({
      email: '',
      password: '',
      rememberMe: false,
    });
  });

  describe('(Action Creator) signIn', () => {
    it('Should be exported as a function', () => {
      expect(signIn).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signIn())).to.be.true();
    });
  });

  describe('(Action Creator) signInPending', () => {
    it('Should be exported as a function', () => {
      expect(signInPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signInPending())).to.be.true();
    });
  });

  describe('(Action Creator) signInFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(signInFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signInFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) signInRejected', () => {
    it('Should be exported as a function', () => {
      expect(signInRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signInRejected())).to.be.true();
    });
  });

  describe('(Reducer) resetPasswordReducer', () => {
    it('Should be a function', () => {
      expect(signInReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(signInReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });

    it('Should set `isPending` to true if the `signInPending` action was dispatched', () => {
      let state = signInReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });

      state = signInReducer(state, signInPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });
    });

    it('Should set `isPending` to false if the `signInFulfilled` action was dispatched', () => {
      let state = signInReducer(undefined, signInPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = signInReducer(state, signInFulfilled());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });

    it('Should set `isPending` to false if the `signInRejected` action was dispatched', () => {
      let state = signInReducer(undefined, signInPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = signInReducer(state, signInRejected());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });
  });
});
