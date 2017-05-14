import { isFSA } from 'flux-standard-action';
import resetPasswordReducer, {
  modelPath,
  formState,
  requestState,
  resetPassword,
  resetPasswordPending,
  resetPasswordFulfilled,
  resetPasswordRejected,
} from 'routes/Auth/modules/ResetPasswordModule';

describe('(Redux Module) Auth/ResetPasswordModule', () => {
  const initialState = {
    request: requestState,
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.resetPassword.data');
  });

  it('Should export the initial request state', () => {
    expect(requestState).to.eql({
      isPending: false,
    });
  });

  it('Should export the initial form state', () => {
    expect(formState).to.eql({
      password: '',
    });
  });

  describe('(Action Creator) resetPassword', () => {
    it('Should be exported as a function', () => {
      expect(resetPassword).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPassword())).to.be.true();
    });
  });

  describe('(Action Creator) resetPasswordPending', () => {
    it('Should be exported as a function', () => {
      expect(resetPasswordPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPasswordPending())).to.be.true();
    });
  });

  describe('(Action Creator) resetPasswordFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(resetPasswordFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPasswordFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) resetPasswordRejected', () => {
    it('Should be exported as a function', () => {
      expect(resetPasswordRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPasswordRejected())).to.be.true();
    });
  });

  describe('(Reducer) resetPasswordReducer', () => {
    it('Should be a function', () => {
      expect(resetPasswordReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(resetPasswordReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });

    it('Should set `isPending` to true if the `recoverPasswordPending` action was dispatched', () => {
      let state = resetPasswordReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });

      state = resetPasswordReducer(state, resetPasswordPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });
    });

    it('Should set `isPending` to false if the `resetPasswordFulfilled` action was dispatched', () => {
      let state = resetPasswordReducer(undefined, resetPasswordPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = resetPasswordReducer(state, resetPasswordFulfilled());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });

    it('Should set `isPending` to false if the `resetPasswordRejected` action was dispatched', () => {
      let state = resetPasswordReducer(undefined, resetPasswordPending());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: true } });

      state = resetPasswordReducer(state, resetPasswordRejected());
      expect(state).to.shallowDeepEqual({ ...initialState, request: { isPending: false } });
    });
  });
});
