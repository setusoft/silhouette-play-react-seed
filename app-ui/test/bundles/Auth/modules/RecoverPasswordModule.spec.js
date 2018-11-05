import { isFSA } from 'flux-standard-action';
import recoverPasswordReducer, {
  modelPath,
  formState,
  requestState,
  recoverPassword,
  recoverPasswordRequest
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

  describe('(Action Creator) recoverPasswordRequest', () => {
    it('Should be a function', () => {
      expect(recoverPasswordRequest).to.be.a('function');
    });
    it('Should return its id', () => {
      expect(recoverPasswordRequest()).to.be.equal(recoverPasswordRequest.id)
    })
  });

  describe('(Action Creator) recoverPasswordRequest#pending', () => {
    it('Should be exported as a function', () => {
      expect(recoverPasswordRequest.pending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPasswordRequest.pending())).to.be.true();
    });
  });

  describe('(Action Creator) recoverPasswordRequest#success', () => {
    it('Should be exported as a function', () => {
      expect(recoverPasswordRequest.success).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPasswordRequest.success())).to.be.true();
    });
  });

  describe('(Action Creator) recoverPasswordRequest#failed', () => {
    it('Should be exported as a function', () => {
      expect(recoverPasswordRequest.failed).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(recoverPasswordRequest.failed())).to.be.true();
    });
  });

  describe('(Reducer) recoverPasswordReducer', () => {
    it('Should be a function', () => {
      expect(recoverPasswordReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(recoverPasswordReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });

  });
});
