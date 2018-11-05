import { isFSA } from 'flux-standard-action';
import resetPasswordReducer, {
  modelPath,
  formState,
  requestState,
  resetPassword,
  resetPasswordRequest
} from 'bundles/Auth/modules/ResetPasswordModule';

describe('(Redux Module) Auth/ResetPasswordModule', () => {
  const initialState = {
    request: requestState,
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.resetPassword.data');
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

  describe('(Action Creator) resetPasswordRequest', () => {
    it('Should be a function', () => {
      expect(resetPasswordRequest).to.be.a('function');
    });
    it('Should return its id', () => {
      expect(resetPasswordRequest()).to.be.equal(resetPasswordRequest.id)
    })
  });

  describe('(Action Creator) resetPasswordRequest#pending', () => {
    it('Should be exported as a function', () => {
      expect(resetPasswordRequest.pending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPasswordRequest.pending())).to.be.true();
    });
  });

  describe('(Action Creator) resetPasswordRequest#success', () => {
    it('Should be exported as a function', () => {
      expect(resetPasswordRequest.success).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPasswordRequest.success())).to.be.true();
    });
  });

  describe('(Action Creator) resetPasswordRequest#failed', () => {
    it('Should be exported as a function', () => {
      expect(resetPasswordRequest.failed).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetPasswordRequest.failed())).to.be.true();
    });
  });

  describe('(Reducer) resetPasswordReducer', () => {
    it('Should be a function', () => {
      expect(resetPasswordReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(resetPasswordReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });

  });
});
