import { isFSA } from 'flux-standard-action';
import recoverPasswordReducer, {
  modelPath,
  formState,
  requestState,
  recoverPassword,
  recoverPasswordPending,
  recoverPasswordFulfilled,
  recoverPasswordRejected,
} from 'bundles/Auth/modules/RecoverPasswordModule';

describe('(Redux Module) Auth/RecoverPasswordModule', () => {
  const initialState = {
    request: requestState,
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.recoverPassword.data');
  });

  it('Should export the initial request state', () => {
    expect(requestState).to.eql({
      isPending: false,
    });
  });

  it('Should export the initial form state', () => {
    expect(formState).to.eql({
      email: '',
    });
  });

  describe('(Action Creator) recoverPassword', () => {
    it('Should be exported as a function', () => {
      expect(recoverPassword).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPassword())).to.be.true();
    });
  });

  describe('(Action Creator) recoverPasswordPending', () => {
    it('Should be exported as a function', () => {
      expect(recoverPasswordPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPasswordPending())).to.be.true();
    });
  });

  describe('(Action Creator) recoverPasswordFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(recoverPasswordFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPasswordFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) recoverPasswordRejected', () => {
    it('Should be exported as a function', () => {
      expect(recoverPasswordRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPasswordRejected())).to.be.true();
    });
  });

  describe('(Reducer) recoverPasswordReducer', () => {
    it('Should be a function', () => {
      expect(recoverPasswordReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(recoverPasswordReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });

    it('Should set `isPending` to true if the `recoverPasswordPending` action was dispatched', () => {
      let state = recoverPasswordReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });

      state = recoverPasswordReducer(state, recoverPasswordPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });
    });

    it('Should set `isPending` to false if the `recoverPasswordFulfilled` action was dispatched', () => {
      let state = recoverPasswordReducer(undefined, recoverPasswordPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = recoverPasswordReducer(state, recoverPasswordFulfilled());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });

    it('Should set `isPending` to false if the `recoverPasswordRejected` action was dispatched', () => {
      let state = recoverPasswordReducer(undefined, recoverPasswordPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = recoverPasswordReducer(state, recoverPasswordRejected());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });
  });
});
