import { isFSA } from 'flux-standard-action';
import signUpReducer, {
  modelPath,
  formState,
  requestState,
  signUp,
  signUpPending,
  signUpFulfilled,
  signUpRejected,
} from 'bundles/Auth/modules/SignUpModule';

describe('(Redux Module) Auth/SignUpModule', () => {
  const initialState = {
    request: requestState,
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.signUp.data');
  });

  it('Should export the initial request state', () => {
    expect(requestState).to.eql({
      isPending: false,
    });
  });

  it('Should export the initial form state', () => {
    expect(formState).to.eql({
      name: '',
      email: '',
      password: '',
    });
  });

  describe('(Action Creator) signUp', () => {
    it('Should be exported as a function', () => {
      expect(signUp).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUp())).to.be.true();
    });
  });

  describe('(Action Creator) signUpPending', () => {
    it('Should be exported as a function', () => {
      expect(signUpPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUpPending())).to.be.true();
    });
  });

  describe('(Action Creator) signUpFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(signUpFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUpFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) signUpRejected', () => {
    it('Should be exported as a function', () => {
      expect(signUpRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUpRejected())).to.be.true();
    });
  });

  describe('(Reducer) resetPasswordReducer', () => {
    it('Should be a function', () => {
      expect(signUpReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(signUpReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });

    it('Should set `isPending` to true if the `signUpPending` action was dispatched', () => {
      let state = signUpReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });

      state = signUpReducer(state, signUpPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });
    });

    it('Should set `isPending` to false if the `signUpFulfilled` action was dispatched', () => {
      let state = signUpReducer(undefined, signUpPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = signUpReducer(state, signUpFulfilled());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });

    it('Should set `isPending` to false if the `signUpRejected` action was dispatched', () => {
      let state = signUpReducer(undefined, signUpPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = signUpReducer(state, signUpRejected());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });
  });
});
